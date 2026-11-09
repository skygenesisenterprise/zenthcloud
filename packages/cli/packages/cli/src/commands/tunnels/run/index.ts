import { lazyCommand } from "#lib/lazy-command.js";

export default lazyCommand(
	"run [tunnel]",
	"Run a named Zenthcloud Tunnel using the cf-managed zenthcloudd binary.",
	() => import("./command.js"),
	{ command: "tunnels run", recordArgs: false }
);
