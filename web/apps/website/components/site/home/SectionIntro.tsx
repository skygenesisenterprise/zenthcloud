import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Section header used across the homepage. Keeping the eyebrow, heading and
 * description in one place is what makes the page read as a single editorial
 * system rather than a stack of unrelated blocks.
 */
export function SectionIntro({
	id,
	eyebrow,
	title,
	description,
	actions,
	align = "start",
	className,
}: {
	id: string;
	eyebrow: string;
	title: string;
	description?: string;
	actions?: ReactNode;
	align?: "start" | "center";
	className?: string;
}) {
	const centered = align === "center";

	return (
		<div
			className={cn(
				centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
				className,
			)}
		>
			<p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
				{eyebrow}
			</p>
			<h2
				id={id}
				className="mt-3 font-display text-3xl leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-5xl"
			>
				{title}
			</h2>
			{description ? (
				<p
				className={cn(
					"mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground",
					centered && "mx-auto",
				)}
			>
					{description}
				</p>
			) : null}
			{actions ? (
				<div
					className={cn(
						"mt-7 flex flex-wrap items-center gap-3",
						centered && "justify-center",
					)}
				>
					{actions}
				</div>
			) : null}
		</div>
	);
}
