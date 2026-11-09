import { type ButtonProps, type KumoButtonSize, type KumoButtonVariant, type LinkButtonProps } from "../button/button";
import type { KumoBannerVariant } from "./banner";
/**
 * Visual variant for a `Banner.Action`, aligned with `Button`'s `variant` naming.
 * - `"primary"` — filled accent gradient for the main action.
 * - `"secondary"` — transparent with an accent-hued outline (same hue as the banner).
 * - `"ghost"` — text-only accent action with a faint accent-tinted hover.
 */
export type BannerActionVariant = Extract<KumoButtonVariant, "primary" | "secondary" | "ghost">;
/**
 * Size of a `Banner.Action`, matching the equivalent `Button` size specs.
 * - `"xs"` — extra small for dense/compact banners.
 * - `"sm"` — small (default), the standard banner CTA size.
 */
export type BannerActionSize = Extract<KumoButtonSize, "xs" | "sm">;
/** Value shared from the `Banner` root to its `Banner.Action` children. */
export interface BannerActionContextValue {
    /** Banner variant, used to pick the matching accent color. */
    variant: KumoBannerVariant;
    /** Action size derived from the banner's own size. */
    size: BannerActionSize;
}
/**
 * Propagates the banner's variant and action size to `Banner.Action`
 * children so each CTA can self-style without prop drilling:
 * - `variant` — selects the matching accent color.
 * - `size` — a compact `size="sm"` banner renders actions at `"xs"`, and a
 *   `"base"` banner renders them at `"sm"`.
 *
 * The `Banner` root always overrides these defaults via a Provider; the literals
 * mirror a default, base-size banner (kept as literals to avoid a runtime import
 * cycle with `banner.tsx`).
 */
export declare const BannerActionContext: import("react").Context<BannerActionContextValue>;
type WithBannerActionVariants<Props> = Props extends unknown ? Omit<Props, "size" | "variant"> & {
    /**
     * Visual variant of the CTA, aligned with `Button`'s `variant` naming.
     * - `"primary"` — filled accent gradient for the main action (default).
     * - `"secondary"` — transparent with an accent-hued outline matching the banner.
     * - `"ghost"` — text-only accent action with a faint accent-tinted hover.
     * @default "primary"
     */
    variant?: BannerActionVariant;
} : never;
type BannerActionButtonProps = WithBannerActionVariants<ButtonProps> & {
    href?: never;
};
type BannerActionLinkProps = WithBannerActionVariants<LinkButtonProps> & {
    /**
     * Renders the action as a link via `LinkButton`, so it uses the app's
     * `LinkProvider` component for client-side routing.
     */
    href: string;
};
/** Props for {@link BannerAction}. Pass `href` to render a link. */
export type BannerActionProps = BannerActionButtonProps | BannerActionLinkProps;
/**
 * A banner CTA built on Kumo's `Button`, or `LinkButton` when `href` is set. It
 * inherits their sizing, interaction, and accessibility behavior while supplying
 * banner-specific accent styles.
 *
 * @example
 * ```tsx
 * <Banner.Action onClick={retry}>Retry</Banner.Action>
 * <Banner.Action href="/billing">Manage payments</Banner.Action>
 * <Banner.Action variant="ghost" icon={<X />} aria-label="Dismiss" />
 * ```
 */
export declare const BannerAction: import("react").ForwardRefExoticComponent<BannerActionProps & import("react").RefAttributes<HTMLAnchorElement | HTMLButtonElement>>;
export {};
