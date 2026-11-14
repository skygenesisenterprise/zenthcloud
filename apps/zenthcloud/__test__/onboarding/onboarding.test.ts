import { generateOrganizationId } from "@zenthcloud/server/db/ids";
import { describe, expect, it } from "vitest";
import {
	CREATE_ACCOUNT_PATH,
	createFirstOrganization,
	isMemberOf,
	type OnboardingMembership,
	type OnboardingStore,
	resolveOnboardingStatus,
	workspacePath,
} from "@zenthcloud/server/services/onboarding";

const PERSISTED_ORG_ID = "dbc7a507e8a140194d193445ecfdb7cf";

interface StoredMembership extends OnboardingMembership {
	userId: string;
}

interface StoredOrganization {
	id: string;
	name: string;
	ownerId: string;
}

/**
 * In-memory implementation of the onboarding store. It models the transaction
 * by snapshotting its state so a failed insert can be asserted to leave no
 * organization and no membership behind.
 */
function createMemoryStore(seed: StoredMembership[] = []) {
	const memberships = [...seed];
	const organizations: StoredOrganization[] = [];
	let insertMemberError: Error | null = null;

	const store: OnboardingStore = {
		listMemberships: async (userId) =>
			memberships
				.filter((entry) => entry.userId === userId)
				.map(({ organizationId, role, isDefault }) => ({
					organizationId,
					role,
					isDefault,
				})),
		transaction: async (run) => {
			const membershipSnapshot = memberships.map((entry) => ({ ...entry }));
			const organizationSnapshot = organizations.map((entry) => ({
				...entry,
			}));
			try {
				return await run({
					findMembership: async (userId) => {
						const found = memberships.find((entry) => entry.userId === userId);
						return found
							? {
									organizationId: found.organizationId,
									role: found.role,
									isDefault: found.isDefault,
								}
							: null;
					},
					insertOrganization: async (input) => {
						const created = {
							id: `org_${organizations.length + 1}`,
							name: input.name,
							ownerId: input.ownerId,
						};
						organizations.push(created);
						return created;
					},
					insertOwnerMember: async (input) => {
						if (insertMemberError) throw insertMemberError;
						memberships.push({
							userId: input.userId,
							organizationId: input.organizationId,
							role: "owner",
							isDefault: input.isDefault,
						});
					},
				});
			} catch (error) {
				memberships.length = 0;
				memberships.push(...membershipSnapshot);
				organizations.length = 0;
				organizations.push(...organizationSnapshot);
				throw error;
			}
		},
	};

	return {
		store,
		memberships,
		organizations,
		failMemberInsert: (error: Error) => {
			insertMemberError = error;
		},
	};
}

describe("organization ids", () => {
	it("renders as 32 lowercase hex characters, ready for the workspace route", () => {
		const id = generateOrganizationId();

		expect(id).toMatch(/^[0-9a-f]{32}$/);
		expect(id).toHaveLength(32);
		expect(workspacePath(id)).toBe(`/${id}/home`);
	});

	it("does not repeat", () => {
		const ids = new Set(
			Array.from({ length: 1000 }, () => generateOrganizationId()),
		);

		expect(ids.size).toBe(1000);
	});
});

describe("createFirstOrganization", () => {
	it("creates the organization and its owner membership in one transaction", async () => {
		const memory = createMemoryStore();

		const result = await createFirstOrganization(memory.store, {
			userId: "user_1",
			name: "Acme Inc.",
			now: new Date("2026-11-14T10:00:00.000Z"),
		});

		expect(result.created).toBe(true);
		expect(memory.organizations).toHaveLength(1);
		expect(memory.organizations[0]?.id).toBe(result.organizationId);
		expect(memory.memberships).toEqual([
			{
				userId: "user_1",
				organizationId: result.organizationId,
				role: "owner",
				isDefault: true,
			},
		]);
	});

	it("returns the existing workspace on a duplicate submission", async () => {
		const memory = createMemoryStore();

		const first = await createFirstOrganization(memory.store, {
			userId: "user_1",
			name: "Acme Inc.",
		});
		const second = await createFirstOrganization(memory.store, {
			userId: "user_1",
			name: "Acme Inc.",
		});

		expect(second).toEqual({
			organizationId: first.organizationId,
			created: false,
		});
		expect(memory.organizations).toHaveLength(1);
		expect(memory.memberships).toHaveLength(1);
	});

	it("does not create a second workspace when another submission wins the race", async () => {
		const raced: OnboardingMembership = {
			organizationId: "org_raced",
			role: "owner",
			isDefault: true,
		};
		const store: OnboardingStore = {
			// The pre-transaction lookup sees nothing: the competing submission has
			// not committed yet.
			listMemberships: async () => [],
			transaction: async (run) =>
				run({
					findMembership: async () => raced,
					insertOrganization: async () => {
						throw new Error("must not insert a second organization");
					},
					insertOwnerMember: async () => {
						throw new Error("must not insert a second membership");
					},
				}),
		};

		await expect(
			createFirstOrganization(store, { userId: "user_1", name: "Acme" }),
		).resolves.toEqual({ organizationId: "org_raced", created: false });
	});

	it("rolls the organization back when the owner membership fails", async () => {
		const memory = createMemoryStore();
		memory.failMemberInsert(new Error("member insert failed"));

		await expect(
			createFirstOrganization(memory.store, {
				userId: "user_1",
				name: "Acme Inc.",
			}),
		).rejects.toThrow("member insert failed");

		expect(memory.organizations).toHaveLength(0);
		expect(memory.memberships).toHaveLength(0);
	});

	it("retries activation on the same workspace after a failure", async () => {
		const memory = createMemoryStore();
		const first = await createFirstOrganization(memory.store, {
			userId: "user_1",
			name: "Acme Inc.",
		});

		// Activation is not part of creation: retrying returns the persisted id.
		const retried = await createFirstOrganization(memory.store, {
			userId: "user_1",
			name: "Acme Inc.",
		});

		expect(retried.organizationId).toBe(first.organizationId);
		expect(memory.organizations).toHaveLength(1);
	});
});

describe("resolveOnboardingStatus", () => {
	const membership = (
		organizationId: string,
		isDefault = false,
	): OnboardingMembership => ({ organizationId, role: "owner", isDefault });

	it("sends a new account with no workspace to onboarding", () => {
		expect(resolveOnboardingStatus({ memberships: [] })).toEqual({
			hasOrganization: false,
			organizationId: null,
			activeOrganizationId: null,
			destination: null,
		});
		expect(CREATE_ACCOUNT_PATH).toBe("/create-account");
	});

	it("builds the destination from the persisted organization id", () => {
		const status = resolveOnboardingStatus({
			activeOrganizationId: PERSISTED_ORG_ID,
			memberships: [membership(PERSISTED_ORG_ID, true)],
		});

		expect(status.destination).toBe(`/${PERSISTED_ORG_ID}/home`);
		expect(workspacePath(PERSISTED_ORG_ID)).toBe(
			"/dbc7a507e8a140194d193445ecfdb7cf/home",
		);
	});

	it("ignores an active organization the account is not a member of", () => {
		const status = resolveOnboardingStatus({
			activeOrganizationId: "org_stolen",
			memberships: [membership("org_own", true)],
		});

		expect(status.activeOrganizationId).toBe(null);
		expect(status.destination).toBe("/org_own/home");
	});

	it("falls back to the default membership when the session has no active organization", () => {
		const status = resolveOnboardingStatus({
			activeOrganizationId: "",
			memberships: [membership("org_first"), membership("org_default", true)],
		});

		expect(status.destination).toBe("/org_default/home");
	});

	it("checks access with membership only", () => {
		expect(isMemberOf([membership("org_own")], "org_own")).toBe(true);
		expect(isMemberOf([membership("org_own")], "org_other")).toBe(false);
		expect(isMemberOf([], "org_other")).toBe(false);
	});
});
