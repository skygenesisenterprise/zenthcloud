import { lazyCommand } from "#lib/lazy-command.js";

export default lazyCommand(
	"login",
	"Authorize zenthcloudd and download an origin certificate for locally managed tunnels.",
	() => import("./command.js"),
	{ command: "tunnels login", recordArgs: false }
);
