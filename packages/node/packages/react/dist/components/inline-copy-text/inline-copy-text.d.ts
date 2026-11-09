import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { type KumoTextSize, type KumoTextVariant, type TextProps } from "../text/text";
/**
 * InlineCopyText has no visual variants. The required exports are kept for the
 * Kumo variant standard.
 */
export declare const KUMO_INLINE_COPY_TEXT_VARIANTS: {};
export declare const KUMO_INLINE_COPY_TEXT_DEFAULT_VARIANTS: {};
/** Base classes shared by every InlineCopyText. */
export declare const KUMO_INLINE_COPY_TEXT_STYLING: {
    readonly baseClasses: "group/inline-copy flex min-w-0 max-w-full cursor-pointer items-center gap-1 rounded-xs border-0 bg-transparent p-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-zenth-brand";
};
export interface InlineCopyTextLabels {
    /** Accessible name before the text is copied. @default "Copy to clipboard" */
    copyAction?: string;
    /** Accessible name and live-region message after copying. @default "Copied" */
    copied?: string;
}
type InlineCopyTextHeadingVariant = Extract<KumoTextVariant, `heading${string}`>;
type InlineCopyTextVariant = Exclude<KumoTextVariant, InlineCopyTextHeadingVariant>;
type InlineCopyTextCopyVariant = Exclude<InlineCopyTextVariant, "mono" | "mono-secondary">;
type InlineCopyTextMonospaceVariant = Extract<InlineCopyTextVariant, "mono" | "mono-secondary">;
type InlineCopyTextSharedTextProps = Pick<TextProps, "as" | "truncate">;
type InlineCopyTextTextProps = (InlineCopyTextSharedTextProps & {
    variant: InlineCopyTextCopyVariant;
    size?: KumoTextSize;
    bold?: boolean;
}) | (InlineCopyTextSharedTextProps & {
    /** @default "mono-secondary" */
    variant?: InlineCopyTextMonospaceVariant;
    size?: "lg";
    bold?: never;
});
type InlineCopyTextContentProps = {
    /** Text content to display. Its value is copied unless `value` is provided. */
    children: string;
    /** The value to copy. Defaults to `children` when `children` is a string. */
    value?: string;
} | {
    /** Rich content to display. */
    children: Exclude<ReactNode, string>;
    /** The value to copy. Required when `children` is not a string. */
    value: string;
};
/**
 * InlineCopyText component props.
 *
 * @example
 * ```tsx
 * <InlineCopyText
 *   labels={{ copyAction: "Copy database ID", copied: "Copied" }}
 * >
 *   0c239dd2
 * </InlineCopyText>
 * ```
 */
export type InlineCopyTextProps = Omit<ComponentPropsWithoutRef<"button">, "children" | "onCopy" | "value"> & InlineCopyTextTextProps & InlineCopyTextContentProps & {
    /** Callback fired after text is copied successfully. */
    onCopy?: () => void;
    /** Accessible labels for localization. */
    labels?: InlineCopyTextLabels;
};
/**
 * Compact, borderless copy control for IDs and other short values displayed
 * inline or inside dense table cells.
 *
 * The copy icon appears when the control is hovered or focused. It also
 * responds to an enclosing unnamed Tailwind `group`, allowing table rows to
 * reveal the icon when the row is hovered. After a successful copy, the icon
 * changes to a checkmark and the copied message is announced.
 */
export declare const InlineCopyText: import("react").ForwardRefExoticComponent<InlineCopyTextProps & import("react").RefAttributes<HTMLButtonElement>>;
export {};
