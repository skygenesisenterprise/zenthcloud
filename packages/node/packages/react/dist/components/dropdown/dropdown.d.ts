import { Menu as DropdownMenuPrimitive } from "@base-ui/react/menu";
import * as React from "react";
import { type PortalContainer } from "../../utils/portal-provider";
import { type Icon } from "@phosphor-icons/react";
/** Dropdown item variant definitions (default and danger styles). */
export declare const KUMO_DROPDOWN_VARIANTS: {
    readonly variant: {
        readonly default: {
            readonly classes: "";
            readonly description: "Default dropdown item appearance";
        };
        readonly danger: {
            readonly classes: "text-zenth-danger data-highlighted:bg-zenth-danger/5 data-highlighted:text-zenth-danger";
            readonly description: "Destructive action item";
        };
    };
};
export declare const KUMO_DROPDOWN_DEFAULT_VARIANTS: {
    readonly variant: "default";
};
export type KumoDropdownVariant = keyof typeof KUMO_DROPDOWN_VARIANTS.variant;
export interface KumoDropdownVariantsProps {
    /**
     * Visual style of the dropdown item.
     * - `"default"` — Standard item appearance
     * - `"danger"` — Destructive action with red text
     * @default "default"
     */
    variant?: KumoDropdownVariant;
}
export declare function dropdownVariants({ variant, }?: KumoDropdownVariantsProps): string;
/**
 * DropdownMenuPortal — moves the menu popup to the end of the document body
 * (or the `KumoPortalProvider` container, if set).
 *
 * Only needed when composing `Positioner` and `Popup` yourself; `Content` and
 * `SubContent` include it.
 */
declare function DropdownMenuPortal({ container: containerProp, ...props }: Omit<React.ComponentProps<typeof DropdownMenuPrimitive.Portal>, "container"> & {
    /**
     * Container element for the portal. Use this to render the dropdown inside
     * a Shadow DOM or custom container. Overrides `KumoPortalProvider` context.
     * @default document.body (or KumoPortalProvider container if set)
     */
    container?: PortalContainer;
}): import("react/jsx-runtime").JSX.Element;
declare const DropdownMenuShortcut: {
    ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
/**
 * DropdownMenu — accessible dropdown menu anchored to a trigger.
 *
 * Compound component: `DropdownMenu` (Root), `.Trigger`, `.Content`, `.Item`,
 * `.LinkItem`, `.CheckboxItem`, `.RadioGroup`, `.RadioItem`, `.RadioItemIndicator`,
 * `.Sub`, `.SubTrigger`, `.SubContent`, `.Label`, `.Separator`, `.Shortcut`, `.Group`.
 * `.Content` and `.SubContent` combine `.Portal`, `.Positioner` and `.Popup`,
 * which can also be composed directly.
 *
 * Built on `@base-ui/react/menu`.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenu.Trigger>
 *     <Button>Actions</Button>
 *   </DropdownMenu.Trigger>
 *   <DropdownMenu.Content>
 *     <DropdownMenu.Item>Edit</DropdownMenu.Item>
 *     <DropdownMenu.Item icon={CopyIcon}>Duplicate</DropdownMenu.Item>
 *     <DropdownMenu.LinkItem href="/settings" icon={GearIcon}>Settings</DropdownMenu.LinkItem>
 *     <DropdownMenu.Separator />
 *     <DropdownMenu.Item variant="danger">Delete</DropdownMenu.Item>
 *   </DropdownMenu.Content>
 * </DropdownMenu>
 * ```
 *
 * @see https://base-ui.com/react/components/menu
 */
export declare const DropdownMenu: typeof DropdownMenuPrimitive.Root & {
    Trigger: React.ForwardRefExoticComponent<Omit<import("@base-ui/react").MenuTriggerProps<unknown> & React.RefAttributes<HTMLElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
    Portal: typeof DropdownMenuPortal;
    Positioner: React.ForwardRefExoticComponent<Omit<Omit<import("@base-ui/react").MenuPositionerProps, "ref"> & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Popup: React.ForwardRefExoticComponent<Omit<Omit<Omit<import("@base-ui/react").MenuPopupProps, "ref"> & React.RefAttributes<HTMLDivElement>, "ref">, "className"> & {
        className?: string;
    } & React.RefAttributes<HTMLDivElement>>;
    Sub: typeof DropdownMenuPrimitive.SubmenuRoot;
    SubTrigger: React.ForwardRefExoticComponent<Omit<Omit<import("@base-ui/react").MenuSubmenuTriggerProps, "ref"> & React.RefAttributes<HTMLElement>, "ref"> & {
        inset?: boolean;
        icon?: Icon | React.ReactNode;
    } & React.RefAttributes<HTMLElement>>;
    SubContent: React.ForwardRefExoticComponent<Omit<Omit<Omit<import("@base-ui/react").MenuPositionerProps, "ref"> & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>, "ref"> & {
        /**
         * Container element for the portal. Use this to render the dropdown inside
         * a Shadow DOM or custom container. Overrides `KumoPortalProvider` context.
         * @default document.body (or KumoPortalProvider container if set)
         */
        container?: PortalContainer;
        /** Classes for the popup surface. */
        className?: string;
    } & React.RefAttributes<HTMLDivElement>>;
    Content: React.ForwardRefExoticComponent<Omit<Omit<Omit<import("@base-ui/react").MenuPositionerProps, "ref"> & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>, "ref"> & {
        /**
         * Container element for the portal. Use this to render the dropdown inside
         * a Shadow DOM or custom container. Overrides `KumoPortalProvider` context.
         * @default document.body (or KumoPortalProvider container if set)
         */
        container?: PortalContainer;
        /** Classes for the popup surface. */
        className?: string;
    } & React.RefAttributes<HTMLDivElement>>;
    Item: React.ForwardRefExoticComponent<Omit<Omit<import("@base-ui/react").MenuItemProps, "ref"> & React.RefAttributes<HTMLElement>, "ref"> & {
        inset?: boolean;
        icon?: Icon | React.ReactNode;
        selected?: boolean;
        /**
         * @deprecated Use `DropdownMenu.LinkItem` instead for navigation links.
         * This prop will be removed in a future major version.
         */
        href?: string;
        variant?: "default" | "danger";
    } & React.RefAttributes<HTMLElement>>;
    LinkItem: React.ForwardRefExoticComponent<Omit<Omit<import("@base-ui/react").MenuLinkItemProps, "ref"> & React.RefAttributes<Element>, "ref"> & {
        inset?: boolean;
        icon?: Icon | React.ReactNode;
        variant?: "default" | "danger";
    } & React.RefAttributes<Element>>;
    CheckboxItem: React.ForwardRefExoticComponent<Omit<Omit<import("@base-ui/react").MenuCheckboxItemProps, "ref"> & React.RefAttributes<HTMLElement>, "ref"> & React.RefAttributes<HTMLElement>>;
    RadioGroup: React.NamedExoticComponent<Omit<import("@base-ui/react").MenuRadioGroupProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
    RadioItem: React.ForwardRefExoticComponent<Omit<Omit<import("@base-ui/react").MenuRadioItemProps, "ref"> & React.RefAttributes<HTMLElement>, "ref"> & {
        inset?: boolean;
        icon?: Icon | React.ReactNode;
    } & React.RefAttributes<HTMLElement>>;
    RadioItemIndicator: React.ForwardRefExoticComponent<Omit<Omit<import("@base-ui/react").MenuRadioItemIndicatorProps, "ref"> & React.RefAttributes<HTMLSpanElement>, "ref"> & React.RefAttributes<HTMLSpanElement>>;
    Label: React.ForwardRefExoticComponent<Omit<Omit<import("@base-ui/react").MenuGroupLabelProps, "ref"> & React.RefAttributes<HTMLDivElement>, "ref"> & {
        inset?: boolean;
    } & React.RefAttributes<HTMLDivElement>>;
    Separator: React.ForwardRefExoticComponent<Omit<Omit<import("@base-ui/react").SeparatorProps, "ref"> & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Shortcut: typeof DropdownMenuShortcut;
    Group: React.ForwardRefExoticComponent<Omit<import("@base-ui/react").MenuGroupProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
};
export {};
