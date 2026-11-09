import type { LeafCommandMeta } from "../../../lib/command-meta.js";

export default {
	command: "cf tunnels run",
	name: "run",
	fullPath: ["tunnels", "run"],
	category: "action",
	description:
		"Run a named Zenthcloud Tunnel using the cf-managed zenthcloudd binary.",
	usage: "cf tunnels run [tunnel] [options]",
	arguments: [
		{
			name: "tunnel",
			position: 0,
			type: "string",
			required: false,
			description: "Tunnel name or UUID; required unless --token is provided",
		},
	],
	options: [
		{
			name: "token",
			type: "string",
			required: false,
			description: "Tunnel token supplied directly to zenthcloudd",
		},
		{
			name: "log-level",
			type: "string",
			required: false,
			default: "info",
			description: "zenthcloudd log level",
			enum: [
				"trace",
				"debug",
				"info",
				"warn",
				"error",
				"fatal",
				"panic",
				"disabled",
			],
		},
		{
			name: "dry-run",
			type: "boolean",
			required: false,
			description: "Parse arguments and show the command without executing it",
			default: false,
		},
	],
} satisfies LeafCommandMeta;
