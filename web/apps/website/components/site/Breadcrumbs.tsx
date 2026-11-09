import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/domain/queries";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
	if (items.length === 0) return null;

	return (
		<>
			<nav aria-label="Breadcrumb" className="text-sm">
				<ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
					<li>
						<Link href="/" className="underline-offset-4 hover:text-foreground hover:underline">
							Home
						</Link>
					</li>
					{items.map((item, index) => {
						const isLast = index === items.length - 1;
						return (
							<li key={item.path} className="flex items-center gap-1.5">
								<ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
								{isLast ? (
									<span aria-current="page" className="text-foreground">
										{item.name}
									</span>
								) : (
									<Link
										href={item.path}
										className="underline-offset-4 hover:text-foreground hover:underline"
									>
										{item.name}
									</Link>
								)}
							</li>
						);
					})}
				</ol>
			</nav>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						breadcrumbJsonLd([{ name: "Home", path: "/" }, ...items]),
					),
				}}
			/>
		</>
	);
}
