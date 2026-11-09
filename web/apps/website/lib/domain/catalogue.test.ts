import { describe, expect, it } from "vitest";
import { catalogue } from "./catalogue";
import { CatalogueSchema } from "./schema";
import {
	getAggregateStatus,
	getAllProducts,
	getPlans,
	getProductByRoute,
	getProvider,
	getRegion,
} from "./queries";

describe("catalogue", () => {
	it("validates against the domain schema", () => {
		expect(() => CatalogueSchema.parse(catalogue)).not.toThrow();
	});

	it("exposes unique product routes and ids", () => {
		const routes = getAllProducts().map((product) => product.route);
		const ids = getAllProducts().map((product) => product.id);
		expect(new Set(routes).size).toBe(routes.length);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("resolves every availability reference", () => {
		for (const product of getAllProducts()) {
			for (const entry of product.availability) {
				expect(getProvider(entry.providerId), entry.providerId).toBeDefined();
				expect(getRegion(entry.regionId), entry.regionId).toBeDefined();
				expect(entry.productId).toBe(product.id);
			}
		}
	});

	it("never marks a product available in an unverified region", () => {
		for (const product of getAllProducts()) {
			for (const entry of product.availability) {
				const region = getRegion(entry.regionId);
				if (region?.verification === "pending") {
					expect(entry.commercialStatus).not.toBe("available");
				}
			}
		}
	});

	it("labels partner capacity as partner-delivered", () => {
		for (const product of getAllProducts()) {
			for (const entry of product.availability) {
				const provider = getProvider(entry.providerId);
				if (provider?.type === "partner") {
					expect(["partner_service", "contact_sales", "coming_soon"]).toContain(
						entry.commercialStatus,
					);
				}
			}
		}
	});

	it("does not publish a plan without an approved amount", () => {
		for (const plan of getPlans()) {
			if (plan.status === "published") {
				expect(plan.amountMinor).not.toBeNull();
			} else {
				expect(plan.amountMinor).toBeNull();
			}
			expect(Number.isInteger(plan.amountMinor ?? 0)).toBe(true);
		}
	});

	it("resolves products by public route and aggregates status by precedence", () => {
		const compute = getProductByRoute("/products/public-cloud/compute");
		expect(compute?.id).toBe("compute-instances");
		expect(compute && getAggregateStatus(compute)).toBe("partner_service");

		const bareMetal = getProductByRoute("/products/bare-metal");
		expect(bareMetal && getAggregateStatus(bareMetal)).toBe("partner_service");
	});
});
