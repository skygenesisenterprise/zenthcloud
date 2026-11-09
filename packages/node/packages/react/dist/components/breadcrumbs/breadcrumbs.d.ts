import { type PropsWithChildren } from "react";
/** Breadcrumbs size variant definitions. */
export declare const KUMO_BREADCRUMBS_VARIANTS: {
    readonly size: {
        readonly sm: {
            readonly classes: "text-sm h-10 gap-0.5";
            readonly description: "Compact breadcrumbs for dense UIs";
        };
        readonly base: {
            readonly classes: "text-base h-12 gap-1";
            readonly description: "Default breadcrumbs size";
        };
    };
};
export declare const KUMO_BREADCRUMBS_DEFAULT_VARIANTS: {
    readonly size: "base";
};
export type KumoBreadcrumbsSize = keyof typeof KUMO_BREADCRUMBS_VARIANTS.size;
export interface KumoBreadcrumbsVariantsProps {
    /**
     * Size of the breadcrumbs.
     * - `"sm"` — Compact breadcrumbs for dense UIs
     * - `"base"` — Default breadcrumbs size
     * @default "base"
     */
    size?: KumoBreadcrumbsSize;
}
export declare function breadcrumbsVariants({ size, }?: KumoBreadcrumbsVariantsProps): string;
export interface BreadcrumbsItemProps {
    href: string;
    icon?: React.ReactNode;
}
declare const Link: ({ href, icon, children, }: PropsWithChildren<BreadcrumbsItemProps>) => import("react/jsx-runtime").JSX.Element;
interface BreadcrumbsCurrentProps {
    loading?: boolean;
    icon?: React.ReactNode;
}
declare function Current({ children, icon, loading, }: PropsWithChildren<BreadcrumbsCurrentProps>): import("react/jsx-runtime").JSX.Element;
declare function Separator(): import("react/jsx-runtime").JSX.Element;
declare function Clipboard({ text }: {
    text: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Breadcrumbs component props.
 *
 * @example
 * ```tsx
 * <Breadcrumbs>
 *   <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
 *   <Breadcrumbs.Separator />
 *   <Breadcrumbs.Link href="/docs">Docs</Breadcrumbs.Link>
 *   <Breadcrumbs.Separator />
 *   <Breadcrumbs.Current>Current Page</Breadcrumbs.Current>
 * </Breadcrumbs>
 * ```
 */
export interface BreadcrumbsProps extends PropsWithChildren, KumoBreadcrumbsVariantsProps {
    /** Additional CSS classes merged via `cn()`. */
    className?: string;
}
/**
 * Navigation breadcrumb trail showing the current page's location in a hierarchy.
 * Compound component with `Breadcrumbs.Link`, `Breadcrumbs.Current`, `Breadcrumbs.Separator`, and `Breadcrumbs.Clipboard`.
 *
 * @example
 * ```tsx
 * <Breadcrumbs>
 *   <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
 *   <Breadcrumbs.Separator />
 *   <Breadcrumbs.Current>Dashboard</Breadcrumbs.Current>
 * </Breadcrumbs>
 * ```
 */
export declare function Breadcrumb({ children, size, className, }: BreadcrumbsProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Breadcrumb {
    export { Link };
    export { Current };
    export { Separator };
    export { Clipboard };
}
export {};
