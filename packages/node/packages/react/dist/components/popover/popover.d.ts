import { Popover as PopoverBase } from "@base-ui/react/popover";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { type PortalContainer } from "../../utils/portal-provider";
/** Popover side variant definitions mapping positions to their Tailwind classes. */
export declare const KUMO_POPOVER_VARIANTS: {
    readonly side: {
        readonly top: {
            readonly classes: "";
            readonly description: "Popover appears above the trigger";
        };
        readonly bottom: {
            readonly classes: "";
            readonly description: "Popover appears below the trigger";
        };
        readonly left: {
            readonly classes: "";
            readonly description: "Popover appears to the left of the trigger";
        };
        readonly right: {
            readonly classes: "";
            readonly description: "Popover appears to the right of the trigger";
        };
    };
};
export declare const KUMO_POPOVER_DEFAULT_VARIANTS: {
    readonly side: "bottom";
};
export type KumoPopoverSide = keyof typeof KUMO_POPOVER_VARIANTS.side;
export interface KumoPopoverVariantsProps {
    /**
     * Which side of the trigger the popover appears on.
     * - `"top"` — Above the trigger
     * - `"bottom"` — Below the trigger
     * - `"left"` — Left of the trigger
     * - `"right"` — Right of the trigger
     * @default "bottom"
     */
    side?: KumoPopoverSide;
}
type BasePopoverRootProps = ComponentPropsWithoutRef<typeof PopoverBase.Root>;
export type PopoverRootProps = BasePopoverRootProps;
declare function PopoverRoot({ children, ...props }: PopoverRootProps): import("react/jsx-runtime").JSX.Element;
declare namespace PopoverRoot {
    var displayName: string;
}
type BasePopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverBase.Trigger>;
export type PopoverTriggerProps = BasePopoverTriggerProps & {
    /**
     * @deprecated Use the `render` prop instead.
     * @example `<Popover.Trigger render={<Button />}>Open</Popover.Trigger>` instead of `<Popover.Trigger asChild><Button>Open</Button></Popover.Trigger>`
     */
    asChild?: boolean;
};
declare function PopoverTrigger({ children, className, asChild, render, ...props }: PopoverTriggerProps): import("react/jsx-runtime").JSX.Element;
declare namespace PopoverTrigger {
    var displayName: string;
}
type BasePopoverPortalProps = ComponentPropsWithoutRef<typeof PopoverBase.Portal>;
export type PopoverPortalProps = Omit<BasePopoverPortalProps, "container"> & {
    /**
     * Container element for the portal. Use this to render the popover inside
     * a Shadow DOM or custom container. Overrides `KumoPortalProvider` context.
     * @default document.body (or KumoPortalProvider container if set)
     */
    container?: PortalContainer;
};
declare function PopoverPortal({ container: containerProp, ...props }: PopoverPortalProps): import("react/jsx-runtime").JSX.Element;
declare namespace PopoverPortal {
    var displayName: string;
}
type BasePopoverBackdropProps = ComponentPropsWithoutRef<typeof PopoverBase.Backdrop>;
export type PopoverBackdropProps = BasePopoverBackdropProps;
declare function PopoverBackdrop(props: PopoverBackdropProps): import("react/jsx-runtime").JSX.Element;
declare namespace PopoverBackdrop {
    var displayName: string;
}
type BasePopoverPositionerProps = ComponentPropsWithoutRef<typeof PopoverBase.Positioner>;
export type PopoverPositionerProps = BasePopoverPositionerProps;
declare function PopoverPositioner({ side, sideOffset, ...props }: PopoverPositionerProps): import("react/jsx-runtime").JSX.Element;
declare namespace PopoverPositioner {
    var displayName: string;
}
type BasePopoverPopupProps = ComponentPropsWithoutRef<typeof PopoverBase.Popup>;
export type PopoverPopupProps = BasePopoverPopupProps;
declare function PopoverPopup({ className, ...props }: PopoverPopupProps): import("react/jsx-runtime").JSX.Element;
declare namespace PopoverPopup {
    var displayName: string;
}
type BasePopoverArrowProps = ComponentPropsWithoutRef<typeof PopoverBase.Arrow>;
export type PopoverArrowProps = BasePopoverArrowProps;
declare function PopoverArrow({ className, children, ...props }: PopoverArrowProps): import("react/jsx-runtime").JSX.Element;
declare namespace PopoverArrow {
    var displayName: string;
}
type BasePopoverViewportProps = ComponentPropsWithoutRef<typeof PopoverBase.Viewport>;
export type PopoverViewportProps = BasePopoverViewportProps;
declare function PopoverViewport(props: PopoverViewportProps): import("react/jsx-runtime").JSX.Element;
declare namespace PopoverViewport {
    var displayName: string;
}
/** Alignment options for popover positioning */
type PopoverAlign = "start" | "center" | "end";
/**
 * Popover content panel props.
 *
 * @deprecated Prefer composing `Popover.Portal`, `Popover.Positioner`,
 * `Popover.Popup`, and `Popover.Arrow` to match Base UI's structure.
 *
 * @example
 * ```tsx
 * <Popover.Content side="top" align="start" sideOffset={12}>
 *   <p>Popover body</p>
 * </Popover.Content>
 * ```
 */
export type PopoverContentProps = KumoPopoverVariantsProps & {
    /**
     * An element to position the popup against.
     * By default, the popup will be positioned against the trigger.
     *
     * Accepts a DOM element, a ref to a DOM element, a virtual element
     * (object with a `getBoundingClientRect` method), or a function
     * returning any of these.
     *
     * This is useful when the popover trigger and the desired anchor point
     * are in different component trees, or when positioning against a
     * coordinate (e.g., a `DOMRect` from `getBoundingClientRect()`).
     *
     * @example Virtual element (e.g., anchoring to a DOMRect)
     * ```tsx
     * <Popover open={open} onOpenChange={setOpen}>
     *   <Popover.Content anchor={{ getBoundingClientRect: () => anchorRect }}>
     *     <p>Anchored content</p>
     *   </Popover.Content>
     * </Popover>
     * ```
     */
    anchor?: BasePopoverPositionerProps["anchor"];
    /**
     * How to align the popover relative to the trigger.
     * @default "center"
     */
    align?: PopoverAlign;
    /**
     * Distance between the trigger and the popover in pixels.
     * @default 8
     */
    sideOffset?: number;
    /**
     * Additional offset along the alignment axis in pixels.
     * @default 0
     */
    alignOffset?: number;
    /**
     * Determines which CSS `position` property to use.
     * Use "fixed" when the popover needs to escape stacking contexts (e.g., inside sticky headers).
     * @default "absolute"
     */
    positionMethod?: "absolute" | "fixed";
    /** Additional CSS classes merged via `cn()`. */
    className?: string;
    /** Content to render inside the popover. */
    children?: ReactNode;
    /**
     * Container element for the portal. Use this to render the popover inside
     * a Shadow DOM or custom container. Overrides `KumoPortalProvider` context.
     * @default document.body (or KumoPortalProvider container if set)
     */
    container?: PortalContainer;
};
declare function PopoverContent({ children, side, align, sideOffset, alignOffset, positionMethod, anchor, className, container: containerProp, }: PopoverContentProps): import("react/jsx-runtime").JSX.Element;
declare namespace PopoverContent {
    var displayName: string;
}
type BasePopoverTitleProps = ComponentPropsWithoutRef<typeof PopoverBase.Title>;
export type PopoverTitleProps = BasePopoverTitleProps;
declare function PopoverTitle({ className, ...props }: PopoverTitleProps): import("react/jsx-runtime").JSX.Element;
declare namespace PopoverTitle {
    var displayName: string;
}
type BasePopoverDescriptionProps = ComponentPropsWithoutRef<typeof PopoverBase.Description>;
export type PopoverDescriptionProps = BasePopoverDescriptionProps;
declare function PopoverDescription({ className, ...props }: PopoverDescriptionProps): import("react/jsx-runtime").JSX.Element;
declare namespace PopoverDescription {
    var displayName: string;
}
type BasePopoverCloseProps = ComponentPropsWithoutRef<typeof PopoverBase.Close>;
export type PopoverCloseProps = BasePopoverCloseProps & {
    /**
     * @deprecated Use the `render` prop instead.
     * @example `<Popover.Close render={<Button />}>Close</Popover.Close>` instead of `<Popover.Close asChild><Button>Close</Button></Popover.Close>`
     */
    asChild?: boolean;
};
declare function PopoverClose({ children, className, asChild, render, ...props }: PopoverCloseProps): import("react/jsx-runtime").JSX.Element;
declare namespace PopoverClose {
    var displayName: string;
}
/**
 * Popover component for displaying accessible popup content anchored to a trigger.
 *
 * @example
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger render={<Button>Open</Button>} />
 *   <Popover.Portal>
 *     <Popover.Positioner>
 *       <Popover.Popup>
 *         <Popover.Arrow />
 *         <Popover.Title>Notifications</Popover.Title>
 *         <Popover.Description>You are all caught up!</Popover.Description>
 *       </Popover.Popup>
 *     </Popover.Positioner>
 *   </Popover.Portal>
 * </Popover.Root>
 * ```
 *
 * @see https://base-ui.com/react/components/popover
 */
export declare const Popover: typeof PopoverRoot & {
    Root: typeof PopoverRoot;
    Trigger: typeof PopoverTrigger;
    Portal: typeof PopoverPortal;
    Backdrop: typeof PopoverBackdrop;
    Positioner: typeof PopoverPositioner;
    Popup: typeof PopoverPopup;
    Arrow: typeof PopoverArrow;
    Viewport: typeof PopoverViewport;
    Content: typeof PopoverContent;
    Title: typeof PopoverTitle;
    Description: typeof PopoverDescription;
    Close: typeof PopoverClose;
};
export { PopoverRoot, PopoverTrigger, PopoverPortal, PopoverBackdrop, PopoverPositioner, PopoverPopup, PopoverArrow, PopoverViewport, PopoverContent, PopoverTitle, PopoverDescription, PopoverClose, };
