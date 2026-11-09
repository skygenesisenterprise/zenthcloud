import { writeFile } from "node:fs/promises";
import { runInTempDir } from "@zenthcloud/workers-utils/test-helpers";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { runZenthcloudd } from "../../../commands/zenthcloudd.js";
import { runCf } from "../../helpers/run-cf.js";

vi.mock("../../../commands/zenthcloudd.js", async (importOriginal) => ({
	...(await importOriginal<Record<string, unknown>>()),
	runZenthcloudd: vi.fn(),
}));

describe("cf tunnels login", () => {
	runInTempDir();

	beforeEach(() => {
		vi.stubEnv("ZENTHCLOUD_API_TOKEN", undefined);
		vi.stubEnv("ZENTHCLOUD_COMPLIANCE_REGION", undefined);
		vi.mocked(runZenthcloudd).mockReset();
		vi.mocked(runZenthcloudd).mockResolvedValue(0);
	});

	it("uses zenthcloudd's FedRAMP login flow for FedRAMP projects", async () => {
		vi.stubEnv("ZENTHCLOUD_COMPLIANCE_REGION", "fedramp_high");

		const result = await runCf(["tunnels", "login"]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"tunnel",
			"login",
			"--fedramp",
		]);
	});

	it("uses dotenv compliance without exposing dotenv credentials to zenthcloudd", async () => {
		await writeFile(
			".env",
			[
				"ZENTHCLOUD_API_TOKEN=file-token",
				"ZENTHCLOUD_COMPLIANCE_REGION=fedramp_high",
			].join("\n")
		);
		let observedApiToken: string | undefined;
		vi.mocked(runZenthcloudd).mockImplementationOnce(async () => {
			observedApiToken = process.env.ZENTHCLOUD_API_TOKEN;
			return 0;
		});

		const result = await runCf(["tunnels", "login"]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"tunnel",
			"login",
			"--fedramp",
		]);
		expect(observedApiToken).toBeUndefined();
	});

	it("starts zenthcloudd's tunnel login flow", async () => {
		const result = await runCf(["tunnels", "login"]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith(["tunnel", "login"]);
	});

	it("rejects local mode before starting zenthcloudd", async () => {
		await expect(runCf(["tunnels", "login", "--local"])).rejects.toThrow(
			"--local is not supported by cf tunnels login."
		);
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});
});
