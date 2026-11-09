import { getTelemetrySourceLabel } from "../../lib/telemetry/config.js";
import { theme } from "../../lib/ui/index.js";
import type { ResolvedTelemetry } from "../../lib/telemetry/config.js";

// TODO: Publish telemetry documentation on the official Zenthcloud docs site and update this URL.
export const TELEMETRY_DOCS_URL =
	"https://github.com/skygenesisenterprise/zenthcloud";

export function telemetryStatusLine({
	enabled,
	source,
}: ResolvedTelemetry): string {
	const label = enabled ? theme.success("Enabled") : theme.error("Disabled");
	const override = getTelemetrySourceLabel(source);
	return `Status: ${label}${override ? ` (set by ${override})` : ""}\n`;
}
