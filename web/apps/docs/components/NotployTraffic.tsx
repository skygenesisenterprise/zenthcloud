import Script from "next/script";

/**
 * Loads the first-party guilderia Traffic Manager instrumentation.
 *
 * Same collector script as the marketing site
 * (`apps/guilderia/public/traffic.js`), pointed at the docs property key. The docs
 * application is a Next.js App Router app, and the script tracks client-side
 * route changes itself (patched history APIs + `popstate`), so no
 * router-specific hook is needed here.
 *
 * Renders nothing when the Traffic Manager is not configured for this
 * environment.
 */
export const guilderiaTraffic = () => {
	const propertyKey = process.env.NEXT_PUBLIC_guilderia_TRAFFIC_KEY;
	const endpoint = process.env.NEXT_PUBLIC_guilderia_TRAFFIC_ENDPOINT;

	if (!propertyKey || !endpoint) {
		return null;
	}

	return (
		<Script
			id="guilderia-traffic"
			strategy="afterInteractive"
			src={`${endpoint.replace(/\/+$/, "")}/traffic.js`}
			data-property-key={propertyKey}
			data-endpoint={endpoint.replace(/\/+$/, "")}
		/>
	);
};
