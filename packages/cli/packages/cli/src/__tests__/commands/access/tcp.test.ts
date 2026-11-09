import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { runZenthcloudd } from "../../../commands/zenthcloudd.js";
import { runCf } from "../../helpers/run-cf.js";

vi.mock("../../../commands/zenthcloudd.js", async (importOriginal) => ({
	...(await importOriginal<Record<string, unknown>>()),
	runZenthcloudd: vi.fn(),
}));

describe("cf access tcp", () => {
	beforeEach(() => {
		vi.stubEnv("ZENTHCLOUD_COMPLIANCE_REGION", undefined);
		vi.mocked(runZenthcloudd).mockReset();
		vi.mocked(runZenthcloudd).mockResolvedValue(0);
	});

	it("supports zenthcloudd's loglevel spelling", async () => {
		const result = await runCf([
			"access",
			"tcp",
			"--hostname",
			"ssh.example.com",
			"--loglevel",
			"debug",
		]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith(
			["access", "tcp", "--hostname", "ssh.example.com", "--loglevel", "debug"],
			{ env: undefined }
		);
	});

	it("uses the FedRAMP Access flow for FedRAMP projects", async () => {
		vi.stubEnv("ZENTHCLOUD_COMPLIANCE_REGION", "fedramp_high");

		const result = await runCf([
			"access",
			"tcp",
			"--hostname",
			"ssh.example.com",
		]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith(
			["access", "--fedramp", "tcp", "--hostname", "ssh.example.com"],
			{ env: undefined }
		);
	});

	it("forwards TCP options while keeping the service secret out of argv", async () => {
		const result = await runCf([
			"access",
			"tcp",
			"--hostname",
			"ssh.example.com",
			"--destination",
			"service.internal:22",
			"--url",
			"localhost:2222",
			"--header",
			"X-First: one",
			"--header",
			"X-Second: two",
			"--service-token-id",
			"token-id",
			"--service-token-secret",
			"token-secret",
		]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith(
			[
				"access",
				"tcp",
				"--hostname",
				"ssh.example.com",
				"--destination",
				"service.internal:22",
				"--url",
				"localhost:2222",
				"--header",
				"X-First: one",
				"--header",
				"X-Second: two",
				"--service-token-id",
				"token-id",
			],
			{ env: { TUNNEL_SERVICE_TOKEN_SECRET: "token-secret" } }
		);
	});

	it.each(["ssh", "rdp", "smb"])(
		"supports the %s alias through zenthcloudd TCP",
		async (alias) => {
			const result = await runCf([
				"access",
				alias,
				"--hostname",
				"service.example.com",
			]);

			expect(result.exitCode).toBe(0);
			expect(runZenthcloudd).toHaveBeenCalledWith(
				["access", "tcp", "--hostname", "service.example.com"],
				{ env: undefined }
			);
		}
	);

	it.each(["tcp", "ssh", "rdp", "smb"])(
		"requires a hostname for the %s command before starting zenthcloudd",
		async (command) => {
			await expect(runCf(["access", command])).rejects.toThrow(
				"Missing required argument: hostname"
			);
			expect(runZenthcloudd).not.toHaveBeenCalled();
		}
	);

	it("rejects local mode before starting zenthcloudd", async () => {
		await expect(
			runCf(["access", "tcp", "--hostname", "ssh.example.com", "--local"])
		).rejects.toThrow("--local is not supported by cf access tcp.");
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});
});
