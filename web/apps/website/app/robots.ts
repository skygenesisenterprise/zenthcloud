import type { MetadataRoute } from "next";

// Required for `output: "export"` (GitHub Pages).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: ["https://guilderia.com/sitemap.xml", "https://guilderia.com/llms.txt"],
	};
}
