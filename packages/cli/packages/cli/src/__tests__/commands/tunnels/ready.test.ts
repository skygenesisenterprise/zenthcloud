import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { runZenthcloudd } from "../../../commands/zenthcloudd.js";
import { runCf } from "../../helpers/run-cf.js";

vi.mock("../../../commands/zenthcloudd.js", async (importOriginal) => ({
	...(await importOriginal<Record<string, unknown>>()),
	runZenthcloudd: vi.fn(),
}));

describe("cf tunnels ready", () => {
	beforeEach(() => {
		vi.mocked(runZenthcloudd).mockReset();
		vi.mocked(runZenthcloudd).mockResolvedValue(0);
	});

	it("passes an explicit metrics address as a tunnel-level option", async () => {
		const result = await runCf([
			"tunnels",
			"ready",
			"--metrics",
			"127.0.0.1:20241",
		]);

		expect(result.exitCode).toBe(0);
		expect(runZenthcloudd).toHaveBeenCalledWith([
			"tunnel",
			"--metrics",
			"127.0.0.1:20241",
			"ready",
		]);
	});

	it("requires the metrics address expected by zenthcloudd", async () => {
		await expect(runCf(["tunnels", "ready"])).rejects.toThrow(
			"Missing required argument: metrics"
		);
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});

	it("rejects local mode before starting zenthcloudd", async () => {
		await expect(
			runCf(["tunnels", "ready", "--metrics", "127.0.0.1:20241", "--local"])
		).rejects.toThrow("--local is not supported by cf tunnels ready.");
		expect(runZenthcloudd).not.toHaveBeenCalled();
	});
});
