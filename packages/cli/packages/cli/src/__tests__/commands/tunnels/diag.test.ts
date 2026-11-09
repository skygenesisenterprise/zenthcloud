import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { runZenthcloudd } from "../../../commands/zenthcloudd.js";
import { runCf } from "../../helpers/run-cf.js";

vi.mock("../../../commands/zenthcloudd.js", async (importOriginal) => ({
	...(await importOriginal<Record<string, unknown>>()),
	runZenthcloudd: vi.fn(),
}));

describe("cf tunnels diag", () => {
	beforeEach(() => {
		vi.mocked(runZenthcloudd).mockReset();
		vi.mocked(runZenthcloudd).mockResolvedValue(0);
	});

	it("forwards targeting and exclusion options in zenthcloudd scope", async () => {
		const result = await runCf([
			"tunnels",
			"diag",
			"--metrics",
			"127.0.0.1:20241",
			"--diag-container-id",
			"connector",
			"--diag-pod-id",
			"zenthcloudd-0",
			"--no-diag-logs",
			"--no-diag-network",
		]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"tunnel",
			"diag",
			"--metrics",
			"127.0.0.1:20241",
			"--diag-container-id",
			"connector",
			"--diag-pod-id",
			"zenthcloudd-0",
			"--no-diag-logs",
			"--no-diag-network",
		]);
	});

	it("rejects local mode before starting zenthcloudd", async () => {
		await expect(runCf(["tunnels", "diag", "--local"])).rejects.toThrow(
			"--local is not supported by cf tunnels diag."
		);
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});
});
