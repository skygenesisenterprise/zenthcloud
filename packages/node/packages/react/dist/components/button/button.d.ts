import React from "react";
import { type Icon } from "@phosphor-icons/react";
/** Button variant definitions mapping shape, size, and variant names to their Tailwind classes. */
export declare const KUMO_BUTTON_VARIANTS: {
    readonly shape: {
        readonly base: {
            readonly classes: "";
            readonly description: "Default rectangular button shape";
        };
        readonly square: {
            readonly classes: "items-center justify-center p-0";
            readonly description: "Square button for icon-only actions";
        };
        readonly circle: {
            readonly classes: "items-center justify-center p-0 rounded-full";
            readonly description: "Circular button for icon-only actions";
        };
    };
    readonly size: {
        readonly xs: {
            readonly classes: "h-5 gap-1 rounded-sm px-1.5 text-xs";
            readonly description: "Extra small button for compact UIs";
        };
        readonly sm: {
            readonly classes: "h-6.5 gap-1 rounded-md px-2 text-xs";
            readonly description: "Small button for secondary actions";
        };
        readonly base: {
            readonly classes: "h-9 gap-1.5 rounded-lg px-3 text-base";
            readonly description: "Default button size";
        };
        readonly lg: {
            readonly classes: "h-10 gap-2 rounded-lg px-4 text-base";
            readonly description: "Large button for primary CTAs";
        };
    };
    readonly compactSize: {
        readonly xs: {
            readonly classes: "size-3.5";
        };
        readonly sm: {
            readonly classes: "size-6.5";
        };
        readonly base: {
            readonly classes: "size-9";
        };
        readonly lg: {
            readonly classes: "size-10";
        };
    };
    readonly variant: {
        readonly primary: {
            readonly classes: "relative overflow-hidden bg-(--zenth-button-emphasis-bg) !text-white ring ring-(--zenth-button-emphasis-ring) focus:ring-(--zenth-button-emphasis-ring) focus-visible:ring-(--zenth-button-emphasis-ring) active:ring-(--zenth-button-emphasis-ring) disabled:opacity-50";
            readonly description: "High-emphasis button for primary actions";
        };
        readonly secondary: {
            readonly classes: "bg-zenth-base !text-zenth-default ring not-disabled:hover:bg-zenth-tint disabled:bg-zenth-base/50 disabled:!text-zenth-default/70 ring-zenth-line data-[state=open]:bg-zenth-base";
            readonly description: "Default button style for most actions";
        };
        readonly ghost: {
            readonly classes: "text-zenth-default hover:bg-zenth-tint shadow-none bg-inherit";
            readonly description: "Minimal button with no background";
        };
        readonly destructive: {
            readonly classes: "relative overflow-hidden bg-(--zenth-button-emphasis-bg) !text-white ring ring-(--zenth-button-emphasis-ring) focus:ring-(--zenth-button-emphasis-ring) focus-visible:ring-(--zenth-button-emphasis-ring) active:ring-(--zenth-button-emphasis-ring) disabled:opacity-50";
            readonly description: "Danger button for destructive actions like delete";
        };
        readonly "secondary-destructive": {
            readonly classes: "bg-zenth-base !text-zenth-danger ring not-disabled:hover:!text-zenth-danger not-disabled:hover:ring-zenth-danger/30 disabled:bg-zenth-base/50 disabled:!text-zenth-danger/70 ring-zenth-line data-[state=open]:bg-zenth-base";
            readonly description: "Secondary button with destructive text for less prominent dangerous actions";
        };
        readonly outline: {
            readonly classes: "bg-transparent text-zenth-default ring ring-zenth-line transition-colors not-disabled:hover:text-zenth-strong not-disabled:hover:ring-zenth-focus/25";
            readonly description: "Bordered button with transparent background";
        };
    };
};
export declare const KUMO_BUTTON_DEFAULT_VARIANTS: {
    readonly shape: "base";
    readonly size: "base";
    readonly variant: "secondary";
};
export type KumoButtonShape = keyof typeof KUMO_BUTTON_VARIANTS.shape;
export type KumoButtonSize = keyof typeof KUMO_BUTTON_VARIANTS.size;
export type KumoButtonVariant = keyof typeof KUMO_BUTTON_VARIANTS.variant;
export interface KumoButtonVariantsProps {
    /**
     * Button shape.
     * - `"base"` — Default rectangular button
     * - `"square"` — Square button for icon-only actions
     * - `"circle"` — Circular button for icon-only actions
     * @default "base"
     */
    shape?: KumoButtonShape;
    /**
     * Button size.
     * - `"xs"` — Extra small for compact UIs
     * - `"sm"` — Small for secondary actions
     * - `"base"` — Default size
     * - `"lg"` — Large for primary CTAs
     * @default "base"
     */
    size?: KumoButtonSize;
    /**
     * Visual style of the button.
     * - `"primary"` — High-emphasis, brand-colored for primary actions
     * - `"secondary"` — Default style with border for most actions
     * - `"ghost"` — Minimal, no background for tertiary actions
     * - `"destructive"` — Danger button for destructive actions
     * - `"secondary-destructive"` — Secondary style with destructive text
     * - `"outline"` — Bordered with transparent background
     * @default "secondary"
     */
    variant?: KumoButtonVariant;
}
export declare function buttonVariants({ variant, size, shape, }?: KumoButtonVariantsProps): string;
/**
 * Button component props.
 *
 * Uses a discriminated union on `shape` so that icon-only buttons
 * (`shape="square"` or `shape="circle"`) require an accessible name.
 *
 * @example
 * ```tsx
 * <Button variant="primary">Save</Button>
 * <Button variant="secondary" shape="square" icon={PlusIcon} aria-label="Add" />
 * <Button variant="destructive" loading>Deleting...</Button>
 * ```
 */
type ButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Content rendered inside the button. */
    children?: React.ReactNode;
    /** Additional CSS classes merged via `cn()`. */
    className?: string;
    /** Icon from `@phosphor-icons/react` or a React element. Rendered before children. */
    icon?: Icon | React.ReactNode;
    /** Shows a loading spinner and disables interaction. */
    loading?: boolean;
    /** When set, wraps the button in a Tooltip with this content. */
    title?: React.ReactNode;
};
type ButtonWithTextProps = ButtonBaseProps & {
    shape?: "base";
    size?: KumoButtonSize;
    variant?: KumoButtonVariant;
};
type IconOnlyButtonAccessibleNameProps = {
    /** Required for icon-only buttons to provide an accessible label for screen readers. */
    "aria-label": string;
    "aria-labelledby"?: string;
} | {
    "aria-label"?: string;
    /** References an element that provides the accessible label for screen readers. */
    "aria-labelledby": string;
} | {
    /** Used as tooltip content and as a fallback accessible label when no children are provided. */
    title: string | number;
    "aria-label"?: string;
    "aria-labelledby"?: string;
};
type IconOnlyButtonProps = ButtonBaseProps & IconOnlyButtonAccessibleNameProps & {
    shape: "square" | "circle";
    size?: KumoButtonSize;
    variant?: KumoButtonVariant;
};
export type ButtonProps = ButtonWithTextProps | IconOnlyButtonProps;
export type RefreshButtonProps = Omit<IconOnlyButtonProps, "children" | "icon" | "shape">;
/**
 * LinkButton component props — renders an anchor styled as a button.
 *
 * @example
 * ```tsx
 * <LinkButton href="/docs" variant="ghost" icon={BookIcon}>Docs</LinkButton>
 * <LinkButton href="https://example.com" external>Visit Site</LinkButton>
 * ```
 */
export type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & KumoButtonVariantsProps & {
    /** Content rendered inside the link button. */
    children?: React.ReactNode;
    /** Additional CSS classes merged via `cn()`. */
    className?: string;
    /** When `true`, the button is disabled. We render an actual html button with `disabled` attribute. */
    disabled?: boolean;
    /** Icon from `@phosphor-icons/react` or a React element. Rendered before children. */
    icon?: Icon | React.ReactNode;
    /** When `true`, opens in a new tab with `rel="noopener noreferrer"`. */
    external?: boolean;
    linksExternal?: boolean;
};
/**
 * Primary action trigger. Supports multiple variants, sizes, shapes, icons, and loading state.
 *
 * @example
 * ```tsx
 * <Button variant="primary">Save</Button>
 * <Button variant="secondary" icon={PlusIcon}>Create Worker</Button>
 * ```
 */
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
/**
 * Square button with a rotating arrows icon, used to trigger data refresh actions.
 *
 * @example
 * ```tsx
 * <RefreshButton loading={isRefreshing} onClick={refresh} />
 * ```
 */
export declare const RefreshButton: ({ "aria-label": ariaLabel, loading, ...props }: RefreshButtonProps) => import("react/jsx-runtime").JSX.Element;
/**
 * Anchor element styled as a button. Integrates with `LinkProvider` for framework routing.
 *
 * @example
 * ```tsx
 * <LinkButton href="/settings" variant="ghost">Settings</LinkButton>
 * ```
 */
export declare const LinkButton: React.ForwardRefExoticComponent<React.AnchorHTMLAttributes<HTMLAnchorElement> & KumoButtonVariantsProps & {
    /** Content rendered inside the link button. */
    children?: React.ReactNode;
    /** Additional CSS classes merged via `cn()`. */
    className?: string;
    /** When `true`, the button is disabled. We render an actual html button with `disabled` attribute. */
    disabled?: boolean;
    /** Icon from `@phosphor-icons/react` or a React element. Rendered before children. */
    icon?: Icon | React.ReactNode;
    /** When `true`, opens in a new tab with `rel="noopener noreferrer"`. */
    external?: boolean;
    linksExternal?: boolean;
} & React.RefAttributes<HTMLAnchorElement>>;
export {};
