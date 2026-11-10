import { Link, LinkButton } from "@zenthcloud/react";
import { ArrowRight, ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/Container";
import { Faq } from "@/components/site/Faq";
import { SectionIntro } from "./SectionIntro";
import {
	finalCta,
	homeFaqs,
	resourceLinks,
	resourcesSection,
	securityCommitments,
	securityLayers,
	securitySection,
	whyPoints,
	whySection,
} from "@/lib/content/home";

/** 08 — Security and reliability, with the scope of each capability. */
export function SecuritySection() {
	return (
		<section
			aria-labelledby="security-title"
			className="border-b border-border bg-background py-20 sm:py-28"
		>
			<Container>
				<SectionIntro id="security-title" {...securitySection} align="center" />

				<div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2 lg:gap-12">
					<dl className="min-w-0 divide-y divide-border border-y border-border">
						{securityLayers.map((layer, index) => (
							<div key={layer.title} className="min-w-0 py-5">
								<dt className="flex items-baseline gap-3">
									<span className="shrink-0 font-mono text-xs text-muted-foreground">
										{String(index + 1).padStart(2, "0")}
									</span>
									<span className="min-w-0 break-words text-sm font-semibold text-foreground">
										{layer.title}
									</span>
								</dt>
								<dd className="mt-1.5 pl-8 text-sm leading-relaxed break-words text-muted-foreground">
									{layer.scope}
								</dd>
							</div>
						))}
					</dl>

					<aside className="h-fit min-w-0 rounded-2xl border border-border bg-muted p-7">
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
							Commitments
						</p>
						<h3 className="mt-3 font-display text-xl tracking-tight text-foreground">
							What we do not claim
						</h3>
						<ul className="mt-5 space-y-3">
							{securityCommitments.map((commitment) => (
								<li
									key={commitment}
									className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
								>
									<Check
										className="mt-0.5 size-4 shrink-0 text-primary"
										aria-hidden="true"
									/>
									{commitment}
								</li>
							))}
						</ul>
						<div className="mt-6 border-t border-border pt-4">
							<Link
								href="/products/security-identity"
								className="inline-flex items-center gap-1.5 text-sm font-medium text-primary no-underline hover:underline"
							>
								Security &amp; Identity
								<ArrowRight className="size-4" aria-hidden="true" />
							</Link>
						</div>
					</aside>
				</div>
			</Container>
		</section>
	);
}

/** 09 — Strategic differences, stated as operating choices. */
export function WhySection() {
	return (
		<section
			aria-labelledby="why-title"
			className="border-b border-border bg-background py-20 sm:py-28"
		>
			<Container>
				<SectionIntro id="why-title" {...whySection} align="center" />

				<div className="mx-auto mt-12 grid max-w-6xl gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
					{whyPoints.map((point, index) => (
						<article
							key={point.title}
							className="flex flex-col bg-background p-7"
						>
							<p className="font-mono text-xs text-muted-foreground">
								{String(index + 1).padStart(2, "0")}
							</p>
							<h3 className="mt-3 font-display text-lg tracking-tight text-foreground">
								{point.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
								{point.description}
							</p>
						</article>
					))}
					<article className="flex flex-col justify-between gap-4 bg-muted p-7">
						<p className="text-sm leading-relaxed text-muted-foreground">
							Every claim on this page resolves to a catalogue entry, a
							documented capability or an explicit “not published” state.
						</p>
						<LinkButton
							href="/infrastructure"
							variant="outline"
							size="sm"
							className="self-start"
						>
							Review the operating model
							<ArrowRight className="size-4" aria-hidden="true" />
						</LinkButton>
					</article>
				</div>
			</Container>
		</section>
	);
}

/** 10 — Resources, pointing at the real documentation and repository. */
export function ResourcesSection() {
	return (
		<section
			aria-labelledby="resources-title"
			className="border-b border-border bg-background py-20 sm:py-28"
		>
			<Container>
				<div className="flex flex-col items-center gap-6">
					<SectionIntro id="resources-title" {...resourcesSection} align="center" />
					<LinkButton
						href="/resources"
						variant="outline"
						className="self-center"
					>
						Resource hub
						<ArrowRight className="size-4" aria-hidden="true" />
					</LinkButton>
				</div>

				<ul className="mx-auto mt-10 grid max-w-6xl gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
					{resourceLinks.map((resource) => (
						<li key={resource.label} className="min-w-0">
							<Link
								href={resource.href}
								target={resource.external ? "_blank" : undefined}
								rel={resource.external ? "noreferrer" : undefined}
								className="group flex h-full min-w-0 flex-col justify-between gap-6 overflow-hidden bg-background p-6 no-underline transition-colors hover:bg-muted"
							>
								<span className="flex items-start justify-between gap-3">
									<span className="min-w-0 break-words text-sm font-semibold text-foreground group-hover:text-primary">
										{resource.label}
									</span>
									{resource.external ? (
										<ArrowUpRight
											className="size-4 shrink-0 text-muted-foreground group-hover:text-primary"
											aria-hidden="true"
										/>
									) : (
										<ArrowRight
											className="size-4 shrink-0 text-muted-foreground group-hover:text-primary"
											aria-hidden="true"
										/>
									)}
								</span>
								<span className="min-w-0 break-words text-sm leading-relaxed text-muted-foreground">
									{resource.description}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}

/** Questions, kept as native details elements for keyboard and screen readers. */
export function FaqSection() {
	return (
		<section
			id="home-faq"
			aria-labelledby="faq-title"
			className="border-b border-border bg-background py-20 sm:py-28"
		>
			<Container>
				<SectionIntro
					id="faq-title"
					eyebrow="Questions"
					title="Questions before you start"
					description="What the catalogue means, and what it deliberately does not claim."
					align="center"
				/>
				<div className="mt-12">
					<Faq id="home-faq" items={homeFaqs} />
				</div>
			</Container>
		</section>
	);
}

/** 11 — Final commercial call to action. */
export function FinalCtaSection() {
	return (
		<section aria-labelledby="start-title" className="bg-background py-20 sm:py-28">
			<Container>
				<div className="relative overflow-hidden rounded-2xl bg-brand px-6 py-16 text-center text-brand-foreground sm:px-12 sm:py-20">
					<div
						className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_85%_at_50%_45%,transparent_38%,rgba(0,0,0,0.32))]"
						aria-hidden="true"
					/>
					<div className="signal-dots absolute inset-0" aria-hidden="true" />

					<div className="relative mx-auto max-w-3xl">
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-foreground/75">
							{finalCta.eyebrow}
						</p>
						<h2
							id="start-title"
							className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-brand-foreground sm:text-5xl"
						>
							{finalCta.title}
						</h2>
						<p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-brand-foreground/85">
							{finalCta.description}
						</p>

						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Link
								href={finalCta.primary.href}
								className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-foreground px-6 text-sm font-medium text-ink no-underline transition-colors hover:bg-brand-foreground/90"
							>
								{finalCta.primary.label}
								<ArrowRight className="size-4" aria-hidden="true" />
							</Link>
							<Link
								href={finalCta.secondary.href}
								className="inline-flex h-11 items-center rounded-full border border-brand-foreground/35 px-5 text-sm font-medium text-brand-foreground no-underline transition-colors hover:bg-brand-foreground/10"
							>
								{finalCta.secondary.label}
							</Link>
							<Link
								href={finalCta.tertiary.href}
								className="inline-flex h-11 items-center rounded-full px-5 text-sm font-medium text-brand-foreground/90 no-underline transition-colors hover:bg-brand-foreground/10 hover:text-brand-foreground"
							>
								{finalCta.tertiary.label}
							</Link>
						</div>

						<p className="mt-5 text-xs leading-relaxed text-brand-foreground/75">
							{finalCta.note}
						</p>
					</div>
				</div>
			</Container>
		</section>
	);
}
