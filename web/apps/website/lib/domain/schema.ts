import { z } from "zod";

/**
 * Domain schema for the public commercial catalogue.
 *
 * Everything the website renders about products, providers, regions and
 * prices is validated here at module load. Commercial status, operational
 * status and regional availability are deliberately separate concepts:
 * a product can be sold while one region is still being prepared, and a
 * region can be operational without the product being commercially open.
 */

export const ProductFamily = z.enum([
	"compute",
	"storage",
	"networking",
	"platform",
	"web",
	"security",
]);
export type ProductFamily = z.infer<typeof ProductFamily>;

export const CommercialStatus = z.enum([
	"available",
	"coming_soon",
	"contact_sales",
	"partner_service",
]);
export type CommercialStatus = z.infer<typeof CommercialStatus>;

export const OperationalStatus = z.enum([
	"operational",
	"degraded",
	"maintenance",
	"unknown",
]);
export type OperationalStatus = z.infer<typeof OperationalStatus>;

export const DeploymentModel = z.enum([
	"shared",
	"dedicated",
	"managed",
	"self_service",
]);
export type DeploymentModel = z.infer<typeof DeploymentModel>;

export const ProviderType = z.enum(["own", "partner"]);
export type ProviderType = z.infer<typeof ProviderType>;

export const RegionVerification = z.enum(["verified", "pending"]);
export type RegionVerification = z.infer<typeof RegionVerification>;

export const BillingModel = z.enum(["hourly", "monthly", "usage", "custom"]);
export type BillingModel = z.infer<typeof BillingModel>;

export const BillingUnit = z.enum([
	"hour",
	"month",
	"request",
	"gb_month",
	"custom",
]);
export type BillingUnit = z.infer<typeof BillingUnit>;

export const PricingStatus = z.enum(["published", "draft"]);
export type PricingStatus = z.infer<typeof PricingStatus>;

const slug = z
	.string()
	.min(1)
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slugs are lowercase kebab-case");

export const ProviderSchema = z.object({
	id: slug,
	name: z.string().min(1),
	type: ProviderType,
	website: z.string().url().nullable(),
	description: z.string().min(1),
	regions: z.array(slug),
});
export type Provider = z.infer<typeof ProviderSchema>;

export const RegionSchema = z.object({
	id: slug,
	name: z.string().min(1),
	country: z.string().min(1),
	location: z.string().min(1),
	/** Only `verified` regions may be presented as live locations. */
	verification: RegionVerification,
	notes: z.string().min(1),
});
export type Region = z.infer<typeof RegionSchema>;

export const AvailabilitySchema = z.object({
	productId: slug,
	providerId: slug,
	regionId: slug,
	deployment: DeploymentModel,
	commercialStatus: CommercialStatus,
	operationalStatus: OperationalStatus,
	/** Short, factual caveat shown next to the status. */
	note: z.string().min(1),
});
export type Availability = z.infer<typeof AvailabilitySchema>;

export const SpecRowSchema = z.object({
	label: z.string().min(1),
	value: z.string().min(1),
});

export const SpecGroupSchema = z.object({
	title: z.string().min(1),
	rows: z.array(SpecRowSchema).min(1),
});
export type SpecGroup = z.infer<typeof SpecGroupSchema>;

export const ProductSchema = z.object({
	id: slug,
	/** Public route. Kept on the product so the data layer never hardcodes URLs. */
	route: z.string().startsWith("/products/"),
	name: z.string().min(1),
	family: ProductFamily,
	tagline: z.string().min(1),
	summary: z.string().min(1),
	description: z.string().min(1),
	benefits: z.array(z.string().min(1)).min(2),
	features: z.array(z.string().min(1)).min(2),
	/** Specification groups differ per product type; no shared flat layout. */
	specs: z.array(SpecGroupSchema).min(1),
	availability: z.array(AvailabilitySchema).min(1),
	/** Products referenced by slug; resolved through the query layer. */
	related: z.array(slug).default([]),
	docsPath: z.string().startsWith("/").nullable(),
	seo: z.object({
		title: z.string().min(1),
		description: z.string().min(1).max(200),
	}),
});
export type Product = z.infer<typeof ProductSchema>;

export const PricingPlanSchema = z.object({
	id: slug,
	productId: slug,
	name: z.string().min(1),
	billingModel: BillingModel,
	currency: z.literal("EUR"),
	/** Integer minor units (cents). Never a float. Null until approved. */
	amountMinor: z.number().int().nonnegative().nullable(),
	billingInterval: BillingUnit,
	unitLabel: z.string().min(1),
	conditions: z.array(z.string().min(1)).min(1),
	status: PricingStatus,
});
export type PricingPlan = z.infer<typeof PricingPlanSchema>;

export const CatalogueSchema = z
	.object({
		providers: z.array(ProviderSchema).min(1),
		regions: z.array(RegionSchema).min(1),
		products: z.array(ProductSchema).min(1),
		plans: z.array(PricingPlanSchema).min(1),
	})
	.superRefine((catalogue, ctx) => {
		const providerIds = new Set(catalogue.providers.map((p) => p.id));
		const regionIds = new Set(catalogue.regions.map((r) => r.id));
		const productIds = new Set(catalogue.products.map((p) => p.id));
		const routes = new Set<string>();
		const planIds = new Set<string>();

		for (const product of catalogue.products) {
			if (routes.has(product.route)) {
				ctx.addIssue({
					code: "custom",
					message: `Duplicate product route: ${product.route}`,
				});
			}
			routes.add(product.route);

			for (const entry of product.availability) {
				if (entry.productId !== product.id) {
					ctx.addIssue({
						code: "custom",
						message: `Availability on ${product.id} points at ${entry.productId}`,
					});
				}
				if (!providerIds.has(entry.providerId)) {
					ctx.addIssue({
						code: "custom",
						message: `Unknown provider ${entry.providerId} on ${product.id}`,
					});
				}
				if (!regionIds.has(entry.regionId)) {
					ctx.addIssue({
						code: "custom",
						message: `Unknown region ${entry.regionId} on ${product.id}`,
					});
				}
				// A region that has not been verified can never be presented as
				// commercially available.
				const region = catalogue.regions.find(
					(r) => r.id === entry.regionId,
				);
				if (
					region?.verification === "pending" &&
					entry.commercialStatus === "available"
				) {
					ctx.addIssue({
						code: "custom",
						message: `Unverified region ${region.id} cannot be marked available (${product.id})`,
					});
				}
			}

			for (const related of product.related) {
				if (!productIds.has(related)) {
					ctx.addIssue({
						code: "custom",
						message: `Unknown related product ${related} on ${product.id}`,
					});
				}
			}
		}

		for (const plan of catalogue.plans) {
			if (!productIds.has(plan.productId)) {
				ctx.addIssue({
					code: "custom",
					message: `Plan ${plan.id} references unknown product ${plan.productId}`,
				});
			}
			if (planIds.has(plan.id)) {
				ctx.addIssue({
					code: "custom",
					message: `Duplicate plan id: ${plan.id}`,
				});
			}
			planIds.add(plan.id);
			if (plan.status === "published" && plan.amountMinor === null) {
				ctx.addIssue({
					code: "custom",
					message: `Published plan ${plan.id} must have a price`,
				});
			}
		}
	});

export type Catalogue = z.infer<typeof CatalogueSchema>;
