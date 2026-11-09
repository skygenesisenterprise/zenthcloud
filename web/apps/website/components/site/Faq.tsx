import { Plus } from "lucide-react";

export type FaqItem = { question: string; answer: string };

/**
 * Native <details> gives keyboard and screen-reader behaviour without client
 * JavaScript. Answers are plain text so they can also feed FAQPage JSON-LD.
 */
export function Faq({ id, items }: { id: string; items: readonly FaqItem[] }) {
	return (
		<div className="mx-auto max-w-3xl border-t border-border">
			{items.map((item) => (
				<details key={item.question} className="group border-b border-border">
					<summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-medium text-foreground [&::-webkit-details-marker]:hidden">
						{item.question}
						<Plus
							className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
							aria-hidden="true"
						/>
					</summary>
					<p
						id={`${id}-${items.indexOf(item)}`}
						className="pb-4 pr-8 text-sm leading-relaxed text-muted-foreground"
					>
						{item.answer}
					</p>
				</details>
			))}
		</div>
	);
}
