import { Link, LinkButton } from "@zenthcloud/react";
import {
	cta,
	footerSections,
	links,
	organisation,
} from "@/lib/content/site";
import { Container } from "../Container";
import { Logo } from "../shared/Logo";

export function SiteFooter() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-border bg-background text-foreground">
			<Container>
				<div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16 lg:py-16">
					<div>
						<Link
							href="/"
							variant="current"
							aria-label="ZenthCloud home"
							className="inline-flex items-center gap-2 no-underline"
						>
							<Logo className="size-8 text-primary" />
							<span className="font-display text-lg font-semibold tracking-tight text-foreground">
								ZenthCloud
							</span>
						</Link>
						<p className="mt-4 max-w-sm font-display text-lg leading-snug text-foreground">
							{organisation.positioning}
						</p>
						<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
							{organisation.description}
						</p>
						<p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
							{organisation.supporting}
						</p>

						<div className="mt-6 flex flex-wrap gap-2">
							<LinkButton href={cta.primary.href} variant="primary" size="sm">
								{cta.primary.label}
							</LinkButton>
							<LinkButton
								href={links.github}
								variant="secondary"
								size="sm"
								external
							>              GitHub
              <span aria-hidden="true">↗</span>
							</LinkButton>
						</div>

						<ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
							{[
								{ href: links.docs.home, label: "Documentation" },
								{ href: links.status, label: "Status" },
								{ href: links.console, label: "Console" },
							].map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										variant="current"
										target="_blank"
										rel="noreferrer"
										className="text-muted-foreground no-underline transition-colors hover:text-foreground hover:underline"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
						{footerSections.map((section) => (
							<div key={section.title}>
								<h2 className="text-xs font-semibold uppercase tracking-wide text-foreground">
									{section.title}
								</h2>
								<ul className="mt-3 space-y-2">
									{section.links.map((item) => (
										<li key={`${section.title}-${item.href}-${item.label}`}>
											<Link
												href={item.href}
												variant="current"
												target={item.external ? "_blank" : undefined}
												rel={item.external ? "noreferrer" : undefined}
												className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground hover:underline"
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

				<div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<p>
						© {year} {organisation.legalName}. ZenthCloud is a Sky Genesis
						Enterprise brand.
					</p>
					<div className="flex flex-wrap gap-x-5 gap-y-2">
						<Link
							href="/legal/terms"
							variant="current"
							className="no-underline transition-colors hover:text-foreground"
						>
							Terms
						</Link>
						<Link
							href="/legal/privacy"
							variant="current"
							className="no-underline transition-colors hover:text-foreground"
						>
							Privacy
						</Link>
						<Link
							href="/legal/cookies"
							variant="current"
							className="no-underline transition-colors hover:text-foreground"
						>
							Cookies
						</Link>
						<Link
							href="/legal/acceptable-use"
							variant="current"
							className="no-underline transition-colors hover:text-foreground"
						>
							Acceptable use
						</Link>
						<span>English (EN)</span>
					</div>
				</div>
			</Container>
		</footer>
	);
}
