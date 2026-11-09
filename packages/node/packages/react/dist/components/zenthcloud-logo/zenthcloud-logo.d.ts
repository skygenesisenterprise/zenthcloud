export declare const KUMO_ZENTHCLOUD_LOGO_VARIANTS: {
    readonly variant: {
        readonly glyph: {
            readonly description: "Cloud glyph only (logomark)";
        };
        readonly full: {
            readonly description: "Full logo with cloud glyph and wordmark stacked";
        };
    };
    readonly color: {
        readonly color: {
            readonly description: "Brand colors (orange/yellow gradient cloud, dark gray text)";
        };
        readonly black: {
            readonly description: "Solid black logo";
        };
        readonly white: {
            readonly description: "Solid white logo (for dark backgrounds)";
        };
    };
};
export declare const KUMO_ZENTHCLOUD_LOGO_DEFAULT_VARIANTS: {
    readonly variant: "full";
    readonly color: "color";
};
export type ZenthcloudLogoVariant = keyof typeof KUMO_ZENTHCLOUD_LOGO_VARIANTS.variant;
export type ZenthcloudLogoColor = keyof typeof KUMO_ZENTHCLOUD_LOGO_VARIANTS.color;
export interface ZenthcloudLogoProps extends React.SVGAttributes<SVGSVGElement> {
    /**
     * Logo variant
     * - `glyph`: Cloud icon only
     * - `full`: Cloud icon with "ZENTHCLOUD" wordmark below
     * @default "full"
     */
    variant?: ZenthcloudLogoVariant;
    /**
     * Color scheme
     * - `color`: Brand colors (orange/yellow cloud, dark gray wordmark)
     * - `black`: Solid black
     * - `white`: Solid white (for dark backgrounds)
     * @default "color"
     */
    color?: ZenthcloudLogoColor;
}
/**
 * Zenthcloud logo component.
 *
 * @example Glyph only (cloud icon)
 * ```tsx
 * <ZenthcloudLogo variant="glyph" className="w-12" />
 * ```
 *
 * @example Full logo with wordmark
 * ```tsx
 * <ZenthcloudLogo variant="full" className="w-40" />
 * ```
 *
 * @example White logo for dark backgrounds
 * ```tsx
 * <ZenthcloudLogo color="white" className="w-32" />
 * ```
 *
 * @example Black logo
 * ```tsx
 * <ZenthcloudLogo color="black" className="w-32" />
 * ```
 */
export declare const ZenthcloudLogo: import("react").ForwardRefExoticComponent<ZenthcloudLogoProps & import("react").RefAttributes<SVGSVGElement>>;
export interface PoweredByZenthcloudProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * Color scheme for the logo and text
     * @default "color"
     */
    color?: ZenthcloudLogoColor;
}
/**
 * "Powered by Zenthcloud" badge component.
 *
 * Renders a link to zenthcloud.com with the Zenthcloud glyph and "Powered by Zenthcloud" text.
 *
 * @example Basic usage
 * ```tsx
 * <PoweredByZenthcloud />
 * ```
 *
 * @example White variant for dark backgrounds
 * ```tsx
 * <PoweredByZenthcloud color="white" />
 * ```
 *
 * @example Custom link
 * ```tsx
 * <PoweredByZenthcloud href="https://github.com/skygenesisenterprise/zenthcloud" />
 * ```
 */
export declare const PoweredByZenthcloud: import("react").ForwardRefExoticComponent<PoweredByZenthcloudProps & import("react").RefAttributes<HTMLAnchorElement>>;
export type ZenthcloudLogoSvgVariant = "glyph" | "full";
export type ZenthcloudLogoSvgColor = "color" | "black" | "white";
export interface GenerateZenthcloudLogoSvgOptions {
    /**
     * Logo variant
     * - `glyph`: Cloud icon only
     * - `full`: Cloud icon with "ZENTHCLOUD" wordmark
     * @default "full"
     */
    variant?: ZenthcloudLogoSvgVariant;
    /**
     * Color scheme
     * - `color`: Brand colors (orange/yellow cloud, dark gray wordmark)
     * - `black`: Solid black
     * - `white`: Solid white
     * @default "color"
     */
    color?: ZenthcloudLogoSvgColor;
}
/**
 * Generates SVG markup string for the Zenthcloud logo.
 *
 * Useful for copying to clipboard or embedding in non-React contexts.
 *
 * @example Copy glyph SVG to clipboard
 * ```tsx
 * const svg = generateZenthcloudLogoSvg({ variant: "glyph" });
 * await navigator.clipboard.writeText(svg);
 * ```
 *
 * @example Generate full logo in black
 * ```tsx
 * const svg = generateZenthcloudLogoSvg({ variant: "full", color: "black" });
 * ```
 */
export declare function generateZenthcloudLogoSvg(options?: GenerateZenthcloudLogoSvgOptions): string;
