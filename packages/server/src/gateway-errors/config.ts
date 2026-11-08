export interface GatewayErrorPageConfig {
	brandName: string;
	docsUrl: string | null;
	statusUrl: string | null;
	supportUrl: string | null;
	locale: string;
	isCloud: boolean;
}

const MAX_BRAND_NAME_LENGTH = 64;
const MAX_URL_LENGTH = 2048;
const LOCALE_PATTERN = /^[a-z]{2}(?:-[A-Z]{2})?$/;

export const safeHttpUrl = (value: string | null | undefined): string | null => {
	if (!value) return null;
	const trimmed = value.trim();
	if (!trimmed || trimmed.length > MAX_URL_LENGTH) return null;
	try {
		const url = new URL(trimmed);
		if (url.protocol !== "http:" && url.protocol !== "https:") return null;
		if (url.username || url.password) return null;
		return url.toString();
	} catch {
		return null;
	}
};

const readString = (value: string | undefined): string | null => {
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
};

export const getGatewayErrorPageConfig = (
	env: Record<string, string | undefined> = process.env,
): GatewayErrorPageConfig => {
	const brandName =
		readString(env.GUILDERIA_GATEWAY_BRAND_NAME)?.slice(
			0,
			MAX_BRAND_NAME_LENGTH,
		) ?? "Guilderia";
	const locale = readString(env.GUILDERIA_GATEWAY_LOCALE);
	const isCloud =
		env.IS_CLOUD === "true" || env.GUILDERIA_PRODUCT === "cloud";

	return {
		brandName: brandName || "Guilderia",
		docsUrl: safeHttpUrl(env.GUILDERIA_GATEWAY_DOCS_URL),
		statusUrl: safeHttpUrl(env.GUILDERIA_GATEWAY_STATUS_URL),
		supportUrl: safeHttpUrl(env.GUILDERIA_GATEWAY_SUPPORT_URL),
		locale: locale && LOCALE_PATTERN.test(locale) ? locale : "en",
		isCloud,
	};
};
