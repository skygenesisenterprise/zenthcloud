import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { runZenthcloudd } from "../../../commands/zenthcloudd.js";
import { runCf } from "../../helpers/run-cf.js";

vi.mock("../../../commands/zenthcloudd.js", async (importOriginal) => ({
	...(await importOriginal<Record<string, unknown>>()),
	runZenthcloudd: vi.fn(),
}));

describe("cf access ssh-config", () => {
	beforeEach(() => {
		vi.stubEnv("ZENTHCLOUD_COMPLIANCE_REGION", undefined);
		vi.mocked(runZenthcloudd).mockReset();
		vi.mocked(runZenthcloudd).mockResolvedValue(0);
	});

	it("prints an SSH configuration through zenthcloudd", async () => {
		const result = await runCf([
			"access",
			"ssh-config",
			"--hostname",
			"ssh.example.com",
		]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"access",
			"ssh-config",
			"--hostname",
			"ssh.example.com",
		]);
	});

	it("includes short-lived certificate configuration when requested", async () => {
		const result = await runCf(["access", "ssh-config", "--short-lived-cert"]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"access",
			"ssh-config",
			"--short-lived-cert",
		]);
	});

	it("rejects FedRAMP before generating an incompatible configuration", async () => {
		vi.stubEnv("ZENTHCLOUD_COMPLIANCE_REGION", "fedramp_high");

		await expect(runCf(["access", "ssh-config"])).rejects.toThrow(
			"cf access ssh-config does not support FedRAMP because zenthcloudd does not include --fedramp in its generated SSH configuration."
		);
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});

	it("rejects local mode before starting zenthcloudd", async () => {
		await expect(runCf(["access", "ssh-config", "--local"])).rejects.toThrow(
			"--local is not supported by cf access ssh-config."
		);
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});
});
