/**
 * Engine wiring for the Next.js host.
 *
 * The status platform (storage + services + HTTP application) is created
 * once per process and cached on `globalThis`, the same pattern the console
 * app uses for its database pool — dev servers and route handlers all share
 * one SQLite handle. The notification outbox worker is started alongside.
 */

import type { OutboxWorkerHandle } from "@zenthcloud/status";
import { createStatusPlatform, type StatusPlatform } from "@zenthcloud/status";

const globalForStatus = globalThis as unknown as {
	zenthcloudStatus?: StatusPlatform;
	zenthcloudStatusWorker?: OutboxWorkerHandle | null;
};

export const getPlatform = (): StatusPlatform => {
	if (!globalForStatus.zenthcloudStatus) {
		const platform = createStatusPlatform();
		globalForStatus.zenthcloudStatus = platform;
		if (platform.mode === "read-write") {
			globalForStatus.zenthcloudStatusWorker = platform.startWorkers();
		}
	}
	return globalForStatus.zenthcloudStatus;
};
