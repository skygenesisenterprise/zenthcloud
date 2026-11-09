import { Link, LinkButton } from "@zenthcloud/react";
import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/Container";
import { StatusBadge } from "@/components/site/StatusBadge";
import { SectionIntro } from "./SectionIntro";
import { priceLabel, resolveProducts } from "./utils";
import {
	familiesSection,
	familyNotes,
	featuredProductIds,
	featuredSection,
	workloads,
	workloadsSection,
} from "@/lib/content/home";
import {
	FAMILIES,
	FAMILY_ORDER,
	getAggregateStatus,
	getProductsByFamily,
} from "@/lib/domain/queries";

/**
 * 01 — The ecosystem. Families are presented as editorial rows rather than a
 * card grid, so the breadth of the offer reads as one platform.
 */
export function FamiliesSection() {
	return (
		<section
			aria-labelledby="families-title"
			className="border-b border-border bg-background py-20 sm:py-28"
		>
			<Container>
				<div className="flex flex-col items-center gap-8">
					<SectionIntro id="families-title" {...familiesSection} align="center" />
					<LinkButton
						href="/products"
						variant="outline"
						className="self-center"
					>
						Browse the catalogue
						<ArrowRight className="size-4" aria-hidden="true" />
					</LinkButton>
				</div>

				<ul className="mx-auto mt-12 max-w-5xl border-t border-border">
					{FAMILY_ORDER.map((family, index) => {
						const meta = FAMILIES[family];
						const products = getProductsByFamily(family);
						const href = meta.route ?? "/products";

						return (
							<li key={family} className="border-b border-border">
								<div className="grid gap-5 py-7 md:grid-cols-[3rem_minmax(0,17rem)_minmax(0,1fr)_auto] md:items-start md:gap-8">
									<span className="font-mono text-xs text-muted-foreground">
										{String(index + 1).padStart(2, "0")}
									</span>
									<div>
										<h3 className="font-display text-xl tracking-tight text-foreground">
											<Link
												href={href}
												variant="plain"
												className="text-foreground no-underline hover:text-primary"
											>
												{meta.name}
											</Link>
										</h3>
										<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
											{familyNotes[family]}
										</p>
									</div>
									<ul className="flex flex-wrap gap-2">
										{products.map((product) => (
											<li key={product.id}>
												<Link
													href={product.route}
													variant="plain"
													className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground no-underline transition-colors hover:border-primary/40 hover:text-primary"
												>
													{product.name}
												</Link>
											</li>
										))}
									</ul>
									<Link
										href={href}
										variant="plain"
										className="inline-flex items-center gap-1.5 text-sm font-medium text-primary no-underline hover:underline"
									>
										Explore
										<ArrowRight className="size-3.5" aria-hidden="true" />
									</Link>
								</div>
							</li>
						);
					})}
				</ul>
			</Container>
		</section>
	);
}

/**
 * 02 — Featured products. One product is treated as an editorial lead with its
 * benefits, the rest are compact entries with their commercial state and price
 * publication state, all resolved from the catalogue.
 */
export function FeaturedProductsSection() {
	const [lead, ...rest] = resolveProducts(featuredProductIds);
	if (!lead) return null;

	return (
		<section
			aria-labelledby="featured-title"
			className="border-b border-border bg-background py-20 sm:py-28"
		>
			<Container>
				<SectionIntro id="featured-title" {...featuredSection} align="center" />

				<div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-2">
					<article className="rounded-2xl border border-border bg-muted p-7 sm:p-9">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
								{FAMILIES[lead.family].name}
							</p>
							<StatusBadge status={getAggregateStatus(lead)} />
						</div>

						<h3 className="mt-5 font-display text-3xl tracking-tight text-foreground">
							{lead.name}
						</h3>
						<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
							{lead.description}
						</p>

						<ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
							{lead.benefits.map((benefit) => (
								<li
									key={benefit}
									className="flex gap-2 text-sm leading-relaxed text-foreground"
								>
									<Check
										className="mt-0.5 size-4 shrink-0 text-primary"
										aria-hidden="true"
									/>
									{benefit}
								</li>
							))}
						</ul>

						<div className="mt-7 flex flex-wrap items-center gap-4 border-t border-border pt-5">
							<LinkButton href={lead.route} size="sm">
								View product
								<ArrowRight className="size-4" aria-hidden="true" />
							</LinkButton>
							<span className="text-xs text-muted-foreground">
								{priceLabel(lead)}
							</span>
						</div>
					</article>

					<ul className="divide-y divide-border border-y border-border">
						{rest.map((product) => (
							<li key={product.id} className="py-5">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<h3 className="font-display text-lg tracking-tight text-foreground">
										<Link
											href={product.route}
											variant="plain"
											className="text-foreground no-underline hover:text-primary"
										>
											{product.name}
										</Link>
									</h3>
									<StatusBadge status={getAggregateStatus(product)} />
								</div>
								<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
									{product.summary}
								</p>
								<p className="mt-2 text-xs text-muted-foreground">
									{priceLabel(product)}
								</p>
							</li>
						))}
					</ul>
				</div>
			</Container>
		</section>
	);
}

/** 03 — Workloads, each resolved to products that exist in the catalogue. */
export function WorkloadsSection() {
	return (
		<section
			aria-labelledby="workloads-title"
			className="border-b border-border bg-background py-20 sm:py-28"
		>
			<Container>
				<SectionIntro id="workloads-title" {...workloadsSection} align="center" />

				<div className="mx-auto mt-12 grid max-w-6xl gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
					{workloads.map((workload, index) => {
						const products = resolveProducts(workload.productIds);

						return (
							<article
								key={workload.id}
								className="flex flex-col bg-background p-7 sm:p-8"
							>
								<p className="font-mono text-xs text-muted-foreground">
									{String(index + 1).padStart(2, "0")}
								</p>
								<h3 className="mt-3 font-display text-2xl tracking-tight text-foreground">
									{workload.title}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
									{workload.description}
								</p>
								<p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
									{workload.uses.join(" · ")}
								</p>

								<ul className="mt-auto flex flex-wrap gap-2 border-t border-border pt-5">
									{products.map((product) => (
										<li key={product.id}>
											<Link
												href={product.route}
												variant="plain"
												className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground no-underline transition-colors hover:border-primary/40 hover:text-primary"
											>
												{product.name}
												<ArrowRight
													className="size-3"
													aria-hidden="true"
												/>
											</Link>
										</li>
									))}
								</ul>
							</article>
						);
					})}
				</div>
			</Container>
		</section>
	);
}
