import { PricingTable } from "@/components/catalogue/CatalogueViews";
import { CtaBand, Section } from "@/components/site/Sections";
import { PageHeader } from "@/components/site/PageHeader";
import { pricingBySlug, pricingCategories } from "@/lib/content/pricing";
import { getAllProducts, pageMetadata } from "@/lib/domain/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
	return pricingCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const category = pricingBySlug.get(slug);
	if (!category) return { title: "Pricing not found", robots: { index: false } };
	return pageMetadata({
		title: category.title,
		description: category.description,
		path: `/pricing/${category.slug}`,
	});
}

export default async function PricingCategoryPage({ params }: PageProps) {
	const { slug } = await params;
	const category = pricingBySlug.get(slug);
	if (!category) notFound();

	const products = getAllProducts().filter((product) => {
		if (category.productIds) return category.productIds.includes(product.id);
		return category.families.includes(product.family);
	});

	return (
		<>
			<PageHeader
				eyebrow="Pricing"
				title={category.title}
				description={category.description}
				breadcrumbs={[
					{ name: "Pricing", path: "/pricing" },
					{ name: category.title, path: `/pricing/${category.slug}` },
				]}
				actions={
					<Link
						href="/contact-sales"
						className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
					>
						Request a quote
					</Link>
				}
			/>

			<Section title="Billing model">
				<div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
					<p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
						{category.intro}
					</p>
					<div className="border border-border p-5">
						<h3 className="text-sm font-semibold">Conditions</h3>
						<ul className="mt-3 space-y-2 text-sm text-muted-foreground">
							{category.notes.map((note) => (
								<li key={note} className="flex gap-2">
									<span aria-hidden="true">—</span>
									{note}
								</li>
							))}
						</ul>
					</div>
				</div>
			</Section>

			{products.map((product) => (
				<Section
					key={product.id}
					title={product.name}
					description={product.tagline}
					actions={
						<Link
							href={product.route}
							className="text-sm font-medium text-primary underline-offset-4 hover:underline"
						>
							Product details
						</Link>
					}
				>
					<PricingTable product={product} />
				</Section>
			))}

			<CtaBand
				title="Prices are published when approved"
				description="The plans above show the billing model and conditions without inventing an amount. Contact sales for a quote against your capacity."
				primary={{ href: "/contact-sales", label: "Contact sales" }}
				secondary={{ href: "/pricing", label: "All pricing categories" }}
			/>
		</>
	);
}
