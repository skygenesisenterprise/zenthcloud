import { writeFile } from "node:fs/promises";
import { runInTempDir } from "@zenthcloud/workers-utils/test-helpers";
import { http, HttpResponse } from "msw/http";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { runZenthcloudd } from "../../../commands/zenthcloudd.js";
import { server, setupMsw, TEST_BASE_URL } from "../../helpers/msw.js";
import { runCf } from "../../helpers/run-cf.js";

vi.mock("../../../commands/zenthcloudd.js", async (importOriginal) => ({
	...(await importOriginal<Record<string, unknown>>()),
	runZenthcloudd: vi.fn(),
}));

const TUNNEL_ID = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
const CONNECTOR_ID = "550e8400-e29b-41d4-a716-446655440000";
const API_ENV = {
	ZENTHCLOUD_ACCOUNT_ID: "account-id",
	ZENTHCLOUD_API_BASE_URL: TEST_BASE_URL,
	ZENTHCLOUD_API_TOKEN: "api-token",
};

describe("cf tunnels tail", () => {
	runInTempDir();
	setupMsw();

	beforeEach(() => {
		vi.stubEnv("ZENTHCLOUD_ACCOUNT_ID", undefined);
		vi.stubEnv("ZENTHCLOUD_API_TOKEN", undefined);
		vi.stubEnv("TUNNEL_MANAGEMENT_TOKEN", undefined);
		vi.mocked(runZenthcloudd).mockReset();
		vi.mocked(runZenthcloudd).mockResolvedValue(0);
	});

	it("uses dotenv credentials for the API without passing them to zenthcloudd", async () => {
		await writeFile(
			".env",
			[
				"ZENTHCLOUD_ACCOUNT_ID=file-account-id",
				"ZENTHCLOUD_API_TOKEN=file-api-token",
			].join("\n")
		);
		server.use(
			http.post(
				`${TEST_BASE_URL}/accounts/file-account-id/cfd_tunnel/${TUNNEL_ID}/management`,
				({ request }) => {
					expect(request.headers.get("authorization")).toBe(
						"Bearer file-api-token"
					);
					return HttpResponse.json({
						success: true,
						result: "management-token",
					});
				}
			)
		);
		let inheritedAccountId: string | undefined;
		let inheritedApiToken: string | undefined;
		vi.mocked(runZenthcloudd).mockImplementationOnce(async () => {
			inheritedAccountId = process.env.ZENTHCLOUD_ACCOUNT_ID;
			inheritedApiToken = process.env.ZENTHCLOUD_API_TOKEN;
			return 0;
		});

		const result = await runCf(["tunnels", "tail", TUNNEL_ID], {
			ZENTHCLOUD_API_BASE_URL: TEST_BASE_URL,
		});

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith(
			["tail", "--output", "json", TUNNEL_ID],
			{ env: { TUNNEL_MANAGEMENT_TOKEN: "management-token" } }
		);
		expect(inheritedAccountId).toBeUndefined();
		expect(inheritedApiToken).toBeUndefined();
	});

	it("streams JSON logs with the requested filters", async () => {
		server.use(
			http.post(
				`${TEST_BASE_URL}/accounts/account-id/cfd_tunnel/${TUNNEL_ID}/management`,
				async ({ request }) => {
					expect(await request.json()).toEqual({ resources: ["logs"] });
					return HttpResponse.json({
						success: true,
						result: "management-token",
					});
				}
			)
		);

		const result = await runCf(
			[
				"tunnels",
				"tail",
				TUNNEL_ID,
				"--connector-id",
				CONNECTOR_ID,
				"--event",
				"http",
				"--event",
				"tcp",
				"--level",
				"warn",
				"--sample",
				"0.25",
			],
			API_ENV
		);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith(
			[
				"tail",
				"--output",
				"json",
				"--connector-id",
				CONNECTOR_ID,
				"--event",
				"http",
				"--event",
				"tcp",
				"--level",
				"warn",
				"--sample",
				"0.25",
				TUNNEL_ID,
			],
			{ env: { TUNNEL_MANAGEMENT_TOKEN: "management-token" } }
		);
	});

	it("uses an inherited management token without requiring a tunnel ID", async () => {
		vi.stubEnv("TUNNEL_MANAGEMENT_TOKEN", "management-token");

		const result = await runCf(["tunnels", "tail"]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith(["tail", "--output", "json"], {
			env: { TUNNEL_MANAGEMENT_TOKEN: "management-token" },
		});
	});

	it("rejects a tunnel ID combined with an inherited management token", async () => {
		vi.stubEnv("TUNNEL_MANAGEMENT_TOKEN", "management-token");

		await expect(runCf(["tunnels", "tail", TUNNEL_ID])).rejects.toThrow(
			"Specify either a tunnel ID or TUNNEL_MANAGEMENT_TOKEN, not both."
		);
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});

	it("requires a tunnel ID or inherited management token", async () => {
		await expect(runCf(["tunnels", "tail"])).rejects.toThrow(
			"Either a tunnel ID or TUNNEL_MANAGEMENT_TOKEN must be provided."
		);
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});

	it.each([
		["without a tunnel ID", ["tunnels", "tail"]],
		["before using a tunnel ID", ["tunnels", "tail", TUNNEL_ID]],
	])("rejects a blank inherited management token %s", async (_name, args) => {
		vi.stubEnv("TUNNEL_MANAGEMENT_TOKEN", "  \t");

		await expect(runCf(args)).rejects.toThrow(
			"TUNNEL_MANAGEMENT_TOKEN must not be empty."
		);
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});

	it("rejects malformed tunnel and connector IDs", async () => {
		await expect(runCf(["tunnels", "tail", "not-a-uuid"])).rejects.toThrow(
			"Tunnel ID must be a valid UUID."
		);
		await expect(
			runCf(["tunnels", "tail", TUNNEL_ID, "--connector-id", "not-a-uuid"])
		).rejects.toThrow("--connector-id must be a valid UUID.");
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});

	it("rejects invalid sampling fractions before starting zenthcloudd", async () => {
		for (const sample of ["0", "1.01", "Infinity"]) {
			await expect(
				runCf(["tunnels", "tail", "--sample", sample])
			).rejects.toThrow(
				"--sample must be greater than 0.0 and no greater than 1.0."
			);
		}
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});

	it("rejects local mode before starting zenthcloudd", async () => {
		await expect(runCf(["tunnels", "tail", "--local"])).rejects.toThrow(
			"--local is not supported by cf tunnels tail."
		);
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});
});
