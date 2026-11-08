/**
 * Every public destination used by the marketing site, in one place.
 *
 * Rules:
 * - Internal navigation targets are paths, so the static export keeps working.
 * - Cloud signup is NOT linked from marketing copy until the public onboarding
 *   endpoint is verified; `/cloud` is the canonical entry point.
 * - Documentation URLs live under docs.zenthcloud.com; `comparison` replaces the
 *   older `differences` slug, which is not part of the docs navigation anymore.
 */

export const SITE_URL = "https://zenthcloud.com";

export const links = {
	/** Existing customer sessions. Not a marketing call to action. */
	app: {
		signIn: "https://app.zenthcloud.com/",
	},
	docs: {
		home: "https://docs.zenthcloud.com/docs/core",
		install: "https://docs.zenthcloud.com/docs/core/installation",
		architecture: "https://docs.zenthcloud.com/docs/core/architecture",
		comparison: "https://docs.zenthcloud.com/docs/core/comparison",
		philosophy: "https://docs.zenthcloud.com/docs/core/philosophy",
		featureMatrix: "https://docs.zenthcloud.com/docs/core/feature-matrix",
		limitations: "https://docs.zenthcloud.com/docs/core/limitations",
		cloud: "https://docs.zenthcloud.com/docs/core/cloud",
		cloudOnboarding: "https://docs.zenthcloud.com/docs/core/cloud-onboarding",
		sso: "https://docs.zenthcloud.com/docs/core/sso",
		auditLogs: "https://docs.zenthcloud.com/docs/core/audit-logs",
		ai: "https://docs.zenthcloud.com/docs/core/ai",
		security: "https://docs.zenthcloud.com/docs/core/vulnerability-disclosure",
	},
	github: {
		repo: "https://github.com/skygenesisenterprise/zenthcloud",
		discussions: "https://github.com/skygenesisenterprise/zenthcloud/discussions",
		issues: "https://github.com/skygenesisenterprise/zenthcloud/issues",
		releases: "https://github.com/skygenesisenterprise/zenthcloud/releases",
	},
	community: {
		discord: "https://discord.gg/GUkDugVh34",
	},
	templates: "https://templates.zenthcloud.com",
	/** Verified reachable (HTTP 200) at the time of the redesign. */
	status: "https://status.zenthcloud.com",
	install: {
		linux: "curl -sSL https://zenthcloud.com/install.sh | sh",
		windows: "irm https://zenthcloud.com/install.ps1 | iex",
	},
} as const;
