import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "../Container";
import { homeHero } from "@/lib/content/home";

/**
 * Official hero visual — "Signal panel".
 *
 * Composition reference: a single saturated panel, a fine dot field, one
 * oversized centred headline and one pill action. The palette, wording and
 * artwork are ZenthCloud's; no reference logo, layout or asset is reproduced.
 */
export function SignalHero() {
	return (
		<section className="border-b border-border bg-ink">
			<Container className="pb-6 pt-2 sm:pb-8">
				<div className="relative overflow-hidden rounded-xl bg-brand text-brand-foreground">
					<div className="signal-dots absolute inset-0" aria-hidden="true" />
					<div
						className="pointer-events-none absolute -bottom-40 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand-foreground/15 blur-3xl"
						aria-hidden="true"
					/>

					<div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center sm:py-24 lg:py-28">
						<p className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-foreground/70">
							{homeHero.eyebrow}
						</p>

						<h1 className="mt-6 font-display text-4xl leading-[1.03] text-brand-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
							{homeHero.title}
							<br className="hidden sm:block" />{" "}
							<span className="text-balance">{homeHero.highlight}</span>
						</h1>

						<p className="mt-6 max-w-xl text-sm leading-relaxed text-brand-foreground/80 sm:text-base">
							{homeHero.description}
						</p>

						<div className="mt-9 flex flex-col items-center gap-4">
							<Link
								href={homeHero.primaryCta.href}
								className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-foreground px-6 text-sm font-medium text-brand transition-colors hover:bg-brand-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
							>
								{homeHero.primaryCta.label}
								<ArrowRight className="h-4 w-4" aria-hidden="true" />
							</Link>
							<p className="text-sm text-brand-foreground/70">
								or{" "}
								<Link
									href={homeHero.secondaryCta.href}
									className="text-brand-foreground underline decoration-brand-foreground/40 underline-offset-4 transition-colors hover:decoration-brand-foreground"
								>
									{homeHero.secondaryCta.label.toLowerCase()}
								</Link>
							</p>
						</div>

						<p className="mt-8 text-xs text-brand-foreground/55">
							Already a customer?{" "}
							<Link
								href="/login"
								className="text-brand-foreground/85 underline decoration-brand-foreground/30 underline-offset-4 hover:decoration-brand-foreground/70"
							>
								Sign in to the console
							</Link>
						</p>
					</div>
				</div>
			</Container>
		</section>
	);
}
