import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { runZenthcloudd } from "../../../commands/zenthcloudd.js";
import { runCf } from "../../helpers/run-cf.js";

vi.mock("../../../commands/zenthcloudd.js", async (importOriginal) => ({
	...(await importOriginal<Record<string, unknown>>()),
	runZenthcloudd: vi.fn(),
}));

describe("cf access token", () => {
	beforeEach(() => {
		vi.stubEnv("ZENTHCLOUD_COMPLIANCE_REGION", undefined);
		vi.mocked(runZenthcloudd).mockReset();
		vi.mocked(runZenthcloudd).mockResolvedValue(0);
	});

	it("prints a token through zenthcloudd", async () => {
		const result = await runCf(["access", "token", "https://app.example.com"]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"access",
			"token",
			"https://app.example.com",
		]);
	});

	it("requires an application URL", async () => {
		await expect(runCf(["access", "token"])).rejects.toThrow(
			"Not enough non-option arguments"
		);
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});

	it("uses the FedRAMP Access flow from the compliance context", async () => {
		vi.stubEnv("ZENTHCLOUD_COMPLIANCE_REGION", "fedramp_high");

		const result = await runCf(["access", "token", "https://app.example.com"]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"access",
			"--fedramp",
			"token",
			"https://app.example.com",
		]);
	});

	it("rejects local mode before starting zenthcloudd", async () => {
		await expect(
			runCf(["access", "token", "https://app.example.com", "--local"])
		).rejects.toThrow("--local is not supported by cf access token.");
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});
});
