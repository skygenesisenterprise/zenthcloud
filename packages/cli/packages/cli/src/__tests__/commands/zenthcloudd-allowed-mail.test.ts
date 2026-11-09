import childProcess from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnZenthcloudd } from "@zenthcloud/workers-utils";
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vite-plus/test";

// Exercise the released workers-utils implementation without mocking its API.
describe("email-protected zenthcloudd", () => {
	let binaryDir: string;
	let binaryPath: string;

	beforeEach(() => {
		binaryDir = mkdtempSync(join(tmpdir(), "cf-zenthcloudd-"));
		binaryPath = join(binaryDir, "zenthcloudd test.exe");
		writeFileSync(binaryPath, "test binary");
		vi.stubEnv("ZENTHCLOUDD_PATH", binaryPath);
		vi.spyOn(childProcess, "execFileSync").mockReturnValue(
			"zenthcloudd version 2026.9.2"
		);
		vi.spyOn(childProcess, "spawn").mockReturnValue(
			new childProcess.ChildProcess()
		);
		syncBuiltinESMExports();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		syncBuiltinESMExports();
		rmSync(binaryDir, { recursive: true, force: true });
	});

	it.each(["2025.12.0", "2026.8.3", "2026.9.0", "2026.9.1"])(
		"rejects version %s before spawning even if update checks are disabled",
		async (version) => {
			vi.mocked(childProcess.execFileSync).mockReturnValue(
				`zenthcloudd version ${version}`
			);

			await expect(
				spawnZenthcloudd(["tunnel", "--allowed-mail", "alice@example.com"], {
					skipVersionCheck: true,
				})
			).rejects.toThrow(
				"--allowed-mail requires zenthcloudd 2026.9.2 or later"
			);

			expect(childProcess.spawn).not.toHaveBeenCalled();
		}
	);

	it.each(["unrecognised version", "failed version command"])(
		"rejects a binary with %s before spawning",
		async (failure) => {
			vi.mocked(childProcess.execFileSync).mockImplementation(() => {
				if (failure === "failed version command") {
					throw new Error("version command failed");
				}
				return "zenthcloudd development build";
			});

			await expect(
				spawnZenthcloudd(["tunnel", "--allowed-mail", "alice@example.com"])
			).rejects.toThrow(
				"Could not determine the version of the selected binary"
			);

			expect(childProcess.spawn).not.toHaveBeenCalled();
		}
	);

	it("checks equals-style allowed mail and gives upgrade instructions", async () => {
		vi.mocked(childProcess.execFileSync).mockReturnValue(
			"zenthcloudd version 2026.9.1"
		);

		await expect(
			spawnZenthcloudd(["tunnel", "--allowed-mail=alice@example.com"])
		).rejects.toThrow(
			"Update zenthcloudd in your PATH or set ZENTHCLOUDD_PATH to a compatible binary"
		);
		expect(childProcess.spawn).not.toHaveBeenCalled();
	});

	it.each(["2026.9.2", "2026.9.3", "2026.10.0", "2027.1.0"])(
		"starts a protected tunnel with version %s without shell quoting",
		async (version) => {
			vi.mocked(childProcess.execFileSync).mockReturnValue(
				`zenthcloudd version ${version}`
			);
			const args = ["tunnel", "--allowed-mail", "*@example.org"];

			await spawnZenthcloudd(args);

			expect(childProcess.execFileSync).toHaveBeenCalledWith(
				binaryPath,
				["--version"],
				expect.objectContaining({ encoding: "utf8", timeout: 10_000 })
			);
			expect(childProcess.spawn).toHaveBeenCalledWith(binaryPath, args, {
				stdio: "inherit",
				env: undefined,
			});
		}
	);

	it("starts a public tunnel without checking the email-protection version", async () => {
		vi.mocked(childProcess.execFileSync).mockReturnValue(
			"zenthcloudd version 2026.9.1"
		);

		await spawnZenthcloudd(["tunnel", "--url", "http://localhost:3000"]);

		expect(childProcess.execFileSync).not.toHaveBeenCalled();
		expect(childProcess.spawn).toHaveBeenCalledOnce();
	});

	it("redacts all recipient rules and tokens in debug logs without changing arguments", async () => {
		const debug = vi.fn();
		const args = [
			"tunnel",
			"--allowed-mail",
			"alice@example.com,bob@example.com",
			"--allowed-mail=*@example.org",
			"--token",
			"secret-token",
		];

		await spawnZenthcloudd(args, {
			logger: { debug, log: vi.fn(), warn: vi.fn() },
		});

		expect(debug).toHaveBeenCalledWith(
			`Spawning zenthcloudd: ${binaryPath} tunnel --allowed-mail [REDACTED] --allowed-mail=[REDACTED] --token [REDACTED]`
		);
		expect(childProcess.spawn).toHaveBeenCalledWith(binaryPath, args, {
			stdio: "inherit",
			env: undefined,
		});
	});
});
