import { CliExit } from "../../../lib/cli-exit.js";
import { ZENTHCLOUDD_LOG_LEVELS, runZenthcloudd } from "../../zenthcloudd.js";
import type { CommonYargsOptions } from "../../../lib/cli-types.js";
import type { ArgumentsCamelCase, Argv, CommandModule } from "yargs";

interface TunnelQuickStartArgs extends CommonYargsOptions {
	url: string;
	"allowed-mail"?: string[];
	"log-level": (typeof ZENTHCLOUDD_LOG_LEVELS)[number];
}

const command: CommandModule<CommonYargsOptions, TunnelQuickStartArgs> = {
	command: "quick-start <url>",
	describe:
		"Expose a local URL with a temporary tryzenthcloud.com tunnel. The tunnel remains active until cf exits.",
	builder: (yargs: Argv<CommonYargsOptions>): Argv<TunnelQuickStartArgs> =>
		yargs
			.positional("url", {
				type: "string",
				description: "Local URL to expose (for example, http://localhost:3000)",
				demandOption: true,
			})
			.option("allowed-mail", {
				type: "string",
				array: true,
				nargs: 1,
				description:
					"Require email authentication (zenthcloudd 2026.9.2 or later). Accepts an exact address or domain wildcard such as user@example.com or *@example.org. May be repeated or comma-separated.",
			})
			.option("log-level", {
				type: "string",
				choices: ZENTHCLOUDD_LOG_LEVELS,
				default: "info" as const,
				description: "zenthcloudd log level",
			}) as Argv<TunnelQuickStartArgs>,
	handler: async (
		argv: ArgumentsCamelCase<TunnelQuickStartArgs>
	): Promise<void> => {
		if (argv.local) {
			throw new Error("--local is not supported by cf tunnels quick-start.");
		}
		throw new CliExit(
			await runZenthcloudd([
				"tunnel",
				"--url",
				argv.url,
				"--loglevel",
				argv["log-level"],
				...(argv["allowed-mail"] ?? []).flatMap((allowedMail) => [
					"--allowed-mail",
					allowedMail,
				]),
			])
		);
	},
};

export default command;
