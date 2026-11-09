import { type CSSProperties, type ComponentPropsWithoutRef, type ElementRef, type ForwardedRef } from "react";
/** Text variant and size definitions mapping names to their Tailwind classes. */
export declare const KUMO_TEXT_VARIANTS: {
    readonly variant: {
        readonly heading: {
            readonly classes: "text-lg font-semibold";
            readonly description: "Heading text (16px by default, 20px at large size)";
        };
        /** @deprecated Use `heading` and set `size` and `as` explicitly. */
        readonly heading1: {
            readonly classes: "text-3xl font-semibold";
            readonly description: "Deprecated large heading for page titles; use heading instead";
        };
        /** @deprecated Use `heading` and set `size` and `as` explicitly. */
        readonly heading2: {
            readonly classes: "text-2xl font-semibold";
            readonly description: "Deprecated medium heading for section titles; use heading instead";
        };
        /** @deprecated Use `heading` and set `size` and `as` explicitly. */
        readonly heading3: {
            readonly classes: "text-lg font-semibold";
            readonly description: "Deprecated small heading for subsections; use heading instead";
        };
        readonly body: {
            readonly classes: "text-zenth-default";
            readonly description: "Default body text";
        };
        readonly secondary: {
            readonly classes: "text-zenth-subtle";
            readonly description: "Muted text for secondary information";
        };
        readonly success: {
            readonly classes: "text-zenth-link";
            readonly description: "Success state text";
        };
        readonly error: {
            readonly classes: "text-zenth-danger";
            readonly description: "Error state text";
        };
        readonly mono: {
            readonly classes: "font-mono";
            readonly description: "Monospace text for code";
        };
        readonly "mono-secondary": {
            readonly classes: "font-mono text-zenth-subtle";
            readonly description: "Muted monospace text";
        };
    };
    readonly size: {
        readonly xs: {
            readonly classes: "text-xs/[inherit]";
            readonly description: "Extra small text";
        };
        readonly sm: {
            readonly classes: "text-sm/[inherit]";
            readonly description: "Small text";
        };
        readonly base: {
            readonly classes: "text-base/[inherit]";
            readonly description: "Default text size";
        };
        readonly lg: {
            readonly classes: "text-lg/[inherit]";
            readonly description: "Large text";
        };
    };
};
export declare const KUMO_TEXT_DEFAULT_VARIANTS: {
    readonly variant: "body";
    readonly size: "base";
};
/**
 * KUMO_TEXT_STYLING - Typography metadata for Figma generator
 *
 * This export provides structured styling information extracted from text.tsx
 * for use by the Figma plugin generator. It documents font sizes, weights,
 * colors, and font families used across all Text variants.
 *
 * Source of truth chain:
 * text.tsx (this file) → component-registry.json → text.ts (Figma generator)
 */
export declare const KUMO_TEXT_STYLING: {
    readonly fontSizes: {
        readonly xs: 12;
        readonly sm: 14;
        readonly base: 16;
        readonly lg: 18;
        readonly xl: 20;
        readonly "2xl": 24;
        readonly "3xl": 30;
    };
    readonly fontWeights: {
        readonly normal: 400;
        readonly medium: 500;
        readonly semibold: 600;
    };
    readonly baseColor: "text-zenth-default";
    readonly variantColors: {
        readonly body: "text-zenth-default";
        readonly secondary: "text-zenth-subtle";
        readonly success: "text-zenth-link";
        readonly error: "text-zenth-danger";
        readonly mono: "text-zenth-default";
        readonly "mono-secondary": "text-zenth-subtle";
    };
    readonly fontFamilies: {
        readonly default: "sans-serif";
        readonly mono: "monospace";
    };
};
export type KumoTextVariant = keyof typeof KUMO_TEXT_VARIANTS.variant;
export type KumoTextSize = keyof typeof KUMO_TEXT_VARIANTS.size;
type Heading = "heading";
type DeprecatedHeading = "heading1" | "heading2" | "heading3";
type Copy = "body" | "secondary" | "success" | "error";
type Monospace = "mono" | "mono-secondary";
type TextSize = KumoTextSize;
type TextVariant = KumoTextVariant;
export interface KumoTextVariantsProps {
    variant?: KumoTextVariant;
    size?: KumoTextSize;
}
export declare function textVariants({ variant, size, }?: KumoTextVariantsProps): string;
/** Valid HTML elements for the Text component's `as` prop. */
export type TextElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "label" | "dt" | "dd" | "li" | "figcaption" | "legend" | "pre" | "code" | "em" | "strong" | "small" | "abbr" | "time";
type BaseTextProps = Omit<ComponentPropsWithoutRef<"span">, "className" | "style"> & {
    DANGEROUS_className?: string;
    DANGEROUS_style?: CSSProperties;
};
type TextPropsInternal<Variant extends TextVariant = "body"> = BaseTextProps & (Variant extends Copy ? {
    variant?: Variant;
    bold?: boolean;
    size?: TextSize;
    truncate?: boolean;
    /** Optional element override. Defaults to `<p>`. */
    as?: TextElement;
} : Variant extends Monospace ? {
    variant?: Variant;
    bold?: never;
    size?: "lg";
    truncate?: boolean;
    /** Optional element override. Defaults to `<span>`. */
    as?: TextElement;
} : Variant extends Heading ? {
    variant: Variant;
    bold?: never;
    size?: "lg";
    truncate?: boolean;
    /**
     * Optional element override. Defaults to `<span>`. Pass the
     * appropriate heading element (`"h1"`–`"h6"`) when this text
     * belongs in the document outline.
     */
    as?: TextElement;
} : Variant extends DeprecatedHeading ? {
    variant: Variant;
    bold?: never;
    size?: never;
    truncate?: boolean;
    /**
     * Required for deprecated heading variants. Pick the element
     * that reflects this text's place in the document outline, or
     * `"span"` for decorative heading-styled text.
     */
    as: TextElement;
} : never);
/**
 * Text component props.
 *
 * @example
 * ```tsx
 * <Text variant="heading" size="lg" as="h1">Page Title</Text>
 * <Text variant="heading">Decorative heading text</Text>
 * <Text variant="body">Default paragraph text.</Text>
 * <Text variant="secondary" size="sm">Muted helper text</Text>
 * <Text variant="error">Something went wrong</Text>
 * <Text variant="mono">console.log("code")</Text>
 * ```
 */
export interface TextProps {
    /**
     * Text style variant. Determines color, font, and weight.
     * - `"heading"` — Heading text (16px by default, 20px with `size="lg"`; semibold)
     * - `"heading1"` — Deprecated; use `"heading"` (30px, semibold)
     * - `"heading2"` — Deprecated; use `"heading"` (24px, semibold)
     * - `"heading3"` — Deprecated; use `"heading"` (16px, semibold)
     * - `"body"` — Default body text
     * - `"secondary"` — Muted text for secondary information
     * - `"success"` — Success state text
     * - `"error"` — Error state text
     * - `"mono"` — Monospace text for code
     * - `"mono-secondary"` — Muted monospace text
     * @default "body"
     */
    variant?: KumoTextVariant;
    /**
     * Text size. Supported values depend on the variant:
     * - `"heading"` — 16px when omitted, or 20px with `"lg"`
     * - Body variants — `"xs"` (12px), `"sm"` (13px), `"base"` (14px),
     *   or `"lg"` (16px)
     * - Monospace variants — 13px when omitted, or 14px with `"lg"`
     * @default "base"
     */
    size?: KumoTextSize;
    /** Whether to use bold font weight (only applies to body variants). */
    bold?: boolean;
    /** Whether to truncate overflowing text with an ellipsis. Adds `truncate min-w-0` classes. */
    truncate?: boolean;
    /**
     * The HTML element to render. Accepts headings (`"h1"`–`"h6"`), block text
     * (`"p"`, `"pre"`), inline text (`"span"`, `"code"`, `"em"`, `"strong"`,
     * `"small"`, `"abbr"`, `"time"`), form-related (`"label"`, `"legend"`),
     * list/definition (`"dt"`, `"dd"`, `"li"`), and `"figcaption"`.
     *
     * - **Optional** for `"heading"` (defaults to `"span"`). Pass the heading
     *   element that reflects this text's place in the document outline.
     * - **Required** for deprecated heading variants (`"heading1"`,
     *   `"heading2"`, `"heading3"`).
     * - **Optional** for body variants (defaults to `"p"`) and monospace
     *   variants (defaults to `"span"`).
     */
    as?: TextElement;
    /** Text content. */
    children?: React.ReactNode;
}
export declare const Text: <Variant extends TextVariant = "body">(props: TextPropsInternal<Variant> & {
    ref?: ForwardedRef<ElementRef<"span">>;
}) => React.ReactElement;
export {};
