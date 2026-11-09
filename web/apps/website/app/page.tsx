import { AvailabilityLegend, ProductGrid } from "@/components/catalogue/CatalogueViews";
import { CtaBand, Section } from "@/components/site/Sections";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";	import {
		homeFaqs,
		hybridPoints,
	trustPoints,
	valueProps,
	developerPoints,
} from "@/lib/content/home";
import { links, organisation } from "@/lib/content/site";
import {
	FAMILIES,
	FAMILY_ORDER,
	SITE_NAME,
	SITE_URL,
	getAllProducts,
	getProductsByFamily,
	getProviders,
	getRegions,
	pageMetadata,
} from "@/lib/domain/queries";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BoundaryGraphic } from "@/components/site/BoundaryGraphic";
import { Faq } from "@/components/site/Faq";
import { SignalHero } from "@/components/site/SignalHero";

export const metadata: Metadata = pageMetadata({
	title: "ZenthCloud — Cloud infrastructure. Without boundaries.",
	description:
		"Compute, storage, networking, managed services and hosting on owned and partner infrastructure. European roots, global ambitions, availability published per product and region.",
	path: "/",
});

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
	],
};

function TopologyDiagram() {
	return (
		<figure className="border border-border bg-muted/30 p-5">
			<svg
				viewBox="0 0 420 260"
				role="img"
				aria-labelledby="topology-title topology-desc"
				className="h-auto w-full"
			>
				<title id="topology-title">Conceptual hybrid infrastructure diagram</title>
				<desc id="topology-desc">
					Two infrastructure sources — owned and partner — feeding one
					catalogue, which exposes compute, storage and networking to the
					customer.
				</desc>
				<g fill="none" stroke="currentColor" strokeWidth="1" className="text-border">
					<path d="M92 62 H180" />
					<path d="M92 198 H180" />
					<path d="M252 130 H330" />
					<path d="M210 96 V164" />
				</g>
				<g className="fill-card" stroke="currentColor" strokeWidth="1">
					<rect x="12" y="40" width="80" height="44" rx="4" className="text-border" />
					<rect x="12" y="176" width="80" height="44" rx="4" className="text-border" />
					<rect x="180" y="82" width="72" height="96" rx="4" className="text-border" />
					<rect x="330" y="96" width="78" height="68" rx="4" className="text-border" />
				</g>
				<g className="fill-foreground text-[10px] font-medium">
					<text x="24" y="58">Owned</text>
					<text x="24" y="71" className="fill-muted-foreground text-[8px]">
						ZenthCloud
					</text>
					<text x="24" y="194">Partner</text>
					<text x="24" y="207" className="fill-muted-foreground text-[8px]">
						external operator
					</text>
					<text x="192" y="106">Catalogue</text>
					<text x="192" y="119" className="fill-muted-foreground text-[8px]">
						products ·
					</text>
					<text x="192" y="130" className="fill-muted-foreground text-[8px]">
						availability
					</text>
					<text x="192" y="141" className="fill-muted-foreground text-[8px]">
						pricing state
					</text>
					<text x="342" y="122">Your estate</text>
					<text x="342" y="135" className="fill-muted-foreground text-[8px]">
						compute · storage
					</text>
					<text x="342" y="146" className="fill-muted-foreground text-[8px]">
						network · services
					</text>
				</g>
			</svg>
			<figcaption className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
				Conceptual diagram. It does not depict a live facility, capacity or
				network topology; verified locations are listed in the infrastructure
				section.
			</figcaption>
		</figure>
	);
}

export default function HomePage() {
	const products = getAllProducts();
	const regions = getRegions();
	const providers = getProviders();

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>

			<div className="dark bg-background text-foreground">
				{/* Hero — official Signal panel visual */}
				<SignalHero />

				{/* Value proposition */}
				<Section
					headingSize="display"
					eyebrow="Why ZenthCloud"
				title="One provider, three commitments"
				description="The website is built to make the infrastructure model legible: what exists, who operates it, where it is available, and what it costs."
			>
				<div className="grid gap-px border border-border bg-border sm:grid-cols-3">
					{valueProps.map((value) => (
						<div key={value.title} className="bg-background p-6">
							<h3 className="font-display text-lg">{value.title}</h3>
							<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
								{value.description}
							</p>
						</div>
					))}
				</div>
			</Section>

			{/* Product families */}
			<Section
				id="catalogue"
				headingSize="display"
				eyebrow="Catalogue"
				title="Six product families"
				description="A complete taxonomy, with the commercial state of every product published per region. Products are introduced progressively; the catalogue makes that explicit."
				actions={
					<Button variant="outline" asChild>
						<Link href="/products">
							Browse all products
							<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
						</Link>
					</Button>
				}
			>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{FAMILY_ORDER.map((family) => {
						const entries = getProductsByFamily(family);
						return (
							<div key={family} className="border border-border p-6">
								<div className="flex items-baseline justify-between gap-3">
									<h3 className="font-display text-lg">{FAMILIES[family].name}</h3>
									<span className="text-xs text-muted-foreground">
										{entries.length} product{entries.length === 1 ? "" : "s"}
									</span>
								</div>
								<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
									{FAMILIES[family].description}
								</p>
								<ul className="mt-4 space-y-1.5">
									{entries.slice(0, 4).map((product) => (
										<li key={product.id}>
											<Link
												href={product.route}
												className="text-sm text-foreground underline-offset-4 hover:text-primary hover:underline"
											>
												{product.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						);
					})}
				</div>
				<div className="mt-8">
					<AvailabilityLegend />
				</div>
			</Section>

			{/* Hybrid model */}
			<Section
				headingSize="display"
				eyebrow="Hybrid infrastructure"
				title="Owned and partner capacity, never conflated"
				description="The commercial model covers both sources. The interface — and the data model — keeps them distinct."
			>
				<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
					<div className="space-y-6">
						{hybridPoints.map((point) => (
							<div key={point.title} className="border-l-2 border-primary/40 pl-4">
								<h3 className="font-display text-lg">{point.title}</h3>
								<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
									{point.description}
								</p>
							</div>
						))}
						<Link
							href="/infrastructure/partners"
							className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
						>
							How providers are disclosed
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</Link>
					</div>
					<div className="space-y-4">
						<div className="bg-ink p-5 text-ink-foreground">
							<BoundaryGraphic />
						</div>
						<div className="border border-border">
							<h3 className="border-b border-border bg-muted/50 px-5 py-3 text-sm font-semibold">
								Infrastructure sources in this catalogue
							</h3>
							<ul className="divide-y divide-border">
								{providers.map((provider) => (
									<li key={provider.id} className="px-5 py-4">
										<div className="flex items-center justify-between gap-3">
											<span className="text-sm font-medium text-foreground">
												{provider.name}
											</span>
											<span className="border border-border px-2 py-0.5 text-xs text-muted-foreground">
												{provider.type === "own" ? "Owned" : "Partner"}
											</span>
										</div>
										<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
											{provider.description}
										</p>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</Section>

			{/* Regional availability */}
			<Section
				eyebrow="Availability"
				title="Coverage stated honestly"
				description="A region is published with a verification state. Products can be commercially available in one region and not in another."
				actions={
					<Button variant="outline" asChild>
						<Link href="/infrastructure/locations">View locations</Link>
					</Button>
				}
			>
				<div className="grid gap-4 sm:grid-cols-2">
					{regions.map((region) => (
						<div key={region.id} className="border border-border p-6">
							<div className="flex items-center justify-between gap-3">
								<h3 className="font-display text-lg">{region.name}</h3>
								<span className="border border-warning/40 bg-warning/10 px-2 py-0.5 text-xs text-warning">
									{region.verification === "verified" ? "Verified" : "Pending verification"}
								</span>
							</div>
							<p className="mt-2 text-sm text-muted-foreground">
								{region.country} · {region.location}
							</p>
							<p className="mt-3 text-xs leading-relaxed text-muted-foreground">
								{region.notes}
							</p>
						</div>
					))}
				</div>
			</Section>

			{/* Developers */}
			<Section
				eyebrow="For developers"
				title="API-first, with the limits written down"
				description="No hidden orchestration layer. Resources are API objects, and every product page states its constraints."
			>
				<div className="grid gap-px border border-border bg-border sm:grid-cols-3">
					{developerPoints.map((point) => (
						<div key={point.title} className="flex flex-col bg-background p-6">
							<h3 className="font-display text-lg">{point.title}</h3>
							<p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
								{point.description}
							</p>
							<Link
								href={point.href}
								className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
							>
								{point.linkLabel}
								<ArrowRight className="h-4 w-4" aria-hidden="true" />
							</Link>
						</div>
					))}
				</div>
			</Section>

			{/* Trust */}
			<Section
				eyebrow="Transparency"
				title="What this website will not do"
				description="A cloud provider earns trust by stating the boundary of what it knows."
			>
				<div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
					<ul className="divide-y divide-border border-y border-border">
						{trustPoints.map((point) => (
							<li key={point} className="flex gap-3 py-4 text-sm text-muted-foreground">
								<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
								{point}
							</li>
						))}
					</ul>
					<div className="border border-border p-6">
						<h3 className="font-display text-lg">Pricing state</h3>
						<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
							Commercial prices are not published yet. Every plan in the
							catalogue is marked as a draft, and the interface shows “Price not
							published” rather than a placeholder figure.
						</p>
						<Link
							href="/pricing"
							className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
						>
							See the pricing model
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</Link>
					</div>
				</div>
			</Section>

			<Section
				eyebrow="Resources"
				title="Documentation, API and support"
				description="The technical ecosystem lives outside the marketing site so it can be versioned with the platform."
			>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{[
						{ label: "Documentation", href: links.docs.home, external: true, description: "Guides and operational limits" },
						{ label: "API reference", href: "/resources/api", external: false, description: "Endpoints and authentication" },
						{ label: "Service status", href: links.status, external: true, description: "Incidents and maintenance" },
						{ label: "Support", href: "/resources/support", external: false, description: "Routes and scope" },
					].map((item) => (
						<Link
							key={item.label}
							href={item.href}
							target={item.external ? "_blank" : undefined}
							rel={item.external ? "noreferrer" : undefined}
							className="group border border-border p-5 hover:bg-muted/50"
						>
							<span className="flex items-center justify-between text-sm font-medium text-foreground">
								{item.label}
								{item.external ? (
									<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
								) : (
									<ArrowRight className="h-4 w-4" aria-hidden="true" />
								)}
							</span>
							<span className="mt-1 block text-xs text-muted-foreground">{item.description}</span>
						</Link>
					))}
				</div>
			</Section>

			<Section
				id="home-faq"
				title="Questions before you start"
				description="What the catalogue means, and what it deliberately does not claim."
			>
				<Faq id="home-faq" items={homeFaqs} />
			</Section>

				<CtaBand
					title="Start from the catalogue, not a sales call"
					description="Browse products, availability and pricing state first. When you need a scoped proposal, the sales team takes it from there."
					primary={{ href: "/products", label: "Explore products" }}
					secondary={{ href: "/contact-sales", label: "Contact sales" }}
				/>
			</div>
		</>
	);
}
