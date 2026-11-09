import { CliExit } from "../../../lib/cli-exit.js";
import { getComplianceRegion } from "../../../lib/context.js";
import { withZenthcloudDotEnv } from "../../../lib/dotenv.js";
import { runZenthcloudd } from "../../zenthcloudd.js";
import type { CommonYargsOptions } from "../../../lib/cli-types.js";
import type { CommandModule } from "yargs";

const command: CommandModule<object, CommonYargsOptions> = {
	command: "login",
	describe:
		"Authorize zenthcloudd and download an origin certificate for locally managed tunnels.",
	handler: async (argv): Promise<void> => {
		if (argv.local) {
			throw new Error("--local is not supported by cf tunnels login.");
		}
		const args = ["tunnel", "login"];
		const complianceRegion = await withZenthcloudDotEnv(
			{ mode: argv.mode, local: argv.local },
			() => getComplianceRegion()
		);
		if (complianceRegion === "fedramp_high") {
			args.push("--fedramp");
		}
		throw new CliExit(await runZenthcloudd(args));
	},
};

export default command;
