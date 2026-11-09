import {
	getPlansForProduct,
	getProductById,
} from "@/lib/domain/queries";
import type { Product } from "@/lib/domain/schema";

/** Resolve catalogue product ids, dropping any id the catalogue no longer has. */
export function resolveProducts(ids: readonly string[]): Product[] {
	return ids
		.map((id) => getProductById(id))
		.filter((product): product is Product => Boolean(product));
}

/**
 * Pricing state for a product, expressed from its plans rather than hardcoded.
 * Every plan is currently a draft, so this returns "Price not published".
 */
export function priceLabel(product: Product): string {
	const published = getPlansForProduct(product.id).filter(
		(plan) => plan.status === "published" && plan.amountMinor !== null,
	);

	if (published.length === 0) return "Price not published";

	const cheapest = published.reduce((lowest, plan) =>
		(plan.amountMinor ?? 0) < (lowest.amountMinor ?? 0) ? plan : lowest,
	);

	return `From ${((cheapest.amountMinor ?? 0) / 100).toFixed(2)} ${cheapest.currency} / ${cheapest.unitLabel}`;
}
