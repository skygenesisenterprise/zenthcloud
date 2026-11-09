import { CheckCircle2, Clock3, Handshake, MessagesSquare } from "lucide-react";
import {
	COMMERCIAL_STATUS_META,
} from "@/lib/domain/queries";
import type { CommercialStatus } from "@/lib/domain/schema";
import { cn } from "@/lib/utils";

const TONE_CLASS: Record<string, string> = {
	positive: "border-success/30 bg-success/10 text-success",
	neutral: "border-border bg-muted text-muted-foreground",
	info: "border-info/30 bg-info/10 text-info",
	muted: "border-warning/30 bg-warning/10 text-warning",
};

const ICONS = {
	available: CheckCircle2,
	coming_soon: Clock3,
	contact_sales: MessagesSquare,
	partner_service: Handshake,
} as const;

export function StatusBadge({
	status,
	className,
	showDescription = false,
}: {
	status: CommercialStatus;
	className?: string;
	showDescription?: boolean;
}) {
	const meta = COMMERCIAL_STATUS_META[status];
	const Icon = ICONS[status];
	return (
		<span className={cn("inline-flex flex-col gap-1", className)}>
			<span
				className={cn(
					"inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
					TONE_CLASS[meta.tone],
				)}
			>
				<Icon className="h-3.5 w-3.5" aria-hidden="true" />
				{meta.label}
			</span>
			{showDescription && (
				<span className="text-xs leading-relaxed text-muted-foreground">
					{meta.description}
				</span>
			)}
		</span>
	);
}
