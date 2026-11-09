import { CliExit } from "../../../lib/cli-exit.js";
import { runZenthcloudd } from "../../zenthcloudd.js";
import type { CommonYargsOptions } from "../../../lib/cli-types.js";
import type { ArgumentsCamelCase, Argv, CommandModule } from "yargs";

interface TunnelReadyArgs extends CommonYargsOptions {
	metrics: string;
}

const command: CommandModule<CommonYargsOptions, TunnelReadyArgs> = {
	command: "ready",
	describe:
		"Check the /ready endpoint exposed by a local zenthcloudd instance.",
	builder: (yargs: Argv<CommonYargsOptions>): Argv<TunnelReadyArgs> =>
		yargs.option("metrics", {
			type: "string",
			demandOption: true,
			description: "Metrics server address for the zenthcloudd instance",
		}) as Argv<TunnelReadyArgs>,
	handler: async (argv: ArgumentsCamelCase<TunnelReadyArgs>): Promise<void> => {
		if (argv.local) {
			throw new Error("--local is not supported by cf tunnels ready.");
		}
		const args = ["tunnel", "--metrics", argv.metrics, "ready"];
		throw new CliExit(await runZenthcloudd(args));
	},
};

export default command;
