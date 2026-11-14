/**
 * Onboarding values and decisions shared by the API and the pages.
 *
 * This module is deliberately free of database imports: the onboarding pages
 * import it in the browser too, while the Drizzle store lives in
 * `./onboarding` and is only loaded server-side.
 */

/**
 * A membership as onboarding needs it: which workspace the account belongs to
 * and whether that workspace is the account's default one.
 */
export interface OnboardingMembership {
	organizationId: string;
	role: string;
	isDefault: boolean;
}

export interface OnboardingStatus {
	hasOrganization: boolean;
	/** Workspace the account should be in right now, if any. */
	organizationId: string | null;
	/** Workspace the session currently points at, if any. */
	activeOrganizationId: string | null;
	/** Ready-to-use route for `organizationId`, if any. */
	destination: string | null;
}

/** The onboarding step a signed-in account without a workspace belongs to. */
export const CREATE_ACCOUNT_PATH = "/create-account";

/** Workspace route, always built from the id persisted in the database. */
export const workspacePath = (organizationId: string) =>
	`/${organizationId}/home`;

export const isMemberOf = (
	memberships: readonly OnboardingMembership[],
	organizationId: string,
) => memberships.some((entry) => entry.organizationId === organizationId);

/**
 * Resolves where an account belongs.
 *
 * The URL is never trusted: the active organization only counts when the
 * account is still a member of it, otherwise the default (or first) membership
 * wins. Without any membership the account still has to onboard.
 */
export function resolveOnboardingStatus(input: {
	activeOrganizationId?: string | null;
	memberships: readonly OnboardingMembership[];
}): OnboardingStatus {
	const { memberships } = input;
	const activeOrganizationId = input.activeOrganizationId || null;
	const active =
		activeOrganizationId && isMemberOf(memberships, activeOrganizationId)
			? activeOrganizationId
			: null;
	const fallback =
		memberships.find((entry) => entry.isDefault)?.organizationId ??
		memberships[0]?.organizationId ??
		null;
	const organizationId = active ?? fallback;

	return {
		hasOrganization: memberships.length > 0,
		organizationId,
		// Only report an active organization the account is still a member of, so
		// a stale session can never be mistaken for a completed onboarding.
		activeOrganizationId: active,
		destination: organizationId ? workspacePath(organizationId) : null,
	};
}
