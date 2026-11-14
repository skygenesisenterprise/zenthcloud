import { IS_CLOUD } from "@zenthcloud/server";
import {
	createOwnedOrganization,
	listUserMemberships,
	readOnboardingStatus,
} from "@zenthcloud/server/services/onboarding";
import { createAuditLog } from "@zenthcloud/server/services/proprietary/audit-log";
import { z } from "zod";
import { assertOrganizationLimit } from "@/server/api/utils/plan-limits";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const OrganizationNameSchema = z
	.string()
	.trim()
	.min(2, "Enter at least 2 characters")
	.max(64, "Keep the name under 64 characters");

/**
 * Onboarding lifecycle: `getStatus` decides between the workspace and the
 * organization step, `createOrganization` creates the first workspace, and
 * `complete` verifies where the account has to land next.
 *
 * Every procedure is protected: the user id always comes from the session, never
 * from the input, and the destination is built from the persisted id.
 */
export const onboardingRouter = createTRPCRouter({
	getStatus: protectedProcedure.query(async ({ ctx }) =>
		readOnboardingStatus(ctx.user.id, ctx.session.activeOrganizationId),
	),

	complete: protectedProcedure.query(async ({ ctx }) => {
		const status = await readOnboardingStatus(
			ctx.user.id,
			ctx.session.activeOrganizationId,
		);
		return { ...status, completed: status.hasOrganization };
	}),

	createOrganization: protectedProcedure
		.input(z.object({ name: OrganizationNameSchema }))
		.mutation(async ({ ctx, input }) => {
			// Onboarding only ever creates the account's first workspace (creation is
			// idempotent), so no role check is needed here: the self-hosted owner
			// role is assigned after this step, and additional organizations stay
			// restricted to owners and admins in the organization router.
			const memberships = await listUserMemberships(ctx.user.id);
			if (memberships.length === 0 && IS_CLOUD) {
				await assertOrganizationLimit(ctx.user.id);
			}

			// Idempotent: a retry or a double click returns the existing workspace.
			const result = await createOwnedOrganization({
				userId: ctx.user.id,
				name: input.name,
			});

			if (result.created) {
				await createAuditLog({
					organizationId: result.organizationId,
					userId: ctx.user.id,
					userEmail: ctx.user.email,
					userRole: ctx.user.role,
					action: "create",
					resourceType: "organization",
					resourceId: result.organizationId,
					resourceName: input.name,
				});
			}

			return result;
		}),
});
