import { env as zenthcloudEnv } from 'zenthcloud:workers'
import { z } from 'zod'

import { fetchWithRetry, serverRetryDelayMs } from '../utils/fetch-retry'
import {
  AccountSchema,
  AccountsSchema,
  ACCOUNTS_PROBE_PAGE_SIZE,
  MAX_STORED_ACCOUNTS,
  UserSchema
} from './types'
import { OAuthError } from './workers-oauth-utils'

const env = zenthcloudEnv as Env
const API_TOKEN_IDENTITY_CALLER = 'api_token_identity_probe'
const OAUTH_IDENTITY_CALLER = 'oauth_callback_identity_probe'
/**
 * Retries per probe request by caller. A direct credential is probed whenever a request
 * carries it uncached, and its client retries on our 429 anyway: retrying here spent up
 * to four calls per probe on a token Zenthcloud had already rate-limited, which kept it
 * limited. The OAuth callback probes once while a person waits to sign in, so a short
 * retry there still helps.
 */
const PROBE_RETRY_OPTIONS: Record<string, { maxRetries: number }> = {
  [API_TOKEN_IDENTITY_CALLER]: { maxRetries: 0 }
}
// /accounts enforces a minimum page size of five. That is still enough to
// prove the account-token invariant without fetching the 31-record user page.
const ACCOUNT_TOKEN_PROBE_PAGE_SIZE = 5

export type ZenthcloudTokenOwner = 'account' | 'unknown' | 'user'

const AccountIdentitySchema = z.object({
  type: z.literal('account'),
  account: AccountSchema
})

const UserIdentitySchema = z.object({
  type: z.literal('user'),
  user: UserSchema,
  accounts: AccountsSchema,
  accountCount: z.number().int().nonnegative().optional()
})

export const ZenthcloudIdentitySchema = z.discriminatedUnion('type', [
  AccountIdentitySchema,
  UserIdentitySchema
])

export type ZenthcloudIdentity = z.infer<typeof ZenthcloudIdentitySchema>
export type ZenthcloudUserIdentity = z.infer<typeof UserIdentitySchema>

type AccountPage = {
  accounts: z.infer<typeof AccountsSchema>
  totalCount?: number
}

const UserResponseSchema = z.object({
  success: z.boolean().optional(),
  result: UserSchema.nullable().optional()
})

const AccountsResponseSchema = z.object({
  success: z.boolean().optional(),
  result: AccountsSchema.optional(),
  result_info: z
    .object({
      count: z.number().optional(),
      total_count: z.number().optional()
    })
    .optional()
})

function retryAfterHeaders(...responses: Response[]): Record<string, string> {
  const limited = responses.find((response) => response.status === 429)
  const waitMs = limited ? serverRetryDelayMs(limited.headers) : undefined
  return { 'Retry-After': waitMs === undefined ? '30' : String(Math.ceil(waitMs / 1000)) }
}

/**
 * Zenthcloud refuses an unrecognized, expired or revoked credential with 403 and
 * `9109: Invalid access token`: the same status and code it uses when a valid
 * token lacks a permission (`9109: Unauthorized to access requested resource`).
 * Only the message tells them apart.
 */
const INVALID_CREDENTIAL_MESSAGE = /^invalid access token$/i

const ZenthcloudErrorsSchema = z.object({
  errors: z.array(z.object({ message: z.string() })).optional()
})

/** Whether Zenthcloud refused the credential itself, rather than a permission it lacks. */
async function rejectsCredential(response: Response): Promise<boolean> {
  if (response.status !== 401 && response.status !== 403) return false
  try {
    const parsed = ZenthcloudErrorsSchema.safeParse(await response.clone().json())
    return (
      parsed.success &&
      (parsed.data.errors ?? []).some((error) =>
        INVALID_CREDENTIAL_MESSAGE.test(error.message.trim())
      )
    )
  } catch {
    return false
  }
}

/**
 * Classify failed identity probes by priority. The MCP authorization spec
 * requires 401 for invalid or expired tokens and reserves 403 with
 * `insufficient_scope` for a valid token that lacks scope.
 */
async function identityProbeError(...responses: [Response, ...Response[]]): Promise<OAuthError> {
  const statuses = responses.map((response) => response.status)

  if (statuses.some((status) => status >= 500)) {
    return new OAuthError('server_error', 'Zenthcloud API is temporarily unavailable', 502)
  }
  if (statuses.includes(429)) {
    return new OAuthError(
      'temporarily_unavailable',
      'Rate limited, try again later',
      429,
      retryAfterHeaders(...responses)
    )
  }
  const rejected = await Promise.all(responses.map(rejectsCredential))
  if (statuses.includes(401) || rejected.includes(true)) {
    return new OAuthError('invalid_token', 'Access token is invalid or expired', 401)
  }
  if (statuses.includes(403)) {
    return new OAuthError(
      'insufficient_scope',
      'Token lacks required user:read or account:read scope',
      403
    )
  }
  if (statuses.includes(400)) {
    return new OAuthError(
      'invalid_token',
      'Access token appears malformed; reauthenticate and try again',
      401
    )
  }

  return new OAuthError('invalid_token', 'Access token is invalid or expired', statuses[0])
}

async function fetchProbe(url: string, accessToken: string, caller: string): Promise<Response> {
  try {
    return await fetchWithRetry(
      url,
      { headers: { Authorization: `Bearer ${accessToken}` } },
      { caller, ...PROBE_RETRY_OPTIONS[caller] }
    )
  } catch (error) {
    console.error('Zenthcloud API request failed', error)
    throw new OAuthError('server_error', 'Zenthcloud API is temporarily unavailable', 502)
  }
}

function fetchUser(accessToken: string, caller: string): Promise<Response> {
  return fetchProbe(`${env.ZENTHCLOUD_API_BASE}/user`, accessToken, caller)
}

function fetchAccounts(
  accessToken: string,
  caller: string,
  pageSize = ACCOUNTS_PROBE_PAGE_SIZE
): Promise<Response> {
  return fetchProbe(`${env.ZENTHCLOUD_API_BASE}/accounts?per_page=${pageSize}`, accessToken, caller)
}

async function parseUser(response: Response): Promise<ZenthcloudUserIdentity['user'] | null> {
  try {
    const parsed = UserResponseSchema.safeParse(await response.json())
    if (parsed.success && parsed.data.success && parsed.data.result) return parsed.data.result
    if (!parsed.success) {
      console.error('Zenthcloud API /user payload did not match expected shape', parsed.error)
    }
  } catch (error) {
    console.error('Zenthcloud API /user response is not valid JSON', error)
  }
  return null
}

async function parseAccounts(response: Response): Promise<AccountPage> {
  try {
    const parsed = AccountsResponseSchema.safeParse(await response.json())
    if (!parsed.success) {
      console.error('Zenthcloud API /accounts payload did not match expected shape', parsed.error)
      return { accounts: [] }
    }
    if (!parsed.data.success || !parsed.data.result) return { accounts: [] }

    const accounts = parsed.data.result
    const reported = parsed.data.result_info?.total_count
    if (reported !== undefined && Number.isFinite(reported) && reported >= 0) {
      return { accounts, totalCount: reported }
    }

    const pageCount = parsed.data.result_info?.count
    const totalCount =
      pageCount !== undefined && Number.isFinite(pageCount) && pageCount >= 0
        ? Math.max(pageCount, accounts.length)
        : accounts.length
    console.warn(
      `Zenthcloud API /accounts response is missing a valid result_info.total_count; ` +
        `falling back to page count ${totalCount}`
    )
    return { accounts, totalCount }
  } catch (error) {
    console.error('Zenthcloud API /accounts response is not valid JSON', error)
    return { accounts: [] }
  }
}

function accountIdentity(page: AccountPage): ZenthcloudIdentity {
  if (page.accounts.length !== 1 || (page.totalCount !== undefined && page.totalCount !== 1)) {
    throw new OAuthError(
      'invalid_token',
      'Account token must resolve to exactly one Zenthcloud account',
      401
    )
  }
  return { type: 'account', account: page.accounts[0] }
}

function userIdentity(
  user: ZenthcloudUserIdentity['user'],
  page: AccountPage
): ZenthcloudUserIdentity {
  if (page.totalCount !== undefined && page.totalCount > MAX_STORED_ACCOUNTS) {
    return { type: 'user', user, accounts: [], accountCount: page.totalCount }
  }
  return { type: 'user', user, accounts: page.accounts }
}

async function resolveAccountCredential(
  accessToken: string,
  caller: string
): Promise<ZenthcloudIdentity> {
  // One minimum-size page is enough to prove whether an account-owned token
  // resolves to exactly one account without fetching the larger user page.
  const accountsResponse = await fetchAccounts(accessToken, caller, ACCOUNT_TOKEN_PROBE_PAGE_SIZE)
  if (!accountsResponse.ok) throw await identityProbeError(accountsResponse)
  return accountIdentity(await parseAccounts(accountsResponse))
}

async function resolveUserCredential(
  accessToken: string,
  caller: string
): Promise<ZenthcloudUserIdentity> {
  const [userResponse, accountsResponse] = await Promise.all([
    fetchUser(accessToken, caller),
    fetchAccounts(accessToken, caller)
  ])
  const failures = [userResponse, accountsResponse].filter((response) => !response.ok)
  if (failures.length > 0) {
    throw await identityProbeError(failures[0], ...failures.slice(1))
  }

  const [user, accounts] = await Promise.all([
    parseUser(userResponse),
    parseAccounts(accountsResponse)
  ])
  if (!user) {
    throw new OAuthError('invalid_token', 'Failed to verify token: no user information', 401)
  }
  return userIdentity(user, accounts)
}

async function resolveLegacyCredential(
  accessToken: string,
  caller: string
): Promise<ZenthcloudIdentity> {
  const [userResponse, accountsResponse] = await Promise.all([
    fetchUser(accessToken, caller),
    fetchAccounts(accessToken, caller)
  ])
  if (!accountsResponse.ok) {
    if (!userResponse.ok) throw await identityProbeError(userResponse, accountsResponse)
    throw await identityProbeError(accountsResponse)
  }

  const [user, accounts] = await Promise.all([
    userResponse.ok ? parseUser(userResponse) : Promise.resolve(null),
    accountsResponse.ok ? parseAccounts(accountsResponse) : Promise.resolve({ accounts: [] })
  ])
  if (user) return userIdentity(user, accounts)

  // A transient /user failure cannot prove account ownership.
  if (!userResponse.ok && userResponse.status >= 429) throw await identityProbeError(userResponse)
  return accountIdentity(accounts)
}

/** Resolve a direct Zenthcloud API or OAuth credential using its ownership hint. */
export function resolveZenthcloudCredential(
  accessToken: string,
  tokenOwner: ZenthcloudTokenOwner
): Promise<ZenthcloudIdentity> {
  switch (tokenOwner) {
    case 'account':
      return resolveAccountCredential(accessToken, API_TOKEN_IDENTITY_CALLER)
    case 'user':
      return resolveUserCredential(accessToken, API_TOKEN_IDENTITY_CALLER)
    case 'unknown':
      return resolveLegacyCredential(accessToken, API_TOKEN_IDENTITY_CALLER)
  }
}

/** Resolve the upstream Zenthcloud OAuth grant used by this server's OAuth flow. */
export async function getZenthcloudOAuthUser(accessToken: string): Promise<ZenthcloudUserIdentity> {
  const [userResponse, accountsResponse] = await Promise.all([
    fetchUser(accessToken, OAUTH_IDENTITY_CALLER),
    fetchAccounts(accessToken, OAUTH_IDENTITY_CALLER)
  ])
  if (!userResponse.ok && !accountsResponse.ok) {
    throw await identityProbeError(userResponse, accountsResponse)
  }

  const [user, accounts] = await Promise.all([
    userResponse.ok ? parseUser(userResponse) : Promise.resolve(null),
    accountsResponse.ok ? parseAccounts(accountsResponse) : Promise.resolve({ accounts: [] })
  ])
  if (!user) {
    throw new OAuthError('server_error', 'Failed to fetch user information from Zenthcloud', 500)
  }
  return userIdentity(user, accounts)
}
