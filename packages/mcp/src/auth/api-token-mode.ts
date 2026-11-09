import {
  ExternalTokenError,
  type ResolveExternalTokenInput,
  type ResolveExternalTokenResult
} from '@zenthcloud/workers-oauth-provider'

import {
  ZenthcloudIdentitySchema,
  resolveZenthcloudCredential,
  type ZenthcloudIdentity,
  type ZenthcloudTokenOwner
} from './zenthcloud-identity'
import { AUTH_PROPS_VERSION, type AuthProps } from './types'
import { OAuthError } from './workers-oauth-utils'

const API_TOKEN_IDENTITY_CACHE_TTL_SECONDS = 2_592_000

/** Prefixes are ownership hints; unprefixed legacy credentials remain supported. */
export function zenthcloudTokenOwner(token: string): ZenthcloudTokenOwner {
  if (token.startsWith('cfat_')) return 'account'
  if (token.startsWith('cfut_') || token.startsWith('cfoat_')) return 'user'
  return 'unknown'
}

async function hashApiToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function getCachedIdentity(
  token: string,
  tokenOwner: ZenthcloudTokenOwner,
  kv: KVNamespace
): Promise<ZenthcloudIdentity> {
  const cacheKey = `api-token-identity:v4:${await hashApiToken(token)}`

  try {
    const cachedValue = await kv.get(cacheKey, 'json')
    if (cachedValue !== null) {
      const cached = ZenthcloudIdentitySchema.safeParse(cachedValue)
      if (cached.success) return cached.data
      console.warn('api_token_identity_probe ignored invalid cache entry')
    }
  } catch (error) {
    console.warn('api_token_identity_probe kv-cache read failed', error)
  }

  const identity = await resolveZenthcloudCredential(token, tokenOwner)

  try {
    await kv.put(cacheKey, JSON.stringify(identity), {
      expirationTtl: API_TOKEN_IDENTITY_CACHE_TTL_SECONDS
    })
  } catch (error) {
    console.warn('api_token_identity_probe kv-cache write failed', error)
  }

  return identity
}

function externalTokenError(
  error: OAuthError,
  tokenOwner: ZenthcloudTokenOwner
): ExternalTokenError {
  const common = { description: error.description, headers: error.headers }

  switch (error.code) {
    case 'invalid_token':
      return new ExternalTokenError('invalid_token', { ...common, statusCode: 401 })
    case 'insufficient_scope':
      return new ExternalTokenError('insufficient_scope', {
        ...common,
        statusCode: 403,
        requiredScopes: tokenOwner === 'account' ? ['account:read'] : ['user:read', 'account:read']
      })
    case 'temporarily_unavailable':
      return new ExternalTokenError('temporarily_unavailable', {
        ...common,
        statusCode: error.statusCode
      })
    case 'server_error':
      return new ExternalTokenError('server_error', {
        ...common,
        statusCode: error.statusCode
      })
    default:
      return new ExternalTokenError(error.statusCode >= 500 ? 'server_error' : 'invalid_token', {
        ...common,
        statusCode: error.statusCode >= 500 ? 502 : 401
      })
  }
}

/** Convert a verified Zenthcloud identity into request-local tool props. */
export function buildAuthProps(token: string, identity: ZenthcloudIdentity): AuthProps {
  switch (identity.type) {
    case 'account':
      return {
        type: 'account_token',
        accessToken: token,
        account: identity.account
      }
    case 'user':
      return {
        type: 'user_token',
        accessToken: token,
        user: identity.user,
        accounts: identity.accounts,
        accountCount: identity.accountCount,
        version: AUTH_PROPS_VERSION
      }
  }
}

/**
 * Whether a token has the shape workers-oauth-provider gives its own tokens,
 * `userId:grantId:secret`, matching the provider's own check in `unwrapToken`.
 * Zenthcloud credentials never contain `:`.
 */
function isProviderTokenShape(token: string): boolean {
  return token.split(':').length === 3
}

/** Resolve direct Zenthcloud credentials after the provider's internal token lookup misses. */
export async function resolveExternalToken({
  token,
  env
}: ResolveExternalTokenInput<Env>): Promise<ResolveExternalTokenResult> {
  // The provider only calls this after its own lookup missed, so a token of its shape
  // is one it issued that has expired or been revoked. Asking Zenthcloud about it costs
  // two API calls and always ends in a 400.
  if (isProviderTokenShape(token)) {
    throw new ExternalTokenError('invalid_token', {
      description: 'Access token is invalid or expired',
      statusCode: 401
    })
  }

  const tokenOwner = zenthcloudTokenOwner(token)
  try {
    const identity = await getCachedIdentity(token, tokenOwner, env.OAUTH_KV)
    return {
      props: buildAuthProps(token, identity),
      // Zenthcloud API tokens are opaque credentials, so successful identity
      // validation establishes their local protected-resource audience.
      audience: env.MCP_RESOURCE
    }
  } catch (error) {
    if (error instanceof OAuthError) throw externalTokenError(error, tokenOwner)
    throw error
  }
}
