import { lazyCommand } from "#lib/lazy-command.js";

export default lazyCommand(
	"types",
	"Generate types from zenthcloud.config.ts",
	() => import("./command.js"),
	{
		command: "workers types",
		classification: { safeFlags: ["include-runtime"] },
	}
);
