import { CtaBand, Section } from "@/components/site/Sections";
import { PageHeader } from "@/components/site/PageHeader";
import { pricingCategories } from "@/lib/content/pricing";
import { billingModelLabel } from "@/lib/domain/pricing";
import { getPlans, pageMetadata } from "@/lib/domain/queries";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
	title: "Pricing",
	description:
		"ZenthCloud pricing models: hourly, monthly, usage-based and custom contracts. Commercial prices are not published yet; every plan shows its current state.",
	path: "/pricing",
});

export default function PricingPage() {
	const plans = getPlans();
	const published = plans.filter((plan) => plan.status === "published").length;
	const billingModels = [...new Set(plans.map((plan) => billingModelLabel(plan)))];

	return (
		<>
			<PageHeader
				eyebrow="Pricing"
				title="Billing models first, numbers when they are approved"
				description="The pricing architecture supports hourly, monthly, usage-based and custom billing. No commercial price is published on this website yet, so no plan invents one."
				breadcrumbs={[{ name: "Pricing", path: "/pricing" }]}
				actions={
					<>
						<Link
							href="/contact-sales"
							className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
						>
							Request a quote
						</Link>
						<Link
							href="/products"
							className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-medium hover:bg-accent"
						>
							Browse products
						</Link>
					</>
				}
				aside={
					<div className="border border-warning/40 bg-warning/5 p-5">
						<h2 className="text-sm font-semibold">Publication state</h2>
						<dl className="mt-3 space-y-2 text-sm">
							<div className="flex justify-between gap-3">
								<dt className="text-muted-foreground">Modelled plans</dt>
								<dd className="font-medium">{plans.length}</dd>
							</div>
							<div className="flex justify-between gap-3">
								<dt className="text-muted-foreground">Published prices</dt>
								<dd className="font-medium">{published}</dd>
							</div>
						</dl>
						<p className="mt-3 border-t border-warning/30 pt-3 text-xs leading-relaxed text-muted-foreground">
							Draft plans are not offers. Prices are added only after commercial
							approval, and the page then shows the amount, currency and
							billing interval together.
						</p>
					</div>
				}
			/>

			<Section
				title="Pricing categories"
				description="Each category explains its billing model and lists the products it covers."
			>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{pricingCategories.map((category) => (
						<Link
							key={category.slug}
							href={`/pricing/${category.slug}`}
							className="flex h-full flex-col border border-border p-6 hover:bg-muted/50"
						>
							<h2 className="font-display text-xl tracking-tight">
								{category.title}
							</h2>
							<p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
								{category.description}
							</p>
							<span className="mt-5 text-sm font-medium text-primary">
								View plans →
							</span>
						</Link>
					))}
				</div>
			</Section>

			<Section
				title="How pricing is represented"
				description="The rules apply to every product page and every future pricing API."
			>
				<div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
					{[
						{
							title: "Minor units",
							body: "Amounts are stored as integer minor units, never floating point. Currency is part of the plan.",
						},
						{
							title: "Explicit interval",
							body: `Each plan declares its billing model. Supported models in the catalogue: ${billingModels.join(", ")}.`,
						},
						{
							title: "Conditions attached",
							body: "Billing conditions — retention, pro-rating, separate charges — belong to the plan, not to marketing copy.",
						},
						{
							title: "Draft is visible",
							body: "A draft plan is labelled as such in the interface. It cannot be mistaken for a purchasable offer.",
						},
					].map((item) => (
						<div key={item.title} className="bg-background p-5">
							<h3 className="text-sm font-semibold">{item.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
								{item.body}
							</p>
						</div>
					))}
				</div>
			</Section>

			<CtaBand
				title="Need a number now?"
				description="Sales can prepare a quote against a defined capacity and contract term. Quotes are not published on the website."
				primary={{ href: "/contact-sales", label: "Contact sales" }}
				secondary={{ href: "/pricing/enterprise", label: "Enterprise pricing" }}
			/>
		</>
	);
}
