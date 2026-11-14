import { standardSchemaResolver as zodResolver } from "@hookform/resolvers/standard-schema";
import { GlobeIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Banner, Button, Field, Input, Text } from "@zenthcloud/react";
import { validateRequest } from "@zenthcloud/server/lib/auth";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { api } from "@/utils/api";

const OrganizationSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Enter at least 2 characters")
		.max(64, "Keep the name under 64 characters"),
});

type OrganizationForm = z.infer<typeof OrganizationSchema>;

const LOGIN_PATH = "/login";
const WORKSPACE_PATH = (organizationId: string) => `/${organizationId}/home`;

interface Props {
	/** The account the workspace will belong to. */
	email: string;
}

export default function CreateAccountPage({ email }: Props) {
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const createOrganization = api.organization.create.useMutation();
	const form = useForm<OrganizationForm>({
		resolver: zodResolver(OrganizationSchema),
		defaultValues: { name: "" },
	});

	const onSubmit = async (values: OrganizationForm) => {
		setIsSubmitting(true);
		setError(null);
		try {
			// Creating the organization also enrolls this account as its owner;
			// the plan limit and the audit entry are handled by the API.
			const organization = await createOrganization.mutateAsync({
				name: values.name.trim(),
			});

			// Point the session at the new workspace so the dashboard opens on it.
			// The organization already exists, so a failure here must not strand
			// the user on the onboarding form: the redirect below still runs.
			const { error: activeError } = await authClient.organization.setActive({
				organizationId: organization.id,
			});
			if (activeError) {
				toast.error(
					activeError.message ??
						"The workspace could not be opened automatically.",
				);
			}

			toast.success(`${organization.name} is ready`);
			// Document navigation: the workspace route owns the dashboard, so the
			// next request carries the updated session instead of local state.
			window.location.assign(WORKSPACE_PATH(organization.id));
		} catch (caught) {
			const message =
				caught instanceof Error
					? caught.message
					: "An error occurred while creating your workspace";
			toast.error(message);
			setError(message);
		} finally {
			setIsSubmitting(false);
		}
	};

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

	const nameError = form.formState.errors.name?.message;

	return (
		<main
			data-zenth-mode="light"
			className="flex min-h-svh flex-col bg-zenth-base text-zenth-default"
		>
			<Head>
				<title>ZenthCloud Dashboard | Create your workspace</title>
			</Head>
			<header className="flex h-20 items-center justify-end gap-4 px-6">
				<div className="flex items-center gap-3">
					<Text
						variant="secondary"
						size="sm"
						as="span"
						DANGEROUS_className="inline-flex items-center gap-1.5"
					>
						<GlobeIcon className="size-4" aria-hidden="true" />
						English
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
				aria-labelledby="create-account-heading"
				className="flex flex-1 justify-center px-6 pt-12 pb-12 sm:px-4"
			>
				<div className="w-full max-w-[22.75rem]">
					<Text
						id="create-account-heading"
						variant="heading1"
						as="h1"
						DANGEROUS_className="text-center text-[1.75rem] leading-9 tracking-[-0.02em]"
					>
						Create your workspace
					</Text>

					<Text
						variant="secondary"
						size="sm"
						as="p"
						DANGEROUS_className="mt-6 text-center leading-relaxed"
					>
						Name the ZenthCloud organization your account will own. You can
						invite your team once it exists.
					</Text>

					{error && (
						<Banner
							variant="error"
							size="sm"
							icon={<WarningCircleIcon className="size-4" />}
							description={error}
							className="mt-6"
						/>
					)}

					<form
						method="post"
						onSubmit={form.handleSubmit(onSubmit)}
						className="mt-6 space-y-5"
						id="create-account-form"
					>
						<Field
							label="Organization name"
							description="You'll be the owner of this workspace."
							error={
								nameError ? { message: nameError, match: true } : undefined
							}
						>
							<Input
								type="text"
								placeholder="Acme Inc."
								autoComplete="organization"
								size="lg"
								autoFocus
								{...form.register("name")}
							/>
						</Field>

						<Button
							type="submit"
							variant="primary"
							size="lg"
							className="w-full justify-center rounded-lg"
							loading={isSubmitting}
						>
							Create workspace
						</Button>
					</form>

					<div className="mt-6 space-y-1 text-center">
						<Text variant="secondary" size="sm" as="p">
							Signed in as {email}
						</Text>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="mx-auto"
							disabled={isSigningOut}
							onClick={() => void signOut()}
						>
							Use a different account
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	let session: Awaited<ReturnType<typeof validateRequest>> | null = null;
	try {
		session = await validateRequest(context.req);
	} catch {
		session = null;
	}

	// The workspace belongs to an account: without one, onboarding restarts at
	// the sign-in page.
	const user = session?.user;
	if (!user) {
		return {
			redirect: { permanent: false, destination: LOGIN_PATH },
		};
	}

	// An account that already opened a workspace has nothing left to create here.
	const activeOrganizationId = session?.session?.activeOrganizationId;
	if (activeOrganizationId) {
		return {
			redirect: {
				permanent: false,
				destination: WORKSPACE_PATH(activeOrganizationId),
			},
		};
	}

	return { props: { email: user.email } };
}
