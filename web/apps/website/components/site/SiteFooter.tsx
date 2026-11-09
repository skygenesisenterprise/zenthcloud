import Link from "next/link";
import { footerSections, links, organisation } from "@/lib/content/site";
import { Container } from "../Container";
import { Logo } from "../shared/Logo";

export function SiteFooter() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-ink bg-ink text-ink-foreground">
			<Container>
				<div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16 lg:py-16">
					<div>
						<Link href="/" aria-label="ZenthCloud home" className="inline-flex items-center gap-2">
							<Logo className="h-8 w-8" />
							<span className="font-display text-lg font-semibold tracking-tight">
								ZenthCloud
							</span>
						</Link>
						<p className="mt-4 max-w-sm font-display text-lg leading-snug">
							{organisation.positioning}
						</p>
						<p className="mt-2 text-sm leading-relaxed text-ink-foreground/65">
							{organisation.description}
						</p>
						<p className="mt-4 text-xs uppercase tracking-[0.16em] text-ink-foreground/45">
							{organisation.supporting}
						</p>
						<ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
							<li>
								<a
									href={links.docs.home}
									target="_blank"
									rel="noreferrer"
									className="text-ink-foreground/65 underline-offset-4 transition-colors hover:text-ink-foreground hover:underline"
								>
									Documentation
								</a>
							</li>
							<li>
								<a
									href={links.status}
									target="_blank"
									rel="noreferrer"
									className="text-ink-foreground/65 underline-offset-4 transition-colors hover:text-ink-foreground hover:underline"
								>
									Status
								</a>
							</li>
							<li>
								<a
									href={links.console}
									target="_blank"
									rel="noreferrer"
									className="text-ink-foreground/65 underline-offset-4 transition-colors hover:text-ink-foreground hover:underline"
								>
									Console
								</a>
							</li>
						</ul>
					</div>

					<nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
						{footerSections.map((section) => (
							<div key={section.title}>
								<h2 className="text-xs font-semibold uppercase tracking-wide text-ink-foreground">
									{section.title}
								</h2>
								<ul className="mt-3 space-y-2">
									{section.links.map((item) => (
										<li key={`${section.title}-${item.href}-${item.label}`}>
											<Link
												href={item.href}
												className="text-sm text-ink-foreground/60 underline-offset-4 transition-colors hover:text-ink-foreground hover:underline"
											>
												{item.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</nav>
				</div>

				<div className="flex flex-col gap-3 border-t border-ink-foreground/15 py-6 text-xs text-ink-foreground/45 sm:flex-row sm:items-center sm:justify-between">
					<p>
						© {year} {organisation.legalName}. ZenthCloud is a Sky Genesis
						Enterprise brand.
					</p>
					<div className="flex flex-wrap gap-x-5 gap-y-2">
						<Link href="/legal/terms" className="transition-colors hover:text-ink-foreground">
							Terms
						</Link>
						<Link href="/legal/privacy" className="transition-colors hover:text-ink-foreground">
							Privacy
						</Link>
						<Link href="/legal/cookies" className="transition-colors hover:text-ink-foreground">
							Cookies
						</Link>
						<Link href="/legal/acceptable-use" className="transition-colors hover:text-ink-foreground">
							Acceptable use
						</Link>
						<span>English (EN)</span>
					</div>
				</div>
			</Container>
		</footer>
	);
}
