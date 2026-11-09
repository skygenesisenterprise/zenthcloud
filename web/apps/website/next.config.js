// Static export target for GitHub Pages. The Docker image keeps the default
// server output, so API routes (contact, OG image) stay available there while
// the Pages build is plain HTML.
const isStaticExport = process.env.NEXT_OUTPUT === "export";
const basePath = process.env.NEXT_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: isStaticExport ? "export" : undefined,
	basePath,
	trailingSlash: isStaticExport,
	...(isStaticExport
		? {}
		: {
				async redirects() {
					/**
					 * Retired routes from the previous (PaaS) information architecture.
					 * Every public URL keeps a destination in the new catalogue.
					 * Static exports cannot serve redirects; see docs/operations/deployment.md.
					 */
					return [
						{ source: "/self", destination: "/products", permanent: true },
						{ source: "/cloud", destination: "/products/public-cloud", permanent: true },
						{ source: "/platform", destination: "/products", permanent: true },
						{ source: "/capabilities", destination: "/products", permanent: true },
						{ source: "/use-cases", destination: "/solutions", permanent: true },
						{ source: "/enterprise", destination: "/solutions/enterprise", permanent: true },
						{ source: "/contact", destination: "/company/contact", permanent: true },
						{ source: "/partners", destination: "/company/partners", permanent: true },
						{ source: "/jobs", destination: "/company/careers", permanent: true },
						{ source: "/trust", destination: "/company/about", permanent: true },
						{ source: "/privacy", destination: "/legal/privacy", permanent: true },
						{ source: "/terms", destination: "/legal/terms", permanent: true },
						{ source: "/terms-of-service", destination: "/legal/terms", permanent: true },
						{ source: "/industries", destination: "/solutions", permanent: true },
						{ source: "/industries/:slug", destination: "/solutions/enterprise", permanent: true },
						{ source: "/features", destination: "/products", permanent: true },
						{ source: "/features/:slug", destination: "/products", permanent: true },
						{ source: "/comparison", destination: "/products", permanent: true },
						{ source: "/integrations", destination: "/resources/api", permanent: true },
						{ source: "/community", destination: "/company/contact", permanent: true },
						{ source: "/deploy-ai", destination: "/solutions/ai-research", permanent: true },
						{ source: "/sandbox-software", destination: "/solutions/developers", permanent: true },
						{ source: "/self-hosted-paas", destination: "/products", permanent: true },
						{ source: "/templates", destination: "/resources/tutorials", permanent: true },
						{ source: "/templates/:slug", destination: "/resources/tutorials", permanent: true },
						{ source: "/lp/deployment-platform", destination: "/products", permanent: true },
						{ source: "/dokploy-vs-:slug", destination: "/products", permanent: true },
					];
				},
			}),
	images: {
		...(isStaticExport ? { unoptimized: true } : {}),
	},
};

module.exports = nextConfig;
