import { Badge, Link, LinkButton } from "@zenthcloud/react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/Container";
import { SectionIntro } from "./SectionIntro";
import {
	architectureLayers,
	architectureSection,
	deploymentModels,
	deploymentSection,
	developerSection,
	developerTools,
	footprintSection,
} from "@/lib/content/home";
import {
	getProductsForRegion,
	getProviders,
	getRegions,
} from "@/lib/domain/queries";

/** 04 — How the catalogue services combine into one estate. */
export function ArchitectureSection() {
	return (
		<section
			aria-labelledby="architecture-title"
			className="border-b border-border bg-background py-20 sm:py-28"
		>
			<Container>
				<div className="mx-auto grid max-w-4xl gap-12">
					<div className="text-center">
						<SectionIntro id="architecture-title" {...architectureSection} align="center" />
						<Link
							href="/infrastructure/architecture"
							className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary no-underline hover:underline"
						>
							Read the architecture model
							<ArrowRight className="size-4" aria-hidden="true" />
						</Link>
					</div>

					<div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
						<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
							<span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
								Catalogue architecture
							</span>
							<span className="text-xs text-muted-foreground">Conceptual</span>
						</div>

						<div className="mt-5 space-y-3">
							{architectureLayers.map((layer, index) => (
								<div key={layer.label}>
									<div className="rounded-xl border border-border bg-background p-4">
										<div className="flex flex-wrap items-baseline justify-between gap-2">
											<p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
												{layer.label}
											</p>
											<p className="text-xs text-muted-foreground">{layer.note}</p>
										</div>
										<ul className="mt-3 flex flex-wrap gap-2">
											{layer.services.map((service) => (
												<li
													key={service}
													className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs text-foreground"
												>
													{service}
												</li>
											))}
										</ul>
									</div>
									{index < architectureLayers.length - 1 ? (
										<div
											className="mx-auto my-1 h-4 w-px bg-border"
											aria-hidden="true"
										/>
									) : null}
								</div>
							))}
						</div>

						<p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
							{architectureSection.note}
						</p>
					</div>
				</div>
			</Container>
		</section>
	);
}

/** 05 — Deployment models, compared in a table rather than four equal cards. */
export function DeploymentSection() {
	return (
		<section
			aria-labelledby="deployment-title"
			className="border-b border-border bg-background py-20 sm:py-28"
		>
			<Container>
				<SectionIntro id="deployment-title" {...deploymentSection} align="center" />

				<div className="mx-auto mt-12 max-w-6xl overflow-x-auto rounded-2xl border border-border">
					<table className="w-full min-w-[880px] border-collapse text-left text-sm">
						<caption className="sr-only">
							ZenthCloud deployment models and their commercial state
						</caption>
						<thead className="bg-muted">
							<tr>
								{["Model", "What it is", "Best for", "Commercial state"].map(
									(heading) => (
										<th
											key={heading}
											scope="col"
											className="border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
										>
											{heading}
										</th>
									),
								)}
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{deploymentModels.map((model) => (
								<tr key={model.title} className="align-top">
									<th
										scope="row"
										className="px-5 py-5 font-display text-base font-medium text-foreground"
									>
										{model.title}
									</th>
									<td className="px-5 py-5 leading-relaxed text-muted-foreground">
										{model.description}
									</td>
									<td className="px-5 py-5 leading-relaxed text-muted-foreground">
										{model.fit}
									</td>
									<td className="px-5 py-5 leading-relaxed text-muted-foreground">
										{model.commercial}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
					No deployment model is presented as universally orderable. Availability
					is published per product and per region, and enterprise capacity is
					quoted after a scoping conversation.
				</p>
			</Container>
		</section>
	);
}

/** 06 — Developer tooling and a catalogue record that matches the data model. */
export function DeveloperSection() {
	return (
		<section
			aria-labelledby="developers-title"
			className="border-b border-border bg-background py-20 sm:py-28"
		>
			<Container>
				<div className="mx-auto grid max-w-4xl gap-12">
					<div>
						<SectionIntro id="developers-title" {...developerSection} align="center" />

						<ul className="mt-9 divide-y divide-border border-y border-border">
							{developerTools.map((tool) => (
								<li key={tool.title} className="py-4">
									<div className="flex flex-wrap items-baseline justify-between gap-2">
										<h3 className="text-sm font-semibold text-foreground">
											{tool.title}
										</h3>
										<Link
											href={tool.href}
											target={tool.external ? "_blank" : undefined}
											rel={tool.external ? "noreferrer" : undefined}
											className="inline-flex items-center gap-1 text-xs font-medium text-primary no-underline hover:underline"
										>
											{tool.label}
											{tool.external ? (
												<ArrowUpRight
													className="size-3"
													aria-hidden="true"
												/>
											) : (
												<ArrowRight className="size-3" aria-hidden="true" />
											)}
										</Link>
									</div>
									<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
										{tool.description}
									</p>
								</li>
							))}
						</ul>
					</div>

					<div className="overflow-hidden rounded-2xl border border-border bg-card">
						<div className="flex items-center justify-between border-b border-border px-5 py-3">
							<span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
								<span className="size-2 rounded-full bg-primary" />
								Catalogue record
							</span>
							<span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
								Example
							</span>
						</div>
						<pre
							aria-label="Example catalogue record"
							className="overflow-x-auto p-5 text-xs leading-relaxed text-foreground/80 sm:p-7 sm:text-sm"
						>
							<code>{`{
  "product": "compute-instances",
  "region": "eu-core",
  "providerId": "zenthcloud",
  "commercialStatus": "coming_soon",
  "operationalStatus": "unknown",
  "price": null
}`}</code>
						</pre>
						<div className="border-t border-border px-5 py-4 text-xs leading-relaxed text-muted-foreground">
							The record mirrors the fields the catalogue validates: provider,
							region, commercial state, operational state and price publication
							are separate values.
						</div>
						<div className="border-t border-border px-5 py-3">
							<Link
								href="/resources/api"
								className="inline-flex items-center gap-1.5 text-xs font-medium text-primary no-underline hover:underline"
							>
								Read the API reference
								<ArrowRight className="size-3.5" aria-hidden="true" />
							</Link>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}

/** 07 — Regions and providers, with verification state made explicit. */
export function FootprintSection() {
	const regions = getRegions();
	const providers = getProviders();

	return (
		<section
			aria-labelledby="footprint-title"
			className="border-b border-border bg-muted py-20 sm:py-28"
		>
			<Container>
				<div className="flex flex-col items-center gap-8">
					<SectionIntro id="footprint-title" {...footprintSection} align="center" />
					<LinkButton
						href="/infrastructure/locations"
						variant="outline"
						className="self-center"
					>
						Locations and verification
						<ArrowRight className="size-4" aria-hidden="true" />
					</LinkButton>
				</div>

				<div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-2">
					{regions.map((region) => {
						const regionProviders = providers.filter((provider) =>
							provider.regions.includes(region.id),
						);
						const productCount = getProductsForRegion(region.id).length;

						return (
							<article
								key={region.id}
								className="rounded-2xl border border-border bg-background p-7"
							>
								<div className="flex flex-wrap items-start justify-between gap-3">
									<h3 className="font-display text-xl tracking-tight text-foreground">
										{region.name}
									</h3>
									<Badge
										variant={
											region.verification === "verified"
												? "success"
												: "secondary"
										}
									>
										{region.verification === "verified"
											? "Verified"
											: "Pending verification"}
									</Badge>
								</div>
								<p className="mt-2 text-sm text-muted-foreground">
									{region.country} · {region.location}
								</p>
								<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
									{region.notes}
								</p>
								<dl className="mt-5 space-y-2 border-t border-border pt-4 text-xs">
									<div className="flex justify-between gap-4">
										<dt className="text-muted-foreground">Operating provider</dt>
										<dd className="text-right text-foreground">
											{regionProviders.map((provider) => provider.name).join(", ")}
										</dd>
									</div>
									<div className="flex justify-between gap-4">
										<dt className="text-muted-foreground">Catalogue products</dt>
										<dd className="text-foreground">{productCount}</dd>
									</div>
								</dl>
							</article>
						);
					})}
				</div>

				<div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
					{providers.map((provider) => (
						<span key={provider.id} className="inline-flex items-center gap-2">
							<span
								className={
									provider.type === "own"
										? "size-2 rounded-full bg-primary"
										: "size-2 rounded-full border border-primary bg-transparent"
								}
								aria-hidden="true"
							/>
							{provider.name} —{" "}
							{provider.type === "own"
								? "ZenthCloud operated"
								: "Partner operated"}
						</span>
					))}
					<span className="inline-flex items-center gap-2">
						<span className="size-2 rounded-full bg-border" aria-hidden="true" />
						Pending verification
					</span>
				</div>

				<p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
					No facility map is published because no location has completed
					verification. A future location will appear here only with its operating
					entity and verification state.
				</p>
			</Container>
		</section>
	);
}
