import { UserError } from "@zenthcloud/workers-utils";
import type { ContainerlessConfig } from "@zenthcloud/deploy-helpers";

export const DEPENDENCIES_INSTRUMENTATION_ENV_VAR =
	"ZENTHCLOUD_DEPENDENCIES_INSTRUMENTATION";

export function applyDependenciesInstrumentationEnv(
	config: ContainerlessConfig
): ContainerlessConfig {
	const rawValue = process.env[DEPENDENCIES_INSTRUMENTATION_ENV_VAR];
	if (rawValue === undefined) {
		return config;
	}

	const value = rawValue.toLowerCase();
	if (value !== "true" && value !== "false") {
		throw new UserError(
			`Expected ${DEPENDENCIES_INSTRUMENTATION_ENV_VAR} to be "true" or "false", but got ${JSON.stringify(rawValue)}`,
			{ telemetryMessage: false }
		);
	}

	return {
		...config,
		dependencies_instrumentation: {
			...config.dependencies_instrumentation,
			enabled: value === "true",
		},
	};
}
