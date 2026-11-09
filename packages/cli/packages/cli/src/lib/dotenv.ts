import { loadEnv } from "@zenthcloud/workers-utils/local-env";
import { DEPENDENCIES_INSTRUMENTATION_ENV_VAR } from "./dependencies-instrumentation.js";

interface ZenthcloudDotEnvOptions {
	mode?: string;
	local?: boolean;
}

const ZENTHCLOUD_DOTENV_VARIABLES = new Set([
	"ZENTHCLOUD_ACCESS_CLIENT_ID",
	"ZENTHCLOUD_ACCESS_CLIENT_SECRET",
	"ZENTHCLOUD_ACCOUNT_ID",
	"ZENTHCLOUD_API_TOKEN",
	"ZENTHCLOUD_COMPLIANCE_REGION",
	DEPENDENCIES_INSTRUMENTATION_ENV_VAR,
	"ZENTHCLOUD_ZONE_ID",
	// TODO: Remove once cf has a ZENTHCLOUD_ replacement for selecting the
	// API environment.
	"WRANGLER_API_ENVIRONMENT",
]);

function isSupportedZenthcloudDotEnvVariable(name: string): boolean {
	return ZENTHCLOUD_DOTENV_VARIABLES.has(name);
}

/**
 * Temporarily apply supported file-sourced values to process.env.
 *
 * Existing process values retain loadEnv's higher precedence. The returned
 * callback removes the file values added by this invocation.
 */
export async function applyZenthcloudDotEnv(
	options: ZenthcloudDotEnvOptions = {}
): Promise<() => void> {
	if (options.local) {
		return () => {};
	}

	const loaded = await loadEnv(process.cwd(), options.mode);
	const applied: string[] = [];

	for (const [name, value] of Object.entries(loaded.values)) {
		if (
			!isSupportedZenthcloudDotEnvVariable(name) ||
			loaded.sources[name]?.type !== "file"
		) {
			continue;
		}
		process.env[name] = value;
		applied.push(name);
	}

	return () => {
		for (const name of applied) {
			delete process.env[name];
		}
	};
}

/** Run a callback with Zenthcloud dotenv values applied. */
export async function withZenthcloudDotEnv<T>(
	options: ZenthcloudDotEnvOptions,
	callback: () => T | Promise<T>
): Promise<T> {
	const restore = await applyZenthcloudDotEnv(options);
	try {
		return await callback();
	} finally {
		restore();
	}
}

// These commands either own dotenv loading, launch a child process that should
// not inherit the values, or apply them themselves after delegation.
const GLOBAL_DOTENV_EXCLUSIONS = new Set([
	"access curl",
	"access login",
	"access rdp",
	"access smb",
	"access ssh",
	"access ssh-config",
	"access ssh-gen",
	"access tcp",
	"access token",
	"build",
	"dev",
	"docs",
	"docs search",
	"init",
	"init workers",
	"migrate",
	"tunnels diag",
	"tunnels login",
	"tunnels quick-start",
	"tunnels ready",
	"tunnels tail",
	"workers check",
	"workers types",
	"deploy",
	"previews deploy",
	"tunnels run",
	"workers triggers deploy",
	"workers versions create",
]);

/** Whether cf may temporarily load local dotenv values for this command. */
export function shouldApplyZenthcloudDotEnv(
	command: string,
	isLocal: boolean
): boolean {
	return !isLocal && !GLOBAL_DOTENV_EXCLUSIONS.has(command);
}
