import Script from "next/script";

/**
 * Loads the first-party guilderia Traffic Manager instrumentation.
 *
 * The whole instrumentation lives in the collector (`traffic.js`, served by the
 * guilderia instance), so this component only declares *which* property the site
 * is: `data-property-key` is the public key issued by the Traffic Manager for
 * this domain, and `data-endpoint` is the guilderia origin that receives the
 * events. Both come from the environment, so an instance without a Traffic
 * Manager configured simply renders nothing.
 *
 * See `apps/guilderia/public/traffic.js` for what is collected (page views, route
 * changes, explicit events) and what is not (no cookie, no user agent, no
 * fingerprint, no IP address).
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
