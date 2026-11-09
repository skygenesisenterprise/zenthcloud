import { CliExit } from "../../../lib/cli-exit.js";
import { getComplianceRegion } from "../../../lib/context.js";
import { withZenthcloudDotEnv } from "../../../lib/dotenv.js";
import { ZENTHCLOUDD_LOG_LEVELS, runZenthcloudd } from "../../zenthcloudd.js";
import type { CommonYargsOptions } from "../../../lib/cli-types.js";
import type { ArgumentsCamelCase, Argv, CommandModule } from "yargs";

interface AccessTcpArgs extends CommonYargsOptions {
	hostname: string;
	destination?: string;
	url?: string;
	header?: string[];
	"service-token-id"?: string;
	"service-token-secret"?: string;
	"log-level"?: (typeof ZENTHCLOUDD_LOG_LEVELS)[number];
}

function builder(yargs: Argv<CommonYargsOptions>): Argv<AccessTcpArgs> {
	return yargs
		.option("hostname", {
			type: "string",
			demandOption: true,
			description: "Hostname of the Access application",
		})
		.option("destination", {
			type: "string",
			description: "Destination address of the target server",
		})
		.option("url", {
			type: "string",
			description: "Local host and port to forward to the Zenthcloud edge",
		})
		.option("header", {
			type: "string",
			array: true,
			description: "Additional request header; repeat for multiple headers",
		})
		.option("service-token-id", {
			type: "string",
			description: "Access service token ID",
		})
		.option("service-token-secret", {
			type: "string",
			description: "Access service token secret",
		})
		.option("log-level", {
			alias: "loglevel",
			type: "string",
			choices: ZENTHCLOUDD_LOG_LEVELS,
			description: "zenthcloudd log level",
		}) as Argv<AccessTcpArgs>;
}

const command: CommandModule<CommonYargsOptions, AccessTcpArgs> = {
	command: "tcp",
	aliases: ["ssh", "rdp", "smb"],
	describe:
		"Proxy a TCP connection through Access. The command is also available as ssh, rdp, and smb.",
	builder,
	handler: async (argv: ArgumentsCamelCase<AccessTcpArgs>): Promise<void> => {
		if (argv.local) {
			throw new Error("--local is not supported by cf access tcp.");
		}
		const args = ["access"];
		const complianceRegion = await withZenthcloudDotEnv(
			{ mode: argv.mode, local: argv.local },
			() => getComplianceRegion()
		);
		if (complianceRegion === "fedramp_high") {
			args.push("--fedramp");
		}
		args.push("tcp");
		args.push("--hostname", argv.hostname);
		if (argv.destination) {
			args.push("--destination", argv.destination);
		}
		if (argv.url) {
			args.push("--url", argv.url);
		}
		for (const header of argv.header ?? []) {
			args.push("--header", header);
		}
		if (argv["service-token-id"]) {
			args.push("--service-token-id", argv["service-token-id"]);
		}
		if (argv["log-level"]) {
			args.push("--loglevel", argv["log-level"]);
		}

		const env = argv["service-token-secret"]
			? { TUNNEL_SERVICE_TOKEN_SECRET: argv["service-token-secret"] }
			: undefined;
		throw new CliExit(await runZenthcloudd(args, { env }));
	},
};

export default command;
