import { db } from "@zenthcloud/server/db";
import { member, organization } from "@zenthcloud/server/db/schema";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
	type OnboardingMembership,
	resolveOnboardingStatus,
} from "./onboarding-paths";

// The pages import the database-free decisions from `./onboarding-paths`; the
// API keeps importing everything from here.
export * from "./onboarding-paths";

/**
 * The writes onboarding performs inside a single database transaction.
 *
 * `findMembership` is re-read inside the transaction so two submissions that
 * raced past the initial lookup cannot both create a workspace.
 */
export interface OnboardingTransaction {
	findMembership(userId: string): Promise<OnboardingMembership | null>;
	insertOrganization(input: {
		name: string;
		slug: string;
		ownerId: string;
		createdAt: Date;
	}): Promise<{ id: string; name: string }>;
	insertOwnerMember(input: {
		organizationId: string;
		userId: string;
		createdAt: Date;
		isDefault: boolean;
	}): Promise<void>;
}

/** Persistence boundary: production supplies Drizzle, tests supply memory. */
export interface OnboardingStore {
	listMemberships(userId: string): Promise<OnboardingMembership[]>;
	transaction<T>(
		run: (transaction: OnboardingTransaction) => Promise<T>,
	): Promise<T>;
}

export interface CreateFirstOrganizationResult {
	organizationId: string;
	created: boolean;
}

/**
 * Creates the first workspace of an account and makes it the owner.
 *
 * Idempotent on purpose: a duplicate submission, or a retry after the
 * organization was created but its activation failed, returns the workspace
 * that already exists instead of creating a second one.
 */
export async function createFirstOrganization(
	store: OnboardingStore,
	input: { userId: string; name: string; now?: Date },
): Promise<CreateFirstOrganizationResult> {
	const memberships = await store.listMemberships(input.userId);
	const existing = memberships[0];
	if (existing) {
		return { organizationId: existing.organizationId, created: false };
	}

	return store.transaction(async (transaction) => {
		const raced = await transaction.findMembership(input.userId);
		if (raced) {
			return { organizationId: raced.organizationId, created: false };
		}

		const now = input.now ?? new Date();
		const created = await transaction.insertOrganization({
			name: input.name,
			slug: nanoid(),
			ownerId: input.userId,
			createdAt: now,
		});
		await transaction.insertOwnerMember({
			organizationId: created.id,
			userId: input.userId,
			createdAt: now,
			isDefault: true,
		});

		return { organizationId: created.id, created: true };
	});
}

const membershipColumns = {
	organizationId: true,
	role: true,
	isDefault: true,
} as const;

const toMembership = (row: {
	organizationId: string;
	role: string;
	isDefault: boolean;
}): OnboardingMembership => ({
	organizationId: row.organizationId,
	role: row.role,
	isDefault: row.isDefault,
});

/**
 * Drizzle-backed onboarding store.
 *
 * The organization and its owner membership are inserted in one transaction:
 * an account must never end up with a workspace it is not a member of. The
 * unique index on `member (organization_id, user_id)` backs the same rule in
 * PostgreSQL when two requests race.
 */
export const drizzleOnboardingStore: OnboardingStore = {
	listMemberships: async (userId) => {
		const rows = await db.query.member.findMany({
			where: eq(member.userId, userId),
			columns: membershipColumns,
		});
		return rows.map(toMembership);
	},
	transaction: (run) =>
		db.transaction((tx) =>
			run({
				findMembership: async (userId) => {
					const row = await tx.query.member.findFirst({
						where: eq(member.userId, userId),
						columns: membershipColumns,
					});
					return row ? toMembership(row) : null;
				},
				insertOrganization: async (input) => {
					const [created] = await tx
						.insert(organization)
						.values({
							name: input.name,
							slug: input.slug,
							createdAt: input.createdAt,
							ownerId: input.ownerId,
						})
						.returning({ id: organization.id, name: organization.name });
					if (!created) {
						throw new Error("Failed to create organization");
					}
					return created;
				},
				insertOwnerMember: async (input) => {
					await tx.insert(member).values({
						organizationId: input.organizationId,
						userId: input.userId,
						role: "owner",
						createdAt: input.createdAt,
						isDefault: input.isDefault,
					});
				},
			}),
		),
};

/** Memberships of an account, used to decide between onboarding and workspace. */
export const listUserMemberships = async (userId: string) =>
	(
		await db.query.member.findMany({
			where: eq(member.userId, userId),
			columns: membershipColumns,
		})
	).map(toMembership);

/** Creates the first workspace of an account through the Drizzle store. */
export const createOwnedOrganization = (input: {
	userId: string;
	name: string;
	now?: Date;
}) => createFirstOrganization(drizzleOnboardingStore, input);

/** Onboarding state of an account, shared by the API and the pages' SSR. */
export const readOnboardingStatus = async (
	userId: string,
	activeOrganizationId?: string | null,
) =>
	resolveOnboardingStatus({
		activeOrganizationId,
		memberships: await listUserMemberships(userId),
	});

/** Organization row, used to tell a deleted workspace from a missing membership. */
export const findOnboardingOrganizationById = async (organizationId: string) =>
	db.query.organization.findFirst({
		where: eq(organization.id, organizationId),
		columns: { id: true, name: true },
	});

/**
 * Membership of an account in one workspace, with the organization attached.
 *
 * The organization id comes from the URL, so this is the only thing that grants
 * access: a missing membership always means "forbidden", never "not found".
 */
export const findUserOrganizationMembership = async (
	userId: string,
	organizationId: string,
) =>
	db.query.member.findFirst({
		where: and(
			eq(member.organizationId, organizationId),
			eq(member.userId, userId),
		),
		with: { organization: true },
	});
