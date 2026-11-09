export type FaqEntry = { question: string; answer: string };

export const homeHero = {
	eyebrow: "European roots. Global ambitions.",
	title: "Cloud infrastructure.",
	highlight: "Without boundaries.",
	description:
		"Compute, storage, networking and managed services on owned and partner infrastructure. One catalogue, one commercial model, and availability published per product and region.",
	primaryCta: { href: "/products", label: "Explore the catalogue" },
	secondaryCta: { href: "/contact-sales", label: "Talk to sales" },
} as const;

export const valueProps = [
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
