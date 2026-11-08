/**
 * Every public destination used by the marketing site, in one place.
 *
 * Rules:
 * - Internal navigation targets are paths, so the static export keeps working.
 * - Cloud signup is NOT linked from marketing copy until the public onboarding
 *   endpoint is verified; `/cloud` is the canonical entry point.
 * - Documentation URLs live under docs.guilderia.com; `comparison` replaces the
 *   older `differences` slug, which is not part of the docs navigation anymore.
 */

export const SITE_URL = "https://guilderia.com";

export const links = {
	/** Existing customer sessions. Not a marketing call to action. */
	app: {
		signIn: "https://app.guilderia.com/",
	},
	docs: {
		home: "https://docs.guilderia.com/docs/core",
		install: "https://docs.guilderia.com/docs/core/installation",
		architecture: "https://docs.guilderia.com/docs/core/architecture",
		comparison: "https://docs.guilderia.com/docs/core/comparison",
		philosophy: "https://docs.guilderia.com/docs/core/philosophy",
		featureMatrix: "https://docs.guilderia.com/docs/core/feature-matrix",
		limitations: "https://docs.guilderia.com/docs/core/limitations",
		cloud: "https://docs.guilderia.com/docs/core/cloud",
		cloudOnboarding: "https://docs.guilderia.com/docs/core/cloud-onboarding",
		sso: "https://docs.guilderia.com/docs/core/sso",
		auditLogs: "https://docs.guilderia.com/docs/core/audit-logs",
		ai: "https://docs.guilderia.com/docs/core/ai",
		security: "https://docs.guilderia.com/docs/core/vulnerability-disclosure",
	},
	github: {
		repo: "https://github.com/skygenesisenterprise/guilderia",
		discussions: "https://github.com/skygenesisenterprise/guilderia/discussions",
		issues: "https://github.com/skygenesisenterprise/guilderia/issues",
		releases: "https://github.com/skygenesisenterprise/guilderia/releases",
	},
	community: {
		discord: "https://discord.gg/GUkDugVh34",
	},
	templates: "https://templates.guilderia.com",
	/** Verified reachable (HTTP 200) at the time of the redesign. */
	status: "https://status.guilderia.com",
	install: {
		linux: "curl -sSL https://guilderia.com/install.sh | sh",
		windows: "irm https://guilderia.com/install.ps1 | iex",
	},
} as const;
