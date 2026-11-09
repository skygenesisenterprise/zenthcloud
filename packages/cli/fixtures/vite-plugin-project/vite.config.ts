import { zenthcloud } from "@zenthcloud/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		zenthcloud({
			inspectorPort: false,
			persistState: false,
			types: { includeRuntime: false },
		}),
	],
});
