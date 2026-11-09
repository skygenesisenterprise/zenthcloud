import type { ProductFamily } from "@/lib/domain/schema";

export type FaqEntry = { question: string; answer: string };

export const homeHero = {
	eyebrow: "European roots. Global ambitions.",
	title: "Cloud infrastructure.",
	highlight: "Without boundaries.",
	description:
		"Compute, storage, networking and managed services on owned and partner infrastructure. One catalogue, one commercial model, and availability published per product and region.",
	primaryCta: { href: "/products", label: "Explore the catalogue" },
	secondaryCta: { href: "/pricing", label: "See pricing" },
} as const;

/**
 * The three things the catalogue is organised around. Each pillar is expressed
 * in verbs, so the homepage reads as a platform rather than a product list,
 * and resolves to real product families from the catalogue.
 */
export const platformPillars: readonly {
	verb: string;
	title: string;
	description: string;
	href: string;
	linkLabel: string;
	families: readonly ProductFamily[];
}[] = [
	{
		verb: "Run",
		title: "Workloads that state where they run",
		description:
			"Instances, volumes, backups, clusters and managed databases, each published with its commercial state and the regions where it applies.",
		href: "/products",
		linkLabel: "Browse compute, storage and platform",
		families: ["compute", "storage", "platform"],
	},
	{
		verb: "Connect",
		title: "Networks, addresses and delivery",
		description:
			"Private networks, public addressing, load balancing, domains and hosting, connected to the same availability model as everything else.",
		href: "/products/networking",
		linkLabel: "Explore networking",
		families: ["networking", "web"],
	},
	{
		verb: "Protect",
		title: "Protection and recovery, with limits",
		description:
			"Certificates, protection and recovery capabilities described with their scope — a capability is never presented as a guarantee.",
		href: "/products/security",
		linkLabel: "Explore security",
		families: ["security"],
	},
];

/** Labels for the catalogue figures shown on the homepage. */
export const catalogueStats = [
	{ id: "families", label: "Product families", detail: "Compute to security" },
	{ id: "products", label: "Products in the catalogue", detail: "Each with a commercial state" },
	{ id: "regions", label: "Regions modelled", detail: "Owned and partner capacity" },
	{ id: "providers", label: "Infrastructure providers", detail: "Named before purchase" },
] as const;

export const whyPoints = [
	{
		title: "Infrastructure flexibility",
		description:
			"Run on capacity operated by ZenthCloud or supplied by a partner. The catalogue labels which is which, and a product page never hardcodes its supplier.",
	},
	{
		title: "Operational transparency",
		description:
			"Every product states its commercial state and its regional availability. Prices stay unpublished until approved, instead of being replaced by a placeholder number.",
	},
	{
		title: "A consistent cloud experience",
		description:
			"Six product families share one navigation, one availability model and one commercial vocabulary — from a first instance to a private estate.",
	},
] as const;

export const platformModel = {
	eyebrow: "The catalogue model",
	title: "One catalogue. Every layer.",
	description:
		"Run, connect and protect on infrastructure that belongs to ZenthCloud or to a named partner. The interface keeps the operating provider, the commercial state and the region separate, so a product can be read before it is bought.",
} as const;

export const catalogueSection = {
	eyebrow: "Products",
	title: "Six product families, one taxonomy",
	description:
		"A complete catalogue, with the commercial state of every product published per region. Products are introduced progressively; the catalogue makes that explicit rather than implying a launch date.",
	note: "A family lists what exists. Each product page states its limits, its regions and its commercial state.",
} as const;

export const hybridPoints = [
	{
		title: "Owned infrastructure",
		description:
			"Facilities and capacity operated directly by ZenthCloud. Availability entries reference the owned provider and say so in the interface.",
	},
	{
		title: "Partner infrastructure",
		description:
			"Capacity from external providers, integrated into the same catalogue. Partner facilities are never presented as ZenthCloud-owned, and the provider of record is named before purchase.",
	},
	{
		title: "Independent product data",
		description:
			"Products are modelled without a supplier. Changing infrastructure provider is a data change to availability entries, not a rebuild of the website.",
	},
] as const;

export const developerPoints = [
	{
		title: "API-first resources",
		description:
			"Instances, volumes, networks and managed services are API resources. The public reference documents what exists.",
		href: "/resources/api",
		linkLabel: "API reference",
	},
	{
		title: "Explicit limits",
		description:
			"Attachment rules, resize behaviour and region scope are written down per product rather than discovered in a ticket.",
		href: "/resources/documentation",
		linkLabel: "Documentation",
	},
	{
		title: "No hidden orchestration",
		description:
			"ZenthCloud provides the infrastructure primitives. Your deployment tooling, CI and observability remain yours.",
		href: "/solutions/developers",
		linkLabel: "For developers",
	},
] as const;

export const availabilitySection = {
	eyebrow: "Availability",
	title: "Coverage stated honestly",
	description:
		"A region is published with a verification state. Products can be commercially available in one region and not in another, and the homepage does not round that difference away.",
} as const;

export const resourcesSection = {
	eyebrow: "Resources",
	title: "Documentation, API and support",
	description:
		"The technical ecosystem lives outside the marketing site so it can be versioned with the platform.",
} as const;

export const homeFinalCta = {
	eyebrow: "Start here",
	title: "Start from the catalogue, not a sales call.",
	description:
		"Browse products, availability and pricing state first. When you need a scoped proposal, the sales team takes it from there.",
	primary: { href: "/products", label: "Explore the catalogue" },
	secondary: { href: "/contact-sales", label: "Talk to sales" },
	note: "Prices are published per plan, or explicitly marked as not published.",
} as const;

export const homeFaqs: FaqEntry[] = [
	{
		question: "Can I order every product shown on the website?",
		answer:
			"No. The catalogue is complete by design, but each product carries a commercial state — available, coming soon, contact sales or partner service — and a per-region availability table. A product marked coming soon cannot be ordered and no launch date is implied.",
	},
	{
		question: "Are prices final?",
		answer:
			"No commercial price is published yet. Pricing plans exist in the data model, but every plan is in draft and shows “Price not published”. We do not display placeholder prices that could be mistaken for an offer.",
	},
	{
		question: "Does ZenthCloud own all of its infrastructure?",
		answer:
			"No. ZenthCloud operates a hybrid model: owned infrastructure plus partner infrastructure. Products delivered on partner capacity are labelled “Partner service”, and the operating provider is named in the contract for that product and region.",
	},
	{
		question: "Where are the regions located?",
		answer:
			"The catalogue currently models a European Union core region and a partner network. Both carry a pending verification state, so no city or facility address is claimed on this website. Verified locations will be listed with their operating entity.",
	},
	{
		question: "Is there an SLA or certification?",
		answer:
			"None is claimed on this website. An SLA applies only where a signed contract states one, and a certification is listed only with its scope, issuing body and validity period.",
	},
	{
		question: "How do I get access?",
		answer:
			"Public self-service onboarding is not open yet. Request access or contact sales with the products and region you are targeting. Existing customers sign in through the console.",
	},
] as const;

export const trustPoints = [
	"Owned and partner infrastructure are labelled separately.",
	"No certification, uptime or residency claim without evidence.",
	"Prices are either published and approved, or explicitly not published.",
	"Product pages describe limits, not just capabilities.",
] as const;
