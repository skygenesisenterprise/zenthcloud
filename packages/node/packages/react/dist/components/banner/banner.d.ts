import { type HTMLAttributes, type ReactNode } from "react";
/** Structural base styles applied to all banners; size-specific spacing/alignment lives in `KUMO_BANNER_VARIANTS.size`. */
export declare const KUMO_BANNER_BASE_STYLES = "flex w-full";
/** Banner variant definitions mapping style options to their Tailwind classes and descriptions. */
export declare const KUMO_BANNER_VARIANTS: {
    readonly variant: {
        readonly default: {
            readonly classes: "bg-zenth-info-tint text-zenth-info";
            readonly iconClasses: "fill-zenth-info";
            readonly description: "Informational banner for general messages";
        };
        readonly alert: {
            readonly classes: "bg-zenth-warning-tint text-zenth-warning";
            readonly iconClasses: "fill-zenth-warning";
            readonly description: "Warning banner for cautionary messages";
        };
        readonly error: {
            readonly classes: "bg-zenth-danger-tint text-zenth-danger";
            readonly iconClasses: "fill-zenth-danger";
            readonly description: "Error banner for critical issues";
        };
        readonly secondary: {
            readonly classes: "bg-zenth-contrast/5 text-zenth-default/70";
            readonly iconClasses: "fill-zenth-interact";
            readonly description: "Neutral banner for secondary messages";
        };
    };
    readonly size: {
        readonly base: {
            readonly classes: "items-start gap-3 rounded-lg px-4 py-3 text-base";
            readonly description: "Default banner size";
        };
        readonly sm: {
            readonly classes: "items-center gap-2 rounded-md px-3 py-2 text-sm";
            readonly description: "Compact banner for dialogs and tight spaces";
        };
    };
};
export declare const KUMO_BANNER_DEFAULT_VARIANTS: {
    readonly variant: "default";
    readonly size: "base";
};
export type KumoBannerVariant = keyof typeof KUMO_BANNER_VARIANTS.variant;
export type KumoBannerSize = keyof typeof KUMO_BANNER_VARIANTS.size;
export type { BannerActionVariant, BannerActionSize, BannerActionProps, } from "./banner-action";
export interface KumoBannerVariantsProps {
    /**
     * Visual style of the banner.
     * - `"default"` — Informational banner for general messages
     * - `"alert"` — Warning banner for cautionary messages
     * - `"error"` — Error banner for critical issues
     * - `"secondary"` — Neutral banner for secondary messages
     * @default "default"
     */
    variant?: KumoBannerVariant;
    /**
     * Size of the banner.
     * - `"base"` — Default full-size banner
     * - `"sm"` — Compact banner for dialogs and other tight spaces
     * @default "base"
     */
    size?: KumoBannerSize;
}
export declare function bannerVariants({ variant, size, }?: KumoBannerVariantsProps): string;
export declare enum BannerVariant {
    DEFAULT = 0,
    ALERT = 1,
    ERROR = 2
}
/**
 * Banner component props.
 *
 * @example
 * ```tsx
 * <Banner title="Update available" description="A new version is ready to install." />
 * <Banner variant="alert" title="Session expiring" description="Your session will expire soon." />
 * <Banner variant="error" title="Save failed" description="We couldn't save your changes." />
 * ```
 */
export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
    /** Icon element rendered before the banner content (e.g. from `@phosphor-icons/react`). */
    icon?: ReactNode;
    /** Primary heading text for the banner. Use for i18n string injection. */
    title?: string;
    /** Secondary description text displayed below the title. Use for i18n string injection. */
    description?: ReactNode;
    /**
     * Action slot for a CTA button or link. Compact banners render a Kumo `Link`
     * inline with the description; CTAs render at the trailing end.
     * Use `Banner.Action` for accent-aware CTAs that self-style to the banner
     * variant; other nodes are rendered as-is. Multiple actions can be passed in
     * a Fragment. Only used in structured mode (with `title` or `description`).
     */
    action?: ReactNode;
    /** @deprecated Use `title` and `description` instead. Will be removed in a future major version. */
    text?: string;
    /** @deprecated Use `title` and `description` instead for better i18n support. */
    children?: ReactNode;
    /**
     * Visual style of the banner.
     * - `"default"` — Informational blue banner for general messages
     * - `"alert"` — Warning yellow banner for cautionary messages
     * - `"error"` — Error red banner for critical issues
     * - `"secondary"` — Neutral banner for secondary messages
     * @default "default"
     */
    variant?: KumoBannerVariant;
    /**
     * Size of the banner. A `"sm"` banner uses tighter spacing and `text-sm`,
     * renders a Kumo `Link` action inline with the description, and sets its
     * `Banner.Action` children to the `"xs"` size — suited to dialogs and other
     * tight spaces.
     * @default "base"
     */
    size?: KumoBannerSize;
    /** Additional CSS classes merged via `cn()`. */
    className?: string;
}
/**
 * Full-width message bar with an optional trailing CTA slot.
 *
 * `Banner.Action` is an accent-aware CTA button
 * (`variant="primary" | "secondary" | "ghost"`).
 */
export declare const Banner: import("react").ForwardRefExoticComponent<BannerProps & import("react").RefAttributes<HTMLDivElement>> & {
    Action: import("react").ForwardRefExoticComponent<import("./banner-action").BannerActionProps & import("react").RefAttributes<HTMLAnchorElement | HTMLButtonElement>>;
};
