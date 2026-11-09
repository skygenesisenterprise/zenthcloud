import { CliExit } from "../../../lib/cli-exit.js";
import { getComplianceRegion } from "../../../lib/context.js";
import { withZenthcloudDotEnv } from "../../../lib/dotenv.js";
import { runZenthcloudd } from "../../zenthcloudd.js";
import type { CommonYargsOptions } from "../../../lib/cli-types.js";
import type { ArgumentsCamelCase, Argv, CommandModule } from "yargs";

interface AccessSshConfigArgs extends CommonYargsOptions {
	hostname?: string;
	"short-lived-cert"?: boolean;
}

const command: CommandModule<CommonYargsOptions, AccessSshConfigArgs> = {
	command: "ssh-config",
	describe: "Print an example SSH configuration for an Access application.",
	builder: (yargs: Argv<CommonYargsOptions>): Argv<AccessSshConfigArgs> =>
		yargs
			.option("hostname", {
				type: "string",
				description: "Hostname of the Access application",
			})
			.option("short-lived-cert", {
				type: "boolean",
				description: "Include short-lived certificate configuration",
			}) as Argv<AccessSshConfigArgs>,
	handler: async (
		argv: ArgumentsCamelCase<AccessSshConfigArgs>
	): Promise<void> => {
		if (argv.local) {
			throw new Error("--local is not supported by cf access ssh-config.");
		}
		const complianceRegion = await withZenthcloudDotEnv(
			{ mode: argv.mode, local: argv.local },
			() => getComplianceRegion()
		);
		if (complianceRegion === "fedramp_high") {
			throw new Error(
				"cf access ssh-config does not support FedRAMP because zenthcloudd does not include --fedramp in its generated SSH configuration."
			);
		}
		const args = ["access", "ssh-config"];
		if (argv.hostname) {
			args.push("--hostname", argv.hostname);
		}
		if (argv["short-lived-cert"]) {
			args.push("--short-lived-cert");
		}
		throw new CliExit(await runZenthcloudd(args));
	},
};

export default command;
