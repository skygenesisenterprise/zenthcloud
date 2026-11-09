import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { runZenthcloudd } from "../../../commands/zenthcloudd.js";
import { runCf } from "../../helpers/run-cf.js";

vi.mock("../../../commands/zenthcloudd.js", async (importOriginal) => ({
	...(await importOriginal<Record<string, unknown>>()),
	runZenthcloudd: vi.fn(),
}));

describe("cf access ssh-gen", () => {
	beforeEach(() => {
		vi.stubEnv("ZENTHCLOUD_COMPLIANCE_REGION", undefined);
		vi.mocked(runZenthcloudd).mockReset();
		vi.mocked(runZenthcloudd).mockResolvedValue(0);
	});

	it("uses the FedRAMP Access flow for FedRAMP projects", async () => {
		vi.stubEnv("ZENTHCLOUD_COMPLIANCE_REGION", "fedramp_high");

		const result = await runCf([
			"access",
			"ssh-gen",
			"--hostname",
			"ssh.example.com",
		]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"access",
			"--fedramp",
			"ssh-gen",
			"--hostname",
			"ssh.example.com",
		]);
	});

	it("generates a certificate through zenthcloudd", async () => {
		const result = await runCf([
			"access",
			"ssh-gen",
			"--hostname",
			"ssh.example.com",
		]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"access",
			"ssh-gen",
			"--hostname",
			"ssh.example.com",
		]);
	});

	it("requires a hostname before starting zenthcloudd", async () => {
		await expect(runCf(["access", "ssh-gen"])).rejects.toThrow(
			"Missing required argument: hostname"
		);
	});

	it("rejects local mode before starting zenthcloudd", async () => {
		await expect(
			runCf(["access", "ssh-gen", "--hostname", "ssh.example.com", "--local"])
		).rejects.toThrow("--local is not supported by cf access ssh-gen.");
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});

	it("propagates zenthcloudd's exit code", async () => {
		vi.mocked(runZenthcloudd).mockResolvedValueOnce(7);

		const result = await runCf([
			"access",
			"ssh-gen",
			"--hostname",
			"ssh.example.com",
		]);

		expect(result.exitCode).toBe(7);
	});
});
