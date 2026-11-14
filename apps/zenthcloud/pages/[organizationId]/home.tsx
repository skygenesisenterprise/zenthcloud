import { Button, Text } from "@zenthcloud/react";
import { validateRequest } from "@zenthcloud/server/lib/auth";
import {
	findOnboardingOrganizationById,
	findUserOrganizationMembership,
	listUserMemberships,
} from "@zenthcloud/server/services/onboarding";
import {
	CREATE_ACCOUNT_PATH,
	workspacePath,
} from "@zenthcloud/server/services/onboarding-paths";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const LOGIN_PATH = "/login";

interface Props {
	organizationName: string;
	role: string;
	email: string;
}

export default function OrganizationHomePage({
	organizationName,
	role,
	email,
}: Props) {
	const [isSigningOut, setIsSigningOut] = useState(false);

	const signOut = async () => {
		setIsSigningOut(true);
		try {
			await authClient.signOut();
			window.location.assign(LOGIN_PATH);
		} catch {
			toast.error("Could not sign out. Try again.");
			setIsSigningOut(false);
		}
	};

	return (
		<main
			data-zenth-mode="light"
			className="flex min-h-svh flex-col bg-zenth-base text-zenth-default"
		>
			<Head>
				<title>{`${organizationName} | ZenthCloud`}</title>
			</Head>
			<header className="flex h-20 items-center justify-between gap-4 px-6">
				<Text as="span" size="sm" bold>
					{organizationName}
				</Text>
				<div className="flex items-center gap-3">
					<Text variant="secondary" size="sm" as="span">
						{email}
					</Text>
					<Button
						variant="outline"
						loading={isSigningOut}
						onClick={() => void signOut()}
					>
						Sign out
					</Button>
				</div>
			</header>

			<section
				aria-labelledby="workspace-heading"
				className="flex flex-1 justify-center px-6 pt-12 pb-12 sm:px-4"
			>
				<div className="w-full max-w-[36rem]">
					<Text
						id="workspace-heading"
						variant="heading1"
						as="h1"
						DANGEROUS_className="text-[1.75rem] leading-9 tracking-[-0.02em]"
					>
						Your workspace is ready
					</Text>
					<Text
						variant="secondary"
						size="sm"
						as="p"
						DANGEROUS_className="mt-4 leading-relaxed"
					>
						{organizationName} is set up, and your account joined it as its{" "}
						{role}. Everything you deploy from now on lives inside this
						workspace.
					</Text>
				</div>
			</section>
		</main>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const raw = context.params?.organizationId;
	const organizationId = Array.isArray(raw) ? raw[0] : raw;
	if (!organizationId) {
		return { notFound: true };
	}

	let session: Awaited<ReturnType<typeof validateRequest>> | null = null;
	try {
		session = await validateRequest(context.req);
	} catch {
		session = null;
	}

	const user = session?.user;
	if (!user) {
		return {
			redirect: { permanent: false, destination: LOGIN_PATH },
		};
	}

	// A workspace whose organization row is gone cannot be opened: its
	// memberships were cascaded away, and the session may still point at it.
	// Start again from sign-in instead of guessing another workspace.
	const organizationExists =
		await findOnboardingOrganizationById(organizationId);
	if (!organizationExists) {
		return {
			redirect: { permanent: false, destination: LOGIN_PATH },
		};
	}

	// The organization id comes from the browser, so it is only ever an input to
	// this lookup: membership is what grants access to the workspace.
	const membership = await findUserOrganizationMembership(
		user.id,
		organizationId,
	);

	if (!membership?.organization) {
		// The workspace exists but this account is not a member: send it to a
		// workspace it does belong to, or back to onboarding.
		const [ownMembership] = await listUserMemberships(user.id);
		return {
			redirect: {
				permanent: false,
				destination: ownMembership
					? workspacePath(ownMembership.organizationId)
					: CREATE_ACCOUNT_PATH,
			},
		};
	}

	return {
		props: {
			organizationName: membership.organization.name,
			role: membership.role,
			email: user.email,
		},
	};
}
