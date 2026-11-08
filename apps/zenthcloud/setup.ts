import { exec } from "node:child_process";
import { exit } from "node:process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

import { setupDirectories } from "@zenthcloud/server/setup/config-paths";
import { initializePostgres } from "@zenthcloud/server/setup/postgres-setup";
import {
	initializeNetwork,
	initializeSwarm,
} from "@zenthcloud/server/setup/setup";
import {
	createDefaultMiddlewares,
	createDefaultServerTraefikConfig,
	createDefaultTraefikConfig,
	initializeStandaloneTraefik,
	TRAEFIK_VERSION,
} from "@zenthcloud/server/setup/traefik-setup";

(async () => {
	try {
		setupDirectories();
		createDefaultMiddlewares();
		await initializeSwarm();
		await initializeNetwork();
		createDefaultTraefikConfig();
		createDefaultServerTraefikConfig();
		await execAsync(`docker pull traefik:v${TRAEFIK_VERSION}`);
		await initializeStandaloneTraefik();
		await initializePostgres();
		console.log("Zenthcloud setup completed");
		exit(0);
	} catch (e) {
		console.error("Error in zenthcloud setup", e);
	}
})();
