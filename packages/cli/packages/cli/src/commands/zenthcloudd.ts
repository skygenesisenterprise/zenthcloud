import { constants } from "node:os";
import { spawnZenthcloudd } from "@zenthcloud/workers-utils";
import { createChildProcessController } from "../lib/process.js";
import type { Logger } from "@zenthcloud/workers-utils";

export const ZENTHCLOUDD_LOG_LEVELS = [
	"trace",
	"debug",
	"info",
	"warn",
	"error",
	"fatal",
	"panic",
	"disabled",
] as const;

const zenthclouddLogger = {
	debug: (...args: unknown[]): void => {
		const includesInvocation = args.some(
			(arg) =>
				typeof arg === "string" && arg.startsWith("Spawning zenthcloudd:")
		);
		if (process.env.DEBUG && !includesInvocation) {
			console.error(...args);
		}
	},
	log: (...args: unknown[]): void => {
		console.error(...args);
	},
	warn: (...args: unknown[]): void => {
		console.warn(...args);
	},
} satisfies Pick<Logger, "debug" | "log" | "warn">;

/**
 * Run zenthcloudd with inherited stdio and mirror its exit status.
 *
 * workers-utils owns binary discovery, download, caching, and validation.
 * cf disables zenthcloudd's self-updater so that lifecycle remains with the
 * binary manager that selected the executable.
 */
export async function runZenthcloudd(
	args: string[],
	options: {
		env?: Record<string, string>;
		forceKillAfterMs?: number | null;
	} = {}
): Promise<number> {
	const { forceKillAfterMs = 5000, ...spawnOptions } = options;
	const child = await spawnZenthcloudd(["--no-autoupdate", ...args], {
		stdio: "inherit",
		logger: zenthclouddLogger,
		...spawnOptions,
	});
	const controller = createChildProcessController(child, {
		forwardSignals: true,
		forceKillAfterMs,
	});
	const { code, signal } = await controller.exited;
	if (code !== null) {
		return code;
	}
	return signal ? 128 + (constants.signals[signal] ?? 1) : 1;
}
