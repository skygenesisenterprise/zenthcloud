import { standardSchemaResolver as zodResolver } from "@hookform/resolvers/standard-schema";
import {
	CookieIcon,
	EyeIcon,
	EyeSlashIcon,
	FingerprintIcon,
	GithubLogoIcon,
	GlobeIcon,
	LockKeyIcon,
} from "@phosphor-icons/react";
import {
	browserSupportsWebAuthn,
	startAuthentication,
} from "@simplewebauthn/browser";
import {
	Button,
	Checkbox,
	Field,
	Input,
	ZenthcloudLogo,
} from "@zenthcloud/react";
import {
	getWebServerSettings,
	IS_CLOUD,
	isAdminPresent,
} from "@zenthcloud/server";
import { validateRequest } from "@zenthcloud/server/lib/auth";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";
import type { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SignInWithSSO } from "@/components/proprietary/sso/sign-in-with-sso";
import { AlertBlock } from "@/components/shared/alert-block";
import { Logo } from "@/components/shared/logo";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import {
	getSecurityKeyQrLoginStatus,
	getTwoFactorMethod,
	isCeremonyCancellation,
	requestWebAuthnTwoFactorOptions,
	startSecurityKeyQrLogin,
	type TwoFactorMethod,
	verifySecurityKeyBackupCode,
	verifyWebAuthnTwoFactor,
	type WebAuthnTwoFactorOptions,
} from "@/lib/webauthn-two-factor";
import { appRouter } from "@/server/api/root";
import { generateServerSideHelper } from "@/utils/create-server-helpers";
import { useWhitelabelingPublic } from "@/utils/hooks/use-whitelabeling";

const LoginSchema = z.object({
	email: z
		.string()
		.min(1, "Enter your email address")
		.email("Enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof LoginSchema>;

/** Stored locally so the next visit can prefill the account that was used. */
const SAVED_LOGIN_KEY = "zenthcloud.saved-login";
const LOGIN_PATH = "/login";

interface SavedLogin {
	email: string;
	method: string;
}

function readSavedLogin(): SavedLogin | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(SAVED_LOGIN_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<SavedLogin>;
		if (typeof parsed.email !== "string") return null;
		return {
			email: parsed.email,
			method: typeof parsed.method === "string" ? parsed.method : "password",
		};
	} catch {
		return null;
	}
}

function writeSavedLogin(value: SavedLogin | null) {
	if (typeof window === "undefined") return;
	try {
		if (value) {
			window.localStorage.setItem(SAVED_LOGIN_KEY, JSON.stringify(value));
		} else {
			window.localStorage.removeItem(SAVED_LOGIN_KEY);
		}
	} catch {
		// Storage can be unavailable (private mode, quota): the form still works.
	}
}

function GoogleMark({ className = "size-4" }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
			<path
				fill="#4285F4"
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
			/>
			<path
				fill="#34A853"
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
			/>
			<path
				fill="#FBBC05"
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
			/>
			<path
				fill="#EA4335"
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
			/>
		</svg>
	);
}

function OrDivider() {
	return (
		<div className="my-6 flex items-center gap-3" aria-hidden="true">
			<span className="h-px flex-1 bg-border" />
			<span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
				or
			</span>
			<span className="h-px flex-1 bg-border" />
		</div>
	);
}

interface Props {
	IS_CLOUD: boolean;
	enforceSSO: boolean;
}

export default function LoginPage({ IS_CLOUD, enforceSSO }: Props) {
	const router = useRouter();
	const { config: whitelabeling } = useWhitelabelingPublic();
	const [isLoginLoading, setIsLoginLoading] = useState(false);
	const [socialLoading, setSocialLoading] = useState<
		"google" | "github" | null
	>(null);
	const [isTwoFactorLoading, setIsTwoFactorLoading] = useState(false);
	const [isBackupCodeLoading, setIsBackupCodeLoading] = useState(false);
	const [isTwoFactor, setIsTwoFactor] = useState(false);
	const [twoFactorMethod, setTwoFactorMethod] =
		useState<TwoFactorMethod | null>(null);
	const [isWebAuthnSupported, setIsWebAuthnSupported] = useState(false);
	const [securityKeyOptions, setSecurityKeyOptions] =
		useState<WebAuthnTwoFactorOptions | null>(null);
	const [hasSecurityKey, setHasSecurityKey] = useState(false);
	const [hasNoSecurityKey, setHasNoSecurityKey] = useState(false);
	const [isSecurityKeyLoading, setIsSecurityKeyLoading] = useState(false);
	const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
	const [qrExpired, setQrExpired] = useState(false);
	const [qrNonce, setQrNonce] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [twoFactorCode, setTwoFactorCode] = useState("");
	const [isBackupCodeModalOpen, setIsBackupCodeModalOpen] = useState(false);
	const [backupCode, setBackupCode] = useState("");
	const [rememberDevice, setRememberDevice] = useState(true);
	const [savedLogin, setSavedLogin] = useState<SavedLogin | null>(null);
	const [showSavedProfiles, setShowSavedProfiles] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const loginForm = useForm<LoginForm>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// The identity provider redirects back with ?error=… when a sign-in fails.
	useEffect(() => {
		const queryError = router.query.error;
		if (!queryError) return;

		const raw = Array.isArray(queryError) ? queryError[0] : queryError;
		if (!raw) return;
		const normalized = raw.replace(/[+_]/g, " ").toLowerCase();

		setError(
			normalized.includes("account not linked")
				? "This account already exists but isn't linked to that sign-in provider yet. Contact your administrator to link it."
				: normalized.includes("access denied")
					? "Access was denied by the identity provider."
					: "We couldn't complete sign-in. Please try again or contact your administrator.",
		);

		const { error: _removed, ...rest } = router.query;
		router.replace({ pathname: router.pathname, query: rest }, undefined, {
			shallow: true,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.error]);

	useEffect(() => {
		setIsWebAuthnSupported(browserSupportsWebAuthn());
	}, []);

	// Prefill with the account saved on this browser.
	useEffect(() => {
		const saved = readSavedLogin();
		if (!saved) return;
		setSavedLogin(saved);
		if (!loginForm.getValues("email")) {
			loginForm.setValue("email", saved.email);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const loadSecurityKeyOptions = useCallback(async () => {
		const { options, error } = await requestWebAuthnTwoFactorOptions();
		setSecurityKeyOptions(options);
		setHasSecurityKey(!!options);
		setHasNoSecurityKey(error?.code === "NO_SECURITY_KEY");
	}, []);

	// Reads the factor the account chose after its password. The panel shows
	// exactly that factor: codes, or the security key.
	const loadTwoFactorMethod = useCallback(async () => {
		const { summary } = await getTwoFactorMethod();
		setTwoFactorMethod(summary?.method ?? null);
	}, []);

	// The password step left a pending two-factor token, so a challenge can be
	// requested before the user chooses a factor. Accounts without a key keep
	// the code form only.
	useEffect(() => {
		if (!isTwoFactor || !isWebAuthnSupported) return;
		if (twoFactorMethod === "totp") {
			setSecurityKeyOptions(null);
			setHasSecurityKey(false);
			setHasNoSecurityKey(false);
			return;
		}
		loadSecurityKeyOptions().catch(() => setSecurityKeyOptions(null));
	}, [
		isTwoFactor,
		isWebAuthnSupported,
		twoFactorMethod,
		loadSecurityKeyOptions,
	]);

	// Security-key mode completes the password step by scanning a QR code with a
	// phone already signed in to the account. The waiting browser polls until
	// the phone approves, then receives its session cookie.
	useEffect(() => {
		if (!isTwoFactor || twoFactorMethod !== "securityKey") {
			setQrCodeUrl(null);
			setQrExpired(false);
			return;
		}

		let cancelled = false;
		let timer: ReturnType<typeof setTimeout> | undefined;
		let requestId: string | null = null;
		let failures = 0;

		const poll = async () => {
			if (cancelled || !requestId) return;
			const { status, token, error } =
				await getSecurityKeyQrLoginStatus(requestId);
			if (cancelled) return;

			if (status === "approved" && token) {
				toast.success("Logged in successfully");
				router.push("/dashboard/home");
				return;
			}
			if (status === "expired") {
				setQrExpired(true);
				return;
			}

			// A transient failure (network, dev server reload) must not remove the
			// QR while it is still valid on screen; only repeated failures give up.
			failures = error ? failures + 1 : 0;
			if (failures >= 5) {
				setQrExpired(true);
				return;
			}
			timer = setTimeout(poll, 2000);
		};

		(async () => {
			const { request, error } = await startSecurityKeyQrLogin();
			if (cancelled) return;
			if (error || !request) {
				setQrExpired(true);
				toast.error(error?.message ?? "Could not prepare the QR code");
				return;
			}

			requestId = request.requestId;
			const qr = await QRCode.toDataURL(request.url, { margin: 1, width: 240 });
			if (cancelled) return;
			setQrCodeUrl(qr);
			setQrExpired(false);
			timer = setTimeout(poll, 1500);
		})().catch(() => {
			if (!cancelled) setQrExpired(true);
		});

		return () => {
			cancelled = true;
			if (timer) clearTimeout(timer);
		};
	}, [isTwoFactor, twoFactorMethod, qrNonce, router]);

	const persistLogin = (email: string, method: string) => {
		if (!rememberDevice) return;
		const value = { email, method };
		writeSavedLogin(value);
		setSavedLogin(value);
	};

	const onSocialSignIn = async (provider: "google" | "github") => {
		setSocialLoading(provider);
		try {
			const { error } = await authClient.signIn.social({
				provider,
				callbackURL: "/dashboard/home",
				newUserCallbackURL: `/dashboard/home?signup=${provider}`,
				errorCallbackURL: LOGIN_PATH,
			});
			if (error) {
				const message = error.message || `Could not sign in with ${provider}`;
				toast.error(message);
				setError(message);
			}
		} catch (caught) {
			const message =
				caught instanceof Error
					? caught.message
					: `Could not sign in with ${provider}`;
			toast.error(message);
			setError(message);
		} finally {
			setSocialLoading(null);
		}
	};

	const onSecurityKeySubmit = async () => {
		if (!securityKeyOptions) return;

		setIsSecurityKeyLoading(true);
		try {
			const assertion = await startAuthentication({
				optionsJSON: securityKeyOptions,
			});
			const { token, error: verifyError } =
				await verifyWebAuthnTwoFactor(assertion);

			if (verifyError || !token) {
				const message =
					verifyError?.message ??
					"The security key could not be verified. Try again.";
				toast.error(message);
				setError(message);
				// The challenge is single use: fetch a fresh one for the retry.
				await loadSecurityKeyOptions();
				return;
			}

			toast.success("Logged in successfully");
			router.push("/dashboard/home");
		} catch (caught) {
			if (!isCeremonyCancellation(caught)) {
				const message =
					caught instanceof Error
						? caught.message
						: "The security key could not be verified. Try again.";
				toast.error(message);
				setError(message);
				await loadSecurityKeyOptions();
			}
		} finally {
			setIsSecurityKeyLoading(false);
		}
	};

	const onSubmit = async (values: LoginForm) => {
		setIsLoginLoading(true);
		try {
			const { data, error } = await authClient.signIn.email({
				email: values.email,
				password: values.password,
			});

			if (error) {
				const isEmailNotVerified =
					error.code === "EMAIL_NOT_VERIFIED" ||
					error.message?.toLowerCase().includes("email not verified");
				if (isEmailNotVerified) {
					const msg =
						"Your email is not verified. We've sent a new verification link to your email.";
					toast.info(msg);
					setError(msg);
					return;
				}
				toast.error(error.message);
				setError(error.message || "An error occurred while logging in");
				return;
			}

			persistLogin(values.email, "password");

			if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
				setTwoFactorCode("");
				setSecurityKeyOptions(null);
				setHasSecurityKey(false);
				setHasNoSecurityKey(false);
				setTwoFactorMethod(null);
				setIsTwoFactor(true);
				await loadTwoFactorMethod();
				toast.info("Please complete your second factor");
				return;
			}

			toast.success("Logged in successfully");
			router.push("/dashboard/home");
		} catch {
			toast.error("An error occurred while logging in");
		} finally {
			setIsLoginLoading(false);
		}
	};

	const onTwoFactorSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Key-only accounts have no code input: Enter must not reach this path.
		if (twoFactorMethod === "securityKey") return;
		if (twoFactorCode.length !== 6) {
			toast.error("Please enter a valid 6-digit code");
			return;
		}

		setIsTwoFactorLoading(true);
		try {
			const { error } = await authClient.twoFactor.verifyTotp({
				code: twoFactorCode.replace(/\s/g, ""),
			});

			if (error) {
				toast.error(error.message);
				setError(error.message || "An error occurred while verifying 2FA code");
				return;
			}

			toast.success("Logged in successfully");
			router.push("/dashboard/home");
		} catch {
			toast.error("An error occurred while verifying 2FA code");
		} finally {
			setIsTwoFactorLoading(false);
		}
	};

	const onBackupCodeSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (backupCode.length < 8) {
			toast.error("Please enter a valid backup code");
			return;
		}

		setIsBackupCodeLoading(true);
		try {
			// A key-only account has its own single-use codes: better-auth's are
			// tied to an authenticator app it does not have.
			const { token, error: securityKeyError } =
				twoFactorMethod === "securityKey"
					? await verifySecurityKeyBackupCode(backupCode.trim())
					: { token: null, error: null };

			if (twoFactorMethod === "securityKey") {
				if (securityKeyError || !token) {
					const message =
						securityKeyError?.message ??
						"This backup code is invalid or was already used.";
					toast.error(message);
					setError(message);
					return;
				}

				toast.success("Logged in successfully");
				router.push("/dashboard/home");
				return;
			}

			const { error } = await authClient.twoFactor.verifyBackupCode({
				code: backupCode.trim(),
			});

			if (error) {
				toast.error(error.message);
				setError(
					error.message || "An error occurred while verifying backup code",
				);
				return;
			}

			toast.success("Logged in successfully");
			router.push("/dashboard/home");
		} catch {
			toast.error("An error occurred while verifying backup code");
		} finally {
			setIsBackupCodeLoading(false);
		}
	};

	const resetTwoFactor = () => {
		setIsTwoFactor(false);
		setTwoFactorCode("");
		setTwoFactorMethod(null);
		setQrCodeUrl(null);
		setQrExpired(false);
		setSecurityKeyOptions(null);
		setHasSecurityKey(false);
		setHasNoSecurityKey(false);
		setError(null);
	};

	const passwordError = loginForm.formState.errors.password?.message;
	const emailError = loginForm.formState.errors.email?.message;
	const brandLogo = whitelabeling?.loginLogoUrl || whitelabeling?.logoUrl;

	const loginPanel = (
		<>
			{IS_CLOUD && (
				<div className="mt-8 grid grid-cols-2 gap-3">
					<Button
						variant="secondary"
						size="lg"
						className="w-full justify-center"
						loading={socialLoading === "google"}
						disabled={socialLoading !== null}
						onClick={() => onSocialSignIn("google")}
					>
						<GoogleMark />
						Google
					</Button>
					<Button
						variant="secondary"
						size="lg"
						className="w-full justify-center"
						icon={GithubLogoIcon}
						loading={socialLoading === "github"}
						disabled={socialLoading !== null}
						onClick={() => onSocialSignIn("github")}
					>
						GitHub
					</Button>
				</div>
			)}

			{IS_CLOUD && (
				<div className="mt-3">
					{/* Managed cloud always offers SSO: an organization may not have a
					    source configured, so the local form remains the fallback. */}
					<SignInWithSSO />
				</div>
			)}

			{IS_CLOUD && <OrDivider />}

			<form
				method="post"
				onSubmit={loginForm.handleSubmit(onSubmit)}
				className="space-y-4"
				id="login-form"
			>
				<Input
					label="Email"
					type="email"
					placeholder="john@example.com"
					autoComplete="email"
					error={emailError}
					{...loginForm.register("email")}
				/>

				<Field
					label="Password"
					error={
						passwordError ? { message: passwordError, match: true } : undefined
					}
				>
					<div className="relative">
						<Input
							type={showPassword ? "text" : "password"}
							placeholder="Enter your password"
							autoComplete="current-password"
							className="pr-10"
							{...loginForm.register("password")}
						/>
						<button
							type="button"
							onClick={() => setShowPassword((value) => !value)}
							aria-label={showPassword ? "Hide password" : "Show password"}
							aria-pressed={showPassword}
							className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
						>
							{showPassword ? (
								<EyeSlashIcon className="size-4" />
							) : (
								<EyeIcon className="size-4" />
							)}
						</button>
					</div>
				</Field>

				<Checkbox
					label="Save email and sign-in method on this device"
					checked={rememberDevice}
					onCheckedChange={(checked) => setRememberDevice(checked === true)}
				/>

				<Button
					type="submit"
					variant="primary"
					size="lg"
					className="w-full justify-center"
					loading={isLoginLoading}
				>
					Sign in
				</Button>
			</form>

			{savedLogin && (
				<div className="mt-4 text-center">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => setShowSavedProfiles((value) => !value)}
						aria-expanded={showSavedProfiles}
					>
						{showSavedProfiles ? "Hide saved profiles" : "Show saved profiles"}
					</Button>
					{showSavedProfiles && (
						<div className="mt-2 flex items-center justify-between gap-3 rounded-lg p-3 text-left ring ring-zenth-line">
							<div className="min-w-0">
								<p className="truncate text-sm font-medium">
									{savedLogin.email}
								</p>
								<p className="text-xs text-muted-foreground">
									{savedLogin.method === "password"
										? "Email and password"
										: savedLogin.method}
								</p>
							</div>
							<div className="flex shrink-0 items-center gap-1">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => {
										loginForm.setValue("email", savedLogin.email, {
											shouldValidate: true,
										});
										setShowSavedProfiles(false);
									}}
								>
									Use
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => {
										writeSavedLogin(null);
										setSavedLogin(null);
										setShowSavedProfiles(false);
									}}
								>
									Forget
								</Button>
							</div>
						</div>
					)}
				</div>
			)}

			<div className="mt-6 space-y-2 text-center text-sm">
				{IS_CLOUD && (
					<p className="text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link
							href="/register"
							className="font-medium text-primary hover:underline"
						>
							Sign up
						</Link>
					</p>
				)}
				<p className="text-muted-foreground">
					Forgot your password?{" "}
					{IS_CLOUD ? (
						<Link
							href="/send-reset-password"
							className="font-medium text-primary hover:underline"
						>
							Reset it
						</Link>
					) : (
						<a
							href="https://docs.zenthcloud.com/docs/core/reset-password"
							target="_blank"
							rel="noreferrer"
							className="font-medium text-primary hover:underline"
						>
							Reset it
						</a>
					)}
				</p>
			</div>

			<p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
				By continuing, you agree to the ZenthCloud{" "}
				<a
					href="https://zenthcloud.com/legal/terms"
					target="_blank"
					rel="noreferrer"
					className="underline underline-offset-2 hover:text-foreground"
				>
					Terms of Service
				</a>
				,{" "}
				<a
					href="https://zenthcloud.com/legal/privacy"
					target="_blank"
					rel="noreferrer"
					className="underline underline-offset-2 hover:text-foreground"
				>
					Privacy Policy
				</a>{" "}
				and{" "}
				<a
					href="https://zenthcloud.com/legal/cookies"
					target="_blank"
					rel="noreferrer"
					className="underline underline-offset-2 hover:text-foreground"
				>
					Cookie Policy
				</a>
				.
			</p>
		</>
	);

	const twoFactorPanel = (
		<div className="mt-8">
			<div className="text-center">
				<h2 className="text-lg font-semibold">Two-factor authentication</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					{twoFactorMethod === "securityKey"
						? "Approve this sign-in with your security key or a phone already signed in."
						: "Enter the 6-digit code from your authenticator app."}
				</p>
			</div>

			<form
				method="post"
				onSubmit={onTwoFactorSubmit}
				className="mt-6 space-y-4"
				id="two-factor-form"
				autoComplete="on"
			>
				{twoFactorMethod === "securityKey" ? (
					<div className="space-y-2">
						<span className="text-sm font-medium">Scan to approve</span>
						{qrExpired ? (
							<div className="flex flex-col items-center gap-2 rounded-lg p-4 ring ring-zenth-line">
								<p className="text-sm text-muted-foreground">
									This QR code expired.
								</p>
								<Button
									type="button"
									variant="secondary"
									onClick={() => setQrNonce((nonce) => nonce + 1)}
								>
									Show a new QR code
								</Button>
							</div>
						) : qrCodeUrl ? (
							<div className="flex flex-col items-center gap-2 rounded-lg p-4 ring ring-zenth-line">
								{/** biome-ignore lint/performance/noImgElement: generated data URL */}
								<img
									src={qrCodeUrl}
									alt="QR code to approve this sign-in"
									className="size-44 rounded bg-white p-2"
								/>
								<p className="text-center text-sm text-muted-foreground">
									Scan with your phone while signed in to this account to
									approve the sign-in.
								</p>
							</div>
						) : (
							<div className="flex items-center justify-center rounded-lg p-6 ring ring-zenth-line">
								<Loader2 className="size-5 animate-spin text-muted-foreground" />
							</div>
						)}

						<div className="my-1 flex items-center gap-3">
							<span className="h-px flex-1 bg-border" />
							<span className="text-xs text-muted-foreground uppercase">
								or
							</span>
							<span className="h-px flex-1 bg-border" />
						</div>

						<Button
							variant="secondary"
							className="w-full justify-center"
							type="button"
							icon={FingerprintIcon}
							disabled={!securityKeyOptions}
							loading={isSecurityKeyLoading}
							onClick={onSecurityKeySubmit}
						>
							Use a security key on this device
						</Button>
						{hasNoSecurityKey && (
							<p className="text-sm text-muted-foreground">
								No security key could be used for this sign-in. Use one of your
								backup codes instead.
							</p>
						)}
					</div>
				) : (
					<div className="space-y-3">
						<label htmlFor="totp-code" className="text-sm font-medium">
							2FA Code
						</label>
						<InputOTP
							id="totp-code"
							name="totp"
							value={twoFactorCode}
							onChange={setTwoFactorCode}
							maxLength={6}
							pattern={REGEXP_ONLY_DIGITS}
							autoFocus
						>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
							</InputOTPGroup>
							<InputOTPSeparator />
							<InputOTPGroup>
								<InputOTPSlot index={3} />
								<InputOTPSlot index={4} />
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>
						<p className="text-sm text-muted-foreground">
							Enter the 6-digit code from your authenticator app.
						</p>
						<button
							type="button"
							onClick={() => setIsBackupCodeModalOpen(true)}
							className="text-sm text-muted-foreground hover:underline"
						>
							Lost access to your authenticator app?
						</button>

						{isWebAuthnSupported && hasSecurityKey && (
							<div className="space-y-2">
								<div className="my-1 flex items-center gap-3">
									<span className="h-px flex-1 bg-border" />
									<span className="text-xs text-muted-foreground uppercase">
										or
									</span>
									<span className="h-px flex-1 bg-border" />
								</div>
								<Button
									variant="secondary"
									className="w-full justify-center"
									type="button"
									icon={FingerprintIcon}
									disabled={!securityKeyOptions}
									loading={isSecurityKeyLoading}
									onClick={onSecurityKeySubmit}
								>
									Use a security key
								</Button>
								<p className="text-sm text-muted-foreground">
									Use a hardware key or a security key stored in your browser or
									password manager (Bitwarden, 1Password, iCloud Keychain).
								</p>
							</div>
						)}
						{isWebAuthnSupported && hasNoSecurityKey && (
							<p className="text-sm text-muted-foreground">
								No security key is registered on this account. After signing in,
								add one from Profile → Security to use it next time.
							</p>
						)}
					</div>
				)}

				<div className="grid grid-cols-2 gap-3 pt-2">
					<Button variant="secondary" type="button" onClick={resetTwoFactor}>
						Back
					</Button>
					{twoFactorMethod === "securityKey" ? (
						<Button
							variant="primary"
							type="button"
							onClick={() => setIsBackupCodeModalOpen(true)}
						>
							Use a backup code
						</Button>
					) : (
						<Button
							variant="primary"
							type="submit"
							loading={isTwoFactorLoading}
						>
							Verify
						</Button>
					)}
				</div>
			</form>
		</div>
	);

	return (
		<div
			data-zenth-mode="light"
			className="flex min-h-svh flex-col bg-background text-foreground"
		>
			<header className="flex items-center justify-between gap-4 px-6 py-5 sm:px-10">
				<Link href="/" aria-label="ZenthCloud home" className="inline-flex">
					{brandLogo ? (
						<Logo logoUrl={brandLogo} className="h-9" />
					) : (
						<ZenthcloudLogo variant="glyph" className="h-9 w-auto" />
					)}
				</Link>

				<div className="flex items-center gap-3">
					<span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
						<GlobeIcon className="size-4" aria-hidden="true" />
						English
					</span>
					{IS_CLOUD && (
						<Button
							variant="secondary"
							size="lg"
							onClick={() => router.push("/register")}
						>
							Sign up
						</Button>
					)}
				</div>
			</header>

			<main className="flex flex-1 justify-center px-4 pt-6 pb-12 sm:pt-12">
				<div className="w-full max-w-[26rem]">
					<div className="text-center">
						<h1 className="text-3xl font-semibold tracking-tight">
							Sign in to ZenthCloud
						</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Use your email and password, or continue with a connected account.
						</p>
					</div>

					{error && (
						<AlertBlock type="error" className="mt-6">
							<span>{error}</span>
						</AlertBlock>
					)}

					{isTwoFactor ? (
						twoFactorPanel
					) : !IS_CLOUD && enforceSSO ? (
						<div className="mt-8">
							<div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
								<LockKeyIcon className="size-4" aria-hidden="true" />
								Your administrator requires single sign-on.
							</div>
							<SignInWithSSO enforce />
						</div>
					) : (
						loginPanel
					)}
				</div>
			</main>

			<footer className="flex items-center px-6 py-5 sm:px-10">
				<a
					href="https://zenthcloud.com/legal/cookies"
					target="_blank"
					rel="noreferrer"
					className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
				>
					<CookieIcon className="size-4" aria-hidden="true" />
					Cookie policy
				</a>
			</footer>

			<Dialog
				open={isBackupCodeModalOpen}
				onOpenChange={setIsBackupCodeModalOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Enter Backup Code</DialogTitle>
						<DialogDescription>
							Enter one of your backup codes to access your account
						</DialogDescription>
					</DialogHeader>

					<form
						method="post"
						onSubmit={onBackupCodeSubmit}
						className="space-y-4"
					>
						<div className="flex flex-col gap-2">
							<label htmlFor="backup-code" className="text-sm font-medium">
								Backup Code
							</label>
							<Input
								id="backup-code"
								value={backupCode}
								onChange={(e) => setBackupCode(e.target.value)}
								placeholder="Enter your backup code"
								className="font-mono"
								aria-label="Backup code"
							/>
							<p className="text-sm text-muted-foreground">
								Enter one of the backup codes you received when setting up 2FA.
							</p>
						</div>

						<div className="flex gap-3">
							<Button
								variant="secondary"
								className="w-full justify-center"
								type="button"
								onClick={() => {
									setIsBackupCodeModalOpen(false);
									setBackupCode("");
								}}
							>
								Cancel
							</Button>
							<Button
								variant="primary"
								className="w-full justify-center"
								type="submit"
								loading={isBackupCodeLoading}
							>
								Verify
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const helpers = generateServerSideHelper(appRouter, context);
	// Prefetch the public branding so the login logo and app name render
	// correctly on the server (no flash of default branding).
	await helpers.whitelabeling.getPublic.prefetch();

	if (IS_CLOUD) {
		try {
			const { user } = await validateRequest(context.req);
			if (user) {
				return {
					redirect: {
						permanent: false,
						destination: "/dashboard/home",
					},
				};
			}
		} catch {}

		return {
			props: {
				trpcState: helpers.dehydrate(),
				IS_CLOUD: IS_CLOUD,
				enforceSSO: false,
			},
		};
	}

	const hasAdmin = await isAdminPresent();

	if (!hasAdmin) {
		return {
			redirect: {
				permanent: false,
				destination: "/register",
			},
		};
	}

	const { user } = await validateRequest(context.req);

	if (user) {
		return {
			redirect: {
				permanent: false,
				destination: "/dashboard/home",
			},
		};
	}

	const webServerSettings = await getWebServerSettings();

	return {
		props: {
			trpcState: helpers.dehydrate(),
			hasAdmin,
			enforceSSO: webServerSettings?.enforceSSO ?? false,
		},
	};
}
