import {
	AvailabilityTable,
	PricingTable,
	RelatedProducts,
	SpecGroups,
} from "@/components/catalogue/CatalogueViews";
import { CtaBand, Section } from "@/components/site/Sections";
import { PageHeader } from "@/components/site/PageHeader";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Button } from "@/components/ui/button";
import { getAggregateStatus } from "@/lib/domain/queries";
import {
	FAMILIES,
	getProductByRoute,
	getRelatedProducts,
	getUniformStatus,
	pageMetadata,
} from "@/lib/domain/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, SITE_URL } from "@/lib/domain/queries";

type PageProps = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
	return getAllProducts().map((product) => ({
		slug: product.route.replace("/products/", "").split("/"),
	}));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const product = getProductByRoute(`/products/${slug.join("/")}`);
	if (!product) {
		return { title: "Product not found", robots: { index: false } };
	}
	return pageMetadata({
		title: product.seo.title,
		description: product.seo.description,
		path: product.route,
	});
}

export default async function ProductPage({ params }: PageProps) {
	const { slug } = await params;
	const product = getProductByRoute(`/products/${slug.join("/")}`);
	if (!product) notFound();

	const isPublicCloud = product.route.startsWith("/products/public-cloud/");
	const aggregate = getAggregateStatus(product);
	const uniform = getUniformStatus(product);
	const related = getRelatedProducts(product);

	const breadcrumbs = [
		{ name: "Products", path: "/products" },
		...(isPublicCloud
			? [{ name: "Public Cloud", path: "/products/public-cloud" }]
			: []),
		{ name: product.name, path: product.route },
	];

	const serviceSchema = {
		"@context": "https://schema.org",
		"@type": "Service",
		name: product.name,
		description: product.summary,
		serviceType: FAMILIES[product.family].name,
		url: `${SITE_URL}${product.route}`,
		provider: {
			"@type": "Organization",
			name: "ZenthCloud",
			url: SITE_URL,
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
			/>

			<PageHeader
				eyebrow={FAMILIES[product.family].name}
				title={product.name}
				description={product.summary}
				breadcrumbs={breadcrumbs}
				actions={
					<>
						<Button asChild>
							<Link href="/contact-sales">Discuss this product</Link>
						</Button>
						{product.docsPath && (
							<Button variant="outline" asChild>
								<Link href={product.docsPath}>Documentation</Link>
							</Button>
						)}
					</>
				}
				aside={
					<div className="border border-border p-5">
						<StatusBadge status={aggregate} showDescription />
						<dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
							<div className="flex justify-between gap-3">
								<dt className="text-muted-foreground">Family</dt>
								<dd className="font-medium">{FAMILIES[product.family].name}</dd>
							</div>
							<div className="flex justify-between gap-3">
								<dt className="text-muted-foreground">Regions modelled</dt>
								<dd className="font-medium">{product.availability.length}</dd>
							</div>
							{uniform && (
								<div className="flex justify-between gap-3">
									<dt className="text-muted-foreground">State</dt>
									<dd className="font-medium">Uniform across regions</dd>
								</div>
							)}
						</dl>
					</div>
				}
			/>

			<Section title="Overview">
				<div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
					<div className="space-y-4 text-base leading-relaxed text-muted-foreground">
						<p>{product.description}</p>
					</div>
					<div>
						<h3 className="text-sm font-semibold">Main benefits</h3>
						<ul className="mt-3 space-y-3">
							{product.benefits.map((benefit) => (
								<li key={benefit} className="flex gap-3 text-sm text-muted-foreground">
									<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
									{benefit}
								</li>
							))}
						</ul>
					</div>
				</div>
			</Section>

			<Section title="Capabilities">
				<ul className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
					{product.features.map((feature) => (
						<li key={feature} className="bg-background p-4 text-sm text-muted-foreground">
							{feature}
						</li>
					))}
				</ul>
			</Section>

			<Section
				title="Technical specifications"
				description="Specification groups differ by product type; this layout is not shared with an unrelated product."
			>
				<SpecGroups product={product} />
			</Section>

			<Section
				id="availability"
				title="Availability"
				description="Commercial availability, operational state and region are separate fields. The note explains what is not yet published."
				actions={
					<Button variant="outline" asChild>
						<Link href="/infrastructure/locations">Location details</Link>
					</Button>
				}
			>
				<AvailabilityTable product={product} />
			</Section>

			<Section
				id="pricing"
				title="Pricing"
				description="Plans below are modelled with their billing model and conditions. Prices are not published until approved."
			>
				<PricingTable product={product} />
				<div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
					<Link href="/pricing" className="text-primary underline-offset-4 hover:underline">
						Pricing overview
					</Link>
					<Link href="/contact-sales" className="text-muted-foreground underline-offset-4 hover:underline hover:text-foreground">
						Request a quote
					</Link>
				</div>
			</Section>

			{related.length > 0 && (
				<Section title="Related services" description="Services commonly used with this product.">
					<RelatedProducts product={product} />
				</Section>
			)}

			<CtaBand
				title={`Discuss ${product.name}`}
				description="Sales can confirm capacity, the operating provider and any contractual terms. No capacity is reserved until a contract is signed."
				primary={{ href: "/contact-sales", label: "Contact sales" }}
				secondary={{ href: "/products", label: "Browse products" }}
			/>
		</>
	);
}
