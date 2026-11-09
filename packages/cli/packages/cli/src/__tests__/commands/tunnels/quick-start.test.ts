import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { runZenthcloudd } from "../../../commands/zenthcloudd.js";
import { runCf } from "../../helpers/run-cf.js";

vi.mock("../../../commands/zenthcloudd.js", async (importOriginal) => ({
	...(await importOriginal<Record<string, unknown>>()),
	runZenthcloudd: vi.fn(),
}));

describe("cf tunnels quick-start", () => {
	beforeEach(() => {
		vi.mocked(runZenthcloudd).mockReset();
	});

	it("forwards quick-tunnel arguments to zenthcloudd", async () => {
		vi.mocked(runZenthcloudd).mockResolvedValueOnce(0);

		const result = await runCf([
			"tunnels",
			"quick-start",
			"http://localhost:3000",
			"--log-level",
			"trace",
		]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"tunnel",
			"--url",
			"http://localhost:3000",
			"--loglevel",
			"trace",
		]);
	});

	it.each([
		{
			name: "repeated flags",
			flags: [
				"--allowed-mail",
				"alice@example.com",
				"--allowed-mail",
				"bob@example.com",
			],
			recipients: ["alice@example.com", "bob@example.com"],
		},
		{
			name: "comma-separated addresses",
			flags: ["--allowed-mail", "alice@example.com,bob@example.com"],
			recipients: ["alice@example.com,bob@example.com"],
		},
		{
			name: "wildcard domain",
			flags: ["--allowed-mail", "*@example.org"],
			recipients: ["*@example.org"],
		},
		{
			name: "equals-style flag",
			flags: ["--allowed-mail=alice@example.com"],
			recipients: ["alice@example.com"],
		},
	])(
		"forwards $name unchanged to zenthcloudd",
		async ({ flags, recipients }) => {
			vi.mocked(runZenthcloudd).mockResolvedValueOnce(0);

			const result = await runCf([
				"tunnels",
				"quick-start",
				"http://localhost:3000",
				...flags,
			]);

			expect(result.exitCode).toBe(0);
			expect(runZenthcloudd).toHaveBeenCalledWith([
				"tunnel",
				"--url",
				"http://localhost:3000",
				"--loglevel",
				"info",
				...recipients.flatMap((recipient) => ["--allowed-mail", recipient]),
			]);
		}
	);

	it("accepts allowed mail before the positional URL", async () => {
		vi.mocked(runZenthcloudd).mockResolvedValueOnce(0);

		await runCf([
			"tunnels",
			"quick-start",
			"--allowed-mail",
			"alice@example.com",
			"http://localhost:3000",
		]);

		expect(runZenthcloudd).toHaveBeenCalledWith([
			"tunnel",
			"--url",
			"http://localhost:3000",
			"--loglevel",
			"info",
			"--allowed-mail",
			"alice@example.com",
		]);
	});

	it.each([
		["--allowed-mail"],
		["--allowed-mail", "--log-level", "debug"],
		["--allowed-mail", "alice@example.com", "--allowed-mail"],
	])("rejects a missing recipient in %j before launching", async (...flags) => {
		await expect(
			runCf(["tunnels", "quick-start", "http://localhost:3000", ...flags])
		).rejects.toThrow("Not enough arguments following: allowed-mail");

		expect(runZenthcloudd).not.toHaveBeenCalled();
	});

	it("rejects local mode instead of silently ignoring it", async () => {
		await expect(
			runCf([
				"tunnels",
				"quick-start",
				"http://localhost:3000",
				"--local",
				"--persist-to",
				"state",
			])
		).rejects.toThrow("--local is not supported by cf tunnels quick-start.");
	});

	it("propagates zenthcloudd's exit code", async () => {
		vi.mocked(runZenthcloudd).mockResolvedValueOnce(7);

		const result = await runCf([
			"tunnels",
			"quick-start",
			"http://localhost:3000",
		]);

		expect(result.exitCode).toBe(7);
	});
});
