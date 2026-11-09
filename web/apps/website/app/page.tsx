import { Link, LinkButton } from "@zenthcloud/react";
import {
	ArrowRight,
	ArrowUpRight,
	Boxes,
	Database,
	Globe2,
	Network,
	Server,
	ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BoundaryGraphic } from "@/components/site/BoundaryGraphic";
import { Container } from "@/components/Container";
import { Faq } from "@/components/site/Faq";
import { SignalHero } from "@/components/site/SignalHero";
import {
	availabilitySection,
	catalogueSection,
	catalogueStats,
	developerPoints,
	homeFaqs,
	homeFinalCta,
	hybridPoints,
	platformModel,
	platformPillars,
	resourcesSection,
	trustPoints,
	whyPoints,
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
import type { ProductFamily } from "@/lib/domain/schema";

export const metadata: Metadata = pageMetadata({
	title: "ZenthCloud — Cloud infrastructure. Without boundaries.",
	description:
		"Compute, storage, networking, managed services and hosting on owned and partner infrastructure. One catalogue, availability and commercial state published per product and region.",
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

const FAMILY_ICONS: Record<ProductFamily, LucideIcon> = {
	compute: Server,
	storage: Database,
	networking: Network,
	platform: Boxes,
	web: Globe2,
	security: ShieldCheck,
};

const RESOURCE_LINKS = [
	{
		label: "Documentation",
		href: links.docs.home,
		external: true,
		description: "Guides and operational limits",
	},
	{
		label: "API reference",
		href: "/resources/api",
		external: false,
		description: "Endpoints and authentication",
	},
	{
		label: "Service status",
		href: links.status,
		external: true,
		description: "Incidents and maintenance",
	},
	{
		label: "Support",
		href: "/resources/support",
		external: false,
		description: "Routes and scope",
	},
] as const;

/** Shared surfaces: the whole homepage lives on the dark stage. */
const CARD = "rounded-xl border border-border bg-card";
const EYEBROW =
	"text-xs font-semibold uppercase tracking-[0.18em] text-primary";
const LINK_ACCENT =
	"inline-flex items-center gap-1.5 text-sm font-medium text-primary no-underline hover:text-foreground hover:underline";

function CenteredIntro({
	eyebrow,
	title,
	description,
	id,
}: {
	eyebrow: string;
	title: string;
	description: string;
	id: string;
}) {
	return (
		<div className="mx-auto max-w-4xl text-center">
			<p className={EYEBROW}>{eyebrow}</p>
			<h2
				id={id}
				className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
			>
				{title}
			</h2>
			<p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
				{description}
			</p>
		</div>
	);
}

function Stat({ value, label, detail }: { value: string; label: string; detail: string }) {
	return (
		<div>
			<p className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
				{value}
			</p>
			<p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80">
				{label}
			</p>
			<p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
		</div>
	);
}

function Pillar({
	verb,
	title,
	description,
	href,
	linkLabel,
	families,
}: {
	verb: string;
	title: string;
	description: string;
	href: string;
	linkLabel: string;
	families: readonly ProductFamily[];
}) {
	const products = families.flatMap((family) => getProductsByFamily(family)).slice(0, 3);

	return (
		<article className="flex flex-col bg-background p-7 sm:p-8">
			<p className={EYEBROW}>{verb}</p>
			<h3 className="mt-4 font-display text-xl tracking-tight text-foreground">
				{title}
			</h3>
			<p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>

			<ul className="mt-6 space-y-2 border-t border-border pt-5">
				{products.map((product) => (
					<li key={product.id}>
						<Link
							href={product.route}
							className="flex items-center justify-between gap-3 text-sm text-foreground/80 no-underline transition-colors hover:text-foreground"
						>
							{product.name}
							<ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
						</Link>
					</li>
				))}
			</ul>

			<Link href={href} className={`mt-6 ${LINK_ACCENT}`}>
				{linkLabel}
				<ArrowRight className="size-4" aria-hidden="true" />
			</Link>
		</article>
	);
}

function FamilyCard({ family }: { family: ProductFamily }) {
	const meta = FAMILIES[family];
	const Icon = FAMILY_ICONS[family];
	const products = getProductsByFamily(family);

	return (
		<Link
			href={meta.route ?? "/products"}
			className="group flex min-h-64 flex-col rounded-xl border border-border bg-background p-6 no-underline transition-colors hover:border-[var(--color-zenth-blue-400)]/40"
		>
			<div className="flex items-start justify-between gap-4">
				<span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
					<Icon className="size-5" aria-hidden="true" />
				</span>
				<span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
					{products.length} product{products.length === 1 ? "" : "s"}
				</span>
			</div>
			<h3 className="mt-6 font-display text-xl tracking-tight text-foreground group-hover:text-primary">
				{meta.name}
			</h3>
			<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
				{meta.description}
			</p>

			<ul className="mt-5 flex-1 space-y-1.5 border-t border-border pt-4">
				{products.slice(0, 3).map((product) => (
					<li key={product.id} className="text-sm text-muted-foreground">
						{product.name}
					</li>
				))}
			</ul>

			<span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
				Explore {meta.name.split(" ")[0].toLowerCase()}
				<ArrowUpRight className="size-4" aria-hidden="true" />
			</span>
		</Link>
	);
}

function Row({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<div className="grid gap-2 py-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-6">
			<h3 className="text-sm font-semibold text-foreground">{title}</h3>
			<div>{children}</div>
		</div>
	);
}

export default function HomePage() {
	const regions = getRegions();
	const products = getAllProducts();
	const providers = getProviders();

	const stats: Record<(typeof catalogueStats)[number]["id"], string> = {
		families: String(FAMILY_ORDER.length),
		products: String(products.length),
		regions: String(regions.length),
		providers: String(providers.length),
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>

			<div className="bg-background text-foreground">
				<SignalHero />

				<section
					aria-labelledby="model-title"
					className="relative overflow-hidden bg-background pb-20 pt-14 sm:pb-28 sm:pt-20"
				>
					<Container
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-0 top-0 hidden h-full lg:block"
					>
						<div className="grid h-full grid-cols-3 border-r border-border/70">
							<div className="border-l border-border/70" />
							<div className="border-l border-border/70" />
							<div className="border-l border-border/70" />
						</div>
					</Container>
					<Container className="relative">
						<CenteredIntro
							id="model-title"
							eyebrow={platformModel.eyebrow}
							title={platformModel.title}
							description={platformModel.description}
						/>

						<div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
							{platformPillars.map((pillar) => (
								<Pillar key={pillar.verb} {...pillar} />
							))}
						</div>

						<div className="mt-12 grid grid-cols-2 gap-8 border-t border-border pt-10 sm:grid-cols-4">
							{catalogueStats.map((stat) => (
								<Stat
									key={stat.id}
									value={stats[stat.id]}
									label={stat.label}
									detail={stat.detail}
								/>
							))}
						</div>
					</Container>
				</section>

				<section
					aria-labelledby="commitments-title"
					className="border-b border-border bg-background py-20 sm:py-28"
				>
					<Container>
						<CenteredIntro
							id="commitments-title"
							eyebrow="Why ZenthCloud"
							title="Everything needed to read the infrastructure"
							description="A catalogue should make the operating model legible: what exists, who operates it, where it is available, and what it costs. These three commitments describe how the website is built."
						/>

						<div className="mt-14 grid gap-5 md:grid-cols-3">
							{whyPoints.map((point, index) => (
								<article
									key={point.title}
									className={`${CARD} p-7 transition-colors hover:border-[var(--color-zenth-blue-400)]/30`}
								>
									<p className="text-xs font-semibold tracking-[0.16em] text-primary">
										{String(index + 1).padStart(2, "0")}
									</p>
									<h3 className="mt-4 font-display text-xl tracking-tight text-foreground">
										{point.title}
									</h3>
									<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
										{point.description}
									</p>
								</article>
							))}
						</div>

						<div className="mt-10 flex justify-center">
							<LinkButton href="/infrastructure" variant="outline">
								Read the operating model
								<ArrowRight className="size-4" aria-hidden="true" />
							</LinkButton>
						</div>
					</Container>
				</section>

				<section
					id="catalogue"
					aria-labelledby="catalogue-title"
					className="border-b border-border bg-background py-20 sm:py-28"
				>
					<Container>
						<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
							<div className="max-w-3xl">
								<p className={EYEBROW}>{catalogueSection.eyebrow}</p>
								<h2
									id="catalogue-title"
									className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl"
								>
									{catalogueSection.title}
								</h2>
								<p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
									{catalogueSection.description}
								</p>
							</div>
							<LinkButton
								href="/products"
								variant="outline"
								className="self-start"
							>
								Browse all products
								<ArrowRight className="size-4" aria-hidden="true" />
							</LinkButton>
						</div>

						<div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{FAMILY_ORDER.map((family) => (
								<FamilyCard key={family} family={family} />
							))}
						</div>

						<p className="mt-8 text-sm leading-relaxed text-muted-foreground">
							{catalogueSection.note}
						</p>
					</Container>
				</section>

				<section aria-labelledby="hybrid-title" className="bg-background py-20 sm:py-28">
					<Container>
						<div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
							<div>
								<p className={EYEBROW}>Hybrid infrastructure</p>
								<h2
									id="hybrid-title"
									className="mt-3 max-w-xl font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl"
								>
									Owned and partner capacity, never conflated
								</h2>
								<p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
									The commercial model covers both sources. The interface — and
									the data model — keeps them distinct.
								</p>

								<div className="mt-10 space-y-7">
									{hybridPoints.map((point) => (
										<div key={point.title} className="border-l border-border pl-5">
											<h3 className="font-display text-lg text-foreground">
												{point.title}
											</h3>
											<p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
												{point.description}
											</p>
										</div>
									))}
								</div>

								<Link href="/infrastructure/partners" className={`mt-9 ${LINK_ACCENT}`}>
									How providers are disclosed
									<ArrowRight className="size-4" aria-hidden="true" />
								</Link>
							</div>

							<div className="rounded-2xl border border-border bg-background p-5 sm:p-7">
								<BoundaryGraphic />
							</div>
						</div>
					</Container>
				</section>

				<section
					aria-labelledby="developers-title"
					className="border-b border-border bg-background py-20 sm:py-28"
				>
					<Container>
						<div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-20">
							<div>
								<p className={EYEBROW}>For developers</p>
								<h2
									id="developers-title"
									className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl"
								>
									API-first, with the limits written down
								</h2>
								<p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
									No hidden orchestration layer. Resources are API objects, and
									every product page states its constraints.
								</p>

								<div className="mt-10 divide-y divide-border border-y border-border">
									{developerPoints.map((point) => (
										<Row key={point.title} title={point.title}>
											<p className="text-sm leading-relaxed text-muted-foreground">
												{point.description}
											</p>
											<Link href={point.href} className={`mt-2 ${LINK_ACCENT}`}>
												{point.linkLabel}
												<ArrowRight className="size-3.5" aria-hidden="true" />
											</Link>
										</Row>
									))}
								</div>
							</div>

							<div className="overflow-hidden rounded-2xl border border-border bg-background">
								<div className="flex items-center justify-between border-b border-border px-5 py-3">
									<span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
										<span className="size-2 rounded-full bg-primary" />
										Catalogue object
									</span>
									<span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
										Illustrative
									</span>
								</div>
								<pre
									aria-label="Illustrative catalogue object"
									className="overflow-x-auto p-5 text-xs leading-relaxed text-foreground/80 sm:p-7 sm:text-sm"
								>
									<code>{`{
  "product": "product-id",
  "region": "region-id",
  "commercialStatus": "contact_sales",
  "operationalStatus": "unknown",
  "price": null
}`}</code>
								</pre>
								<div className="border-t border-border px-5 py-4 text-xs leading-relaxed text-muted-foreground">
									The catalogue schema keeps commercial state, operational
									state and price publication separate.
								</div>
							</div>
						</div>
					</Container>
				</section>

				<section
					aria-labelledby="availability-title"
					className="border-b border-border bg-background py-20 sm:py-28"
				>
					<Container>
						<div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
							<div>
								<p className={EYEBROW}>{availabilitySection.eyebrow}</p>
								<h2
									id="availability-title"
									className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl"
								>
									{availabilitySection.title}
								</h2>
								<p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
									{availabilitySection.description}
								</p>

								<div className="mt-9 grid gap-4 sm:grid-cols-2">
									{regions.map((region) => (
										<div key={region.id} className={`${CARD} p-5`}>
											<div className="flex items-start justify-between gap-3">
												<h3 className="font-display text-lg text-foreground">
													{region.name}
												</h3>
												<span
													className={
														region.verification === "verified"
															? "rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary"
															: "rounded-full bg-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
													}
												>
													{region.verification === "verified"
														? "Verified"
														: "Pending verification"}
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

								<Link href="/infrastructure/locations" className={`mt-6 ${LINK_ACCENT}`}>
									View all locations
									<ArrowRight className="size-4" aria-hidden="true" />
								</Link>
							</div>

							<div className={`${CARD} p-6 sm:p-8`}>
								<p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
									Transparency
								</p>
								<h3 className="mt-3 font-display text-2xl tracking-tight text-foreground">
									What this website will not do
								</h3>
								<ul className="mt-6 space-y-4">
									{trustPoints.map((point) => (
										<li
											key={point}
											className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
										>
											<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
											{point}
										</li>
									))}
								</ul>
								<div className="mt-8 border-t border-border pt-5">
									<h4 className="text-sm font-semibold text-foreground">
										Pricing state
									</h4>
									<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
										Commercial prices are not published yet. Every plan is
										marked as a draft, and the interface shows “Price not
										published” rather than a placeholder figure.
									</p>
									<Link href="/pricing" className={`mt-3 ${LINK_ACCENT}`}>
										See the pricing model
										<ArrowRight className="size-4" aria-hidden="true" />
									</Link>
								</div>
							</div>
						</div>
					</Container>
				</section>

				<section
					aria-labelledby="resources-title"
					className="border-b border-border bg-background py-20 sm:py-28"
				>
					<Container>
						<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
							<div>
								<p className={EYEBROW}>{resourcesSection.eyebrow}</p>
								<h2
									id="resources-title"
									className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl"
								>
									{resourcesSection.title}
								</h2>
							</div>
							<p className="max-w-md text-sm leading-relaxed text-muted-foreground lg:text-right">
								{resourcesSection.description}
							</p>
						</div>

						<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{RESOURCE_LINKS.map((item) => (
								<Link
									key={item.label}
									href={item.href}
									target={item.external ? "_blank" : undefined}
									rel={item.external ? "noreferrer" : undefined}
									className="group rounded-xl border border-border bg-background p-5 no-underline transition-colors hover:border-[var(--color-zenth-blue-400)]/40"
								>
									<span className="flex items-center justify-between gap-3 text-sm font-semibold text-foreground">
										{item.label}
										{item.external ? (
											<ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
										) : (
											<ArrowRight className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
										)}
									</span>
									<span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
										{item.description}
									</span>
								</Link>
							))}
						</div>
					</Container>
				</section>

				<section
					id="home-faq"
					aria-labelledby="faq-title"
					className="border-b border-border bg-background py-20 sm:py-28"
				>
					<Container>
						<CenteredIntro
							id="faq-title"
							eyebrow="Questions"
							title="Questions before you start"
							description="What the catalogue means, and what it deliberately does not claim."
						/>
						<div className="mt-12">
							<Faq id="home-faq" items={homeFaqs} />
						</div>
					</Container>
				</section>

				<section aria-labelledby="start-title" className="bg-background py-20 sm:py-28">
					<Container>
						<div className="relative overflow-hidden rounded-2xl bg-brand px-6 py-16 text-center text-brand-foreground sm:px-12 sm:py-20">
							<div
								className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_85%_at_50%_45%,transparent_38%,rgba(0,0,0,0.32))]"
								aria-hidden="true"
							/>
							<div className="signal-dots absolute inset-0" aria-hidden="true" />
							<div className="relative mx-auto max-w-3xl">
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-foreground/70">
									{homeFinalCta.eyebrow}
								</p>
								<h2
									id="start-title"
									className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-brand-foreground sm:text-5xl"
								>
									{homeFinalCta.title}
								</h2>
								<p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-brand-foreground/80">
									{homeFinalCta.description}
								</p>
								<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
									<Link
										href={homeFinalCta.primary.href}
										className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-foreground px-6 text-sm font-medium text-ink no-underline transition-colors hover:bg-brand-foreground/90"
									>
										{homeFinalCta.primary.label}
										<ArrowRight className="size-4" aria-hidden="true" />
									</Link>
									<Link
										href={homeFinalCta.secondary.href}
										className="inline-flex h-11 items-center rounded-full px-5 text-sm font-medium text-brand-foreground/85 no-underline hover:bg-border hover:text-brand-foreground"
									>
										{homeFinalCta.secondary.label}
									</Link>
								</div>
								<p className="mt-5 text-xs leading-relaxed text-brand-foreground/60">
									{homeFinalCta.note}
								</p>
							</div>
						</div>
					</Container>
				</section>
			</div>
		</>
	);
}
