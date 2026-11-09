import { type ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";
/** Base styles applied to all badge variants. */
export declare const KUMO_BADGE_BASE_STYLES = "inline-flex w-fit flex-none shrink-0 items-center justify-self-start gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap [a:hover_&]:ring [a:hover_&]:ring-current";
/** Badge variant definitions mapping variant names to their Tailwind classes and descriptions. */
export declare const KUMO_BADGE_VARIANTS: {
    readonly variant: {
        /** Semantic token badges */
        readonly primary: {
            readonly classes: "bg-zenth-badge-inverted text-zenth-badge-inverted";
            readonly description: "Primary badge";
        };
        readonly secondary: {
            readonly classes: "bg-zenth-fill text-zenth-badge-neutral-subtle";
            readonly description: "Secondary badge";
        };
        readonly error: {
            readonly classes: "bg-zenth-danger-tint text-zenth-danger";
            readonly description: "Error badge";
        };
        readonly warning: {
            readonly classes: "bg-zenth-warning-tint text-zenth-warning";
            readonly description: "Warning badge";
        };
        readonly success: {
            readonly classes: "bg-zenth-success-tint text-zenth-success";
            readonly description: "Success badge";
        };
        readonly destructive: {
            readonly classes: "bg-zenth-badge-red text-white";
            readonly description: "Deprecated. Use red instead.";
        };
        readonly info: {
            readonly classes: "bg-zenth-info-tint text-zenth-info";
            readonly description: "Info badge";
        };
        readonly beta: {
            readonly classes: "border border-dashed border-zenth-brand bg-transparent text-zenth-link";
            readonly description: "Indicates beta or experimental features";
        };
        readonly outline: {
            readonly classes: "border border-zenth-fill bg-zenth-base text-zenth-default";
            readonly description: "Bordered badge with base background";
        };
        /** Other color token variants */
        readonly red: {
            readonly classes: "bg-zenth-badge-red text-white";
            readonly description: "Red badge";
        };
        readonly green: {
            readonly classes: "bg-zenth-badge-green text-white";
            readonly description: "Green badge";
        };
        readonly neutral: {
            readonly classes: "bg-zenth-badge-neutral text-white";
            readonly description: "Neutral badge";
        };
        readonly orange: {
            readonly classes: "bg-zenth-badge-orange text-black";
            readonly description: "Orange badge";
        };
        readonly purple: {
            readonly classes: "bg-zenth-badge-purple text-white";
            readonly description: "Purple badge";
        };
        readonly teal: {
            readonly classes: "bg-zenth-badge-teal text-white";
            readonly description: "Teal badge";
        };
        readonly "teal-subtle": {
            readonly classes: "bg-zenth-badge-teal-subtle text-zenth-badge-teal-subtle";
            readonly description: "Subtle teal badge";
        };
        readonly blue: {
            readonly classes: "bg-zenth-badge-blue text-white";
            readonly description: "Blue badge";
        };
    };
    readonly appearance: {
        readonly filled: {
            readonly classes: "";
            readonly description: "Filled badge with background color (default)";
        };
        readonly dot: {
            readonly classes: "gap-1.5 bg-transparent text-zenth-default ring ring-zenth-hairline";
            readonly description: "Outlined badge with a colored circle dot indicating status";
        };
    };
    readonly dotColor: {
        readonly none: {
            readonly classes: "";
            readonly description: "No dot indicator (used when appearance is not dot, or variant has no dot color)";
        };
        readonly success: {
            readonly classes: "bg-zenth-success";
            readonly description: "Green dot for success status";
        };
        readonly warning: {
            readonly classes: "bg-zenth-badge-orange";
            readonly description: "Orange dot for warning status";
        };
        readonly error: {
            readonly classes: "bg-zenth-badge-red";
            readonly description: "Red dot for error status";
        };
        readonly neutral: {
            readonly classes: "bg-zenth-badge-neutral";
            readonly description: "Neutral dot for informational status";
        };
    };
};
export declare const KUMO_BADGE_DEFAULT_VARIANTS: {
    readonly variant: "primary";
    readonly appearance: "filled";
    readonly dotColor: "none";
};
export type KumoBadgeVariant = keyof typeof KUMO_BADGE_VARIANTS.variant;
export type KumoBadgeAppearance = keyof typeof KUMO_BADGE_VARIANTS.appearance;
export type KumoBadgeDotColor = keyof typeof KUMO_BADGE_VARIANTS.dotColor;
export interface KumoBadgeVariantsProps {
    variant?: KumoBadgeVariant;
    appearance?: KumoBadgeAppearance;
}
export declare function badgeVariants({ variant, appearance, }?: KumoBadgeVariantsProps): string;
export type BadgeVariant = KumoBadgeVariant;
/**
 * Badge component props.
 *
 * @example
 * ```tsx
 * <Badge variant="green">Active</Badge>
 * <Badge variant="red">Error</Badge>
 * <Badge variant="neutral">Inactive</Badge>
 * <Badge variant="success" appearance="dot">Healthy</Badge>
 * ```
 */
interface BadgeBaseProps {
    /**
     * Color variant of the badge.
     * Recommended semantic variants:
     * - `"primary"` — Primary badge
     * - `"secondary"` — Secondary badge
     * - `"error"` — Error badge
     * - `"warning"` — Warning badge
     * - `"success"` — Success badge
     * - `"info"` — Info badge
     *
     * Additional token variants:
     * - `"red"`, `"orange"`, `"green"`, `"teal"`, `"blue"`, `"purple"`, `"neutral"`
     * - `"teal-subtle"`, `"neutral-subtle"`
     * - `"inverted"`
     * - `"outline"` — Bordered badge with the base background
     * - `"beta"` — Dashed-border badge for beta/experimental features
     * @default "primary"
     */
    variant?: KumoBadgeVariant;
    /** Additional CSS classes merged via `cn()`. */
    className?: string;
    /** Content rendered inside the badge. */
    children: ReactNode;
}
interface FilledBadgeProps extends BadgeBaseProps {
    /**
     * Visual appearance of the badge.
     * - `"filled"` — Filled background using the variant color (default)
     * - `"dot"` — Outlined badge with a colored circle dot. Only `success`,
     *   `warning`, `error`, and `neutral` variants show a dot. Dot badges do not
     *   accept icons.
     * @default "filled"
     */
    appearance?: "filled";
    /** Icon from `@phosphor-icons/react` or a React element. Rendered before children. */
    icon?: Icon | ReactNode;
}
interface DotBadgeProps extends BadgeBaseProps {
    /**
     * Visual appearance of the badge.
     * - `"filled"` — Filled background using the variant color (default)
     * - `"dot"` — Outlined badge with a colored circle dot. Only `success`,
     *   `warning`, `error`, and `neutral` variants show a dot. Dot badges do not
     *   accept icons.
     * @default "filled"
     */
    appearance: "dot";
    /** Dot badges use their status dot instead of an icon. */
    icon?: never;
}
export type BadgeProps = FilledBadgeProps | DotBadgeProps;
/**
 * Small status label for categorizing or highlighting content.
 *
 * @example
 * ```tsx
 * <Badge variant="green">Active</Badge>
 * <Badge variant="success" appearance="dot">Healthy</Badge>
 * ```
 */
export declare function Badge({ variant, appearance, className, icon, children, }: BadgeProps): import("react/jsx-runtime").JSX.Element;
export {};
