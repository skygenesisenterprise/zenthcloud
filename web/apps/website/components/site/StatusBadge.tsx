import { Badge } from "@zenthcloud/react";
import { COMMERCIAL_STATUS_META } from "@/lib/domain/queries";
import type { CommercialStatus } from "@/lib/domain/schema";
import { cn } from "@/lib/utils";

const VARIANT: Record<
	CommercialStatus,
	"success" | "secondary" | "info" | "warning"
> = {
	available: "success",
	coming_soon: "secondary",
	contact_sales: "info",
	partner_service: "warning",
};

/**
 * Commercial status label.
 *
 * Colour, shape and typography come from the design-system Badge so the same
 * status reads identically on every product surface.
 */
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
	return (
		<span className={cn("inline-flex flex-col gap-1", className)}>
			<Badge variant={VARIANT[status]}>{meta.label}</Badge>
			{showDescription && (
				<span className="text-xs leading-relaxed text-muted-foreground">
					{meta.description}
				</span>
			)}
		</span>
	);
}
