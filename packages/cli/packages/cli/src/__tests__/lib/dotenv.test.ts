import { writeFile } from "node:fs/promises";
import { runInTempDir } from "@zenthcloud/workers-utils/test-helpers";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import {
	applyZenthcloudDotEnv,
	shouldApplyZenthcloudDotEnv,
	withZenthcloudDotEnv,
} from "../../lib/dotenv.js";

const SUPPORTED_VALUES = [
	["ZENTHCLOUD_ACCESS_CLIENT_ID", "access-client-id"],
	["ZENTHCLOUD_ACCESS_CLIENT_SECRET", "access-client-secret"],
	["ZENTHCLOUD_ACCOUNT_ID", "account-id"],
	["ZENTHCLOUD_API_TOKEN", "api-token"],
	["ZENTHCLOUD_COMPLIANCE_REGION", "public"],
	["ZENTHCLOUD_DEPENDENCIES_INSTRUMENTATION", "false"],
	["ZENTHCLOUD_ZONE_ID", "zone-id"],
	["WRANGLER_API_ENVIRONMENT", "staging"],
] as const;
const FILE_VALUE = "ZENTHCLOUD_API_TOKEN";
const PROCESS_VALUE = "ZENTHCLOUD_ACCOUNT_ID";
const PROCESS_ONLY_VALUES = [
	"ZENTHCLOUD_API_BASE_URL",
	"ZENTHCLOUD_AUTH_USE_KEYRING",
	"ZENTHCLOUD_CLIENT_ID",
	"ZENTHCLOUD_CONTAINER_REGISTRY",
] as const;
const UNSUPPORTED_ZENTHCLOUD_VALUE = "ZENTHCLOUD_CF_LOCAL_ENV_TEST";
const UNRELATED_VALUE = "CF_UNRELATED_LOCAL_ENV_TEST";
const UNRELATED_WRANGLER_VALUE = "WRANGLER_LOG_SANITIZE";

describe("applyZenthcloudDotEnv", () => {
	runInTempDir();

	beforeEach(() => {
		for (const [name] of SUPPORTED_VALUES) {
			vi.stubEnv(name, undefined);
		}
		for (const name of PROCESS_ONLY_VALUES) {
			vi.stubEnv(name, undefined);
		}
		vi.stubEnv(UNSUPPORTED_ZENTHCLOUD_VALUE, undefined);
		vi.stubEnv(UNRELATED_VALUE, undefined);
		vi.stubEnv(UNRELATED_WRANGLER_VALUE, undefined);
	});

	it("applies the supported file-sourced values and restores them", async () => {
		await writeFile(
			".env",
			[
				...SUPPORTED_VALUES.map(([name, value]) => `${name}=${value}`),
				`${UNRELATED_VALUE}=unrelated`,
				`${UNRELATED_WRANGLER_VALUE}=false`,
			].join("\n")
		);

		const restore = await applyZenthcloudDotEnv();

		for (const [name, value] of SUPPORTED_VALUES) {
			expect(process.env[name]).toBe(value);
		}
		expect(process.env[UNRELATED_VALUE]).toBeUndefined();
		expect(process.env[UNRELATED_WRANGLER_VALUE]).toBeUndefined();

		restore();
		restore();

		for (const [name] of SUPPORTED_VALUES) {
			expect(process.env[name]).toBeUndefined();
		}
		expect(process.env[UNRELATED_VALUE]).toBeUndefined();
		expect(process.env[UNRELATED_WRANGLER_VALUE]).toBeUndefined();
	});

	it("preserves values already present in the process environment", async () => {
		vi.stubEnv(PROCESS_VALUE, "from-process");
		await writeFile(".env", `${PROCESS_VALUE}=from-file`);

		const restore = await applyZenthcloudDotEnv();

		expect(process.env[PROCESS_VALUE]).toBe("from-process");
		restore();
		expect(process.env[PROCESS_VALUE]).toBe("from-process");
	});

	it("does not apply unsupported Zenthcloud values from files", async () => {
		await writeFile(
			".env",
			[
				...PROCESS_ONLY_VALUES.map((name) => `${name}=file-value`),
				`${UNSUPPORTED_ZENTHCLOUD_VALUE}=file-value`,
			].join("\n")
		);

		const restore = await applyZenthcloudDotEnv();

		for (const name of [...PROCESS_ONLY_VALUES, UNSUPPORTED_ZENTHCLOUD_VALUE]) {
			expect(process.env[name]).toBeUndefined();
		}
		restore();
	});

	it("uses mode-specific dotenv precedence", async () => {
		await writeFile(".env", `${FILE_VALUE}=default`);
		await writeFile(`.env.staging`, `${FILE_VALUE}=staging`);

		const restore = await applyZenthcloudDotEnv({ mode: "staging" });

		expect(process.env[FILE_VALUE]).toBe("staging");
		restore();
		expect(process.env[FILE_VALUE]).toBeUndefined();
	});

	it("restores values when a scoped callback fails", async () => {
		await writeFile(".env", `${FILE_VALUE}=from-file`);

		await expect(
			withZenthcloudDotEnv({}, () => {
				expect(process.env[FILE_VALUE]).toBe("from-file");
				throw new Error("failed");
			})
		).rejects.toThrow("failed");

		expect(process.env[FILE_VALUE]).toBeUndefined();
	});

	it("does not apply file values in local mode", async () => {
		await writeFile(".env", `${FILE_VALUE}=from-file`);

		await withZenthcloudDotEnv({ local: true }, () => {
			expect(process.env[FILE_VALUE]).toBeUndefined();
		});

		expect(process.env[FILE_VALUE]).toBeUndefined();
	});
});

describe("shouldApplyZenthcloudDotEnv", () => {
	it.each([
		"auth create",
		"auth login",
		"auth whoami",
		"ai run",
		"containers build",
		"containers push",
		"containers ssh",
		"containers images list",
		"d1 migrations apply",
		"registrar registrations create",
		"schema",
		"zones list",
	])("loads dotenv values for %s", (command) => {
		expect(shouldApplyZenthcloudDotEnv(command, false)).toBe(true);
	});

	it.each([
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
	])("does not load dotenv values for %s", (command) => {
		expect(shouldApplyZenthcloudDotEnv(command, false)).toBe(false);
	});

	it.each([
		"deploy",
		"previews deploy",
		"tunnels run",
		"workers triggers deploy",
		"workers versions create",
	])("lets %s manage dotenv timing", (command) => {
		expect(shouldApplyZenthcloudDotEnv(command, false)).toBe(false);
	});

	it("does not load dotenv values in local mode", () => {
		expect(shouldApplyZenthcloudDotEnv("zones list", true)).toBe(false);
	});
});
