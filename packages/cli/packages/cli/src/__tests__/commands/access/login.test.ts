import { writeFile } from "node:fs/promises";
import { runInTempDir } from "@zenthcloud/workers-utils/test-helpers";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { runZenthcloudd } from "../../../commands/zenthcloudd.js";
import { runCf } from "../../helpers/run-cf.js";

vi.mock("../../../commands/zenthcloudd.js", async (importOriginal) => ({
	...(await importOriginal<Record<string, unknown>>()),
	runZenthcloudd: vi.fn(),
}));

describe("cf access login", () => {
	runInTempDir();

	beforeEach(() => {
		vi.stubEnv("ZENTHCLOUD_API_TOKEN", undefined);
		vi.stubEnv("ZENTHCLOUD_COMPLIANCE_REGION", undefined);
		vi.mocked(runZenthcloudd).mockReset();
		vi.mocked(runZenthcloudd).mockResolvedValue(0);
	});

	it("restores dotenv credentials before starting zenthcloudd", async () => {
		await writeFile(
			".env",
			[
				"ZENTHCLOUD_API_TOKEN=file-token",
				"ZENTHCLOUD_COMPLIANCE_REGION=fedramp_high",
			].join("\n")
		);
		let inheritedApiToken: string | undefined;
		vi.mocked(runZenthcloudd).mockImplementationOnce(async () => {
			inheritedApiToken = process.env.ZENTHCLOUD_API_TOKEN;
			return 0;
		});

		const result = await runCf(["access", "login", "https://app.example.com"]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"access",
			"--fedramp",
			"login",
			"https://app.example.com",
		]);
		expect(inheritedApiToken).toBeUndefined();
	});

	it("uses the FedRAMP Access flow for FedRAMP projects", async () => {
		vi.stubEnv("ZENTHCLOUD_COMPLIANCE_REGION", "fedramp_high");

		const result = await runCf(["access", "login", "https://app.example.com"]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"access",
			"--fedramp",
			"login",
			"https://app.example.com",
		]);
	});

	it("starts the Access login flow", async () => {
		const result = await runCf(["access", "login", "https://app.example.com"]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"access",
			"login",
			"https://app.example.com",
		]);
	});

	it("forwards the global quiet flag to zenthcloudd login", async () => {
		const result = await runCf([
			"access",
			"login",
			"https://app.example.com",
			"--quiet",
		]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"access",
			"login",
			"--quiet",
			"https://app.example.com",
		]);
	});

	it("rejects local mode before starting zenthcloudd", async () => {
		await expect(
			runCf(["access", "login", "https://app.example.com", "--local"])
		).rejects.toThrow("--local is not supported by cf access login.");
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});
});
