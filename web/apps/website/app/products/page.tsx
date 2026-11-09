import { AvailabilityLegend, ProductGrid } from "@/components/catalogue/CatalogueViews";
import { CtaBand, Section } from "@/components/site/Sections";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import {
	FAMILIES,
	FAMILY_ORDER,
	getAllProducts,
	getProductsByFamily,
	getProviders,
	getRegions,
	pageMetadata,
} from "@/lib/domain/queries";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
	title: "Products",
	description:
		"Compute, storage, networking, platform, web and security services from ZenthCloud, with commercial availability published per product and region.",
	path: "/products",
});

export default function ProductsPage() {
	const products = getAllProducts();
	const providers = getProviders();
	const regions = getRegions();

	return (
		<>
			<PageHeader
				eyebrow="Catalogue"
				title="Infrastructure products, grouped by the job they do"
				description="The catalogue is complete by design, but not every service is open for orders. Each product carries a commercial state and a per-region availability table, so the offer is legible before a sales conversation."
				breadcrumbs={[{ name: "Products", path: "/products" }]}
				actions={
					<>
						<Button asChild>
							<Link href="/contact-sales">Contact sales</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/pricing">See pricing state</Link>
						</Button>
					</>
				}
				aside={
					<div className="border border-border p-5">
						<h2 className="text-sm font-semibold">Catalogue at a glance</h2>
						<dl className="mt-3 space-y-2 text-sm">
							<div className="flex justify-between gap-3">
								<dt className="text-muted-foreground">Products</dt>
								<dd className="font-medium">{products.length}</dd>
							</div>
							<div className="flex justify-between gap-3">
								<dt className="text-muted-foreground">Families</dt>
								<dd className="font-medium">{FAMILY_ORDER.length}</dd>
							</div>
							<div className="flex justify-between gap-3">
								<dt className="text-muted-foreground">Infrastructure sources</dt>
								<dd className="font-medium">{providers.length}</dd>
							</div>
							<div className="flex justify-between gap-3">
								<dt className="text-muted-foreground">Modelled regions</dt>
								<dd className="font-medium">{regions.length}</dd>
							</div>
						</dl>
						<p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
							Region entries are pending verification. No city or facility
							address is claimed.
						</p>
					</div>
				}
			/>

			<Section title="Public Cloud" description="Elastic resources on shared infrastructure, ordered individually.">
				<ProductGrid
					products={products.filter((product) =>
						product.route.startsWith("/products/public-cloud/"),
					)}
				/>
				<div className="mt-4">
					<Button variant="outline" asChild>
						<Link href="/products/public-cloud">Public Cloud overview</Link>
					</Button>
				</div>
			</Section>

			{FAMILY_ORDER.filter((family) => family !== "compute" && family !== "storage").map(
				(family) => (
					<Section
						key={family}
						title={FAMILIES[family].name}
						description={FAMILIES[family].description}
					>
						<ProductGrid products={getProductsByFamily(family)} />
					</Section>
				),
			)}

			<Section
				title="How to read product availability"
				description="Commercial state, operational state and regional availability are separate. A product page shows all three."
			>
				<AvailabilityLegend />
			</Section>

			<CtaBand
				title="Need a scoped proposal?"
				description="Tell us the products, expected capacity and target region. Enterprise and private capacity are quoted individually."
				primary={{ href: "/contact-sales", label: "Contact sales" }}
				secondary={{ href: "/infrastructure", label: "Review the infrastructure" }}
			/>
		</>
	);
}
