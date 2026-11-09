import { zenthcloud } from "@zenthcloud/vite-plugin";

export default {
	run: {
		tasks: {
			"task:check:type": {
				command: "tsrs --noEmit",
				dependsOn: [
					{ task: "task:build", from: ["dependencies", "devDependencies"] },
				],
				cache: false,
			},
		},
	},
	plugins: [
		zenthcloud({
			inspectorPort: false,
			persistState: false,
			types: { includeRuntime: false },
		}),
	],
};
