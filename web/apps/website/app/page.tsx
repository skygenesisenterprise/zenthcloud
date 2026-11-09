import type { Metadata } from "next";
import { SignalHero } from "@/components/site/SignalHero";
import {
	FamiliesSection,
	FeaturedProductsSection,
	WorkloadsSection,
} from "@/components/site/home/OfferSections";
import {
	ArchitectureSection,
	DeploymentSection,
	DeveloperSection,
	FootprintSection,
} from "@/components/site/home/PlatformSections";
import {
	FaqSection,
	FinalCtaSection,
	ResourcesSection,
	SecuritySection,
	WhySection,
} from "@/components/site/home/TrustSections";
import { organisation } from "@/lib/content/site";
import {
	SITE_NAME,
	SITE_URL,
	getAllProducts,
	pageMetadata,
} from "@/lib/domain/queries";

export const metadata: Metadata = pageMetadata({
	title: "ZenthCloud — Enterprise cloud infrastructure",
	description:
		"Cloud infrastructure, networking, platform and security services on ZenthCloud-operated and partner infrastructure. Explore products, deployment models and availability published per region.",
	path: "/",
});

const products = getAllProducts();

const structuredData = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "Organization",
			name: SITE_NAME,
			legalName: organisation.legalName,
			url: SITE_URL,
			logo: `${SITE_URL}/icon.svg`,
			slogan: organisation.positioning,
			description: organisation.description,
		},
		{
			"@type": "WebSite",
			name: SITE_NAME,
			url: SITE_URL,
			inLanguage: "en",
			potentialAction: {
				"@type": "SearchAction",
				target: `${SITE_URL}/products?q={search_term_string}`,
				"query-input": "required name=search_term_string",
			},
		},
		{
			"@type": "ItemList",
			name: "ZenthCloud product catalogue",
			itemListElement: products.map((product, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: product.name,
				url: `${SITE_URL}${product.route}`,
			})),
		},
	],
};

/**
 * Homepage composition.
 *
 * The hero keeps the single saturated brand panel. Everything after it is
 * catalogue-driven: families, products, regions and commercial states come from
 * `lib/domain/queries`, while the editorial copy lives in `lib/content/home`.
 */
export default function HomePage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>

			<div className="bg-background text-foreground">
				<SignalHero />
				<FamiliesSection />
				<FeaturedProductsSection />
				<WorkloadsSection />
				<ArchitectureSection />
				<DeploymentSection />
				<DeveloperSection />
				<FootprintSection />
				<SecuritySection />
				<WhySection />
				<ResourcesSection />
				<FaqSection />
				<FinalCtaSection />
			</div>
		</>
	);
}
