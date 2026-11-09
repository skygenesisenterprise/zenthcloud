import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Drawer as DrawerBase } from "@base-ui/react/drawer";
import { type PortalContainer } from "../../utils/portal-provider";
export declare const KUMO_LAYER_DIALOG_VARIANTS: {
    readonly size: {
        readonly sm: {
            readonly classes: "sm:max-w-md";
            readonly description: "Compact desktop dialog width (448px)";
        };
        readonly base: {
            readonly classes: "sm:max-w-xl";
            readonly description: "Default desktop dialog width (576px)";
        };
        readonly lg: {
            readonly classes: "sm:max-w-2xl";
            readonly description: "Large desktop dialog width (672px)";
        };
        readonly xl: {
            readonly classes: "sm:max-w-3xl";
            readonly description: "Extra large desktop dialog width (768px)";
        };
    };
    readonly verticalAlign: {
        readonly top: {
            readonly classes: "sm:items-start sm:pt-16 sm:pb-6";
            readonly description: "Align the desktop dialog near the top of the viewport";
        };
        readonly center: {
            readonly classes: "sm:items-center sm:py-6";
            readonly description: "Center the desktop dialog vertically";
        };
    };
};
export declare const KUMO_LAYER_DIALOG_DEFAULT_VARIANTS: {
    readonly size: "base";
    readonly verticalAlign: "center";
};
export type KumoLayerDialogSize = keyof typeof KUMO_LAYER_DIALOG_VARIANTS.size;
export type KumoLayerDialogVerticalAlign = keyof typeof KUMO_LAYER_DIALOG_VARIANTS.verticalAlign;
type RootProps = ComponentPropsWithoutRef<typeof DrawerBase.Root>;
export type LayerDialogRootProps = RootProps & {
    /** Prevent every user-initiated dismissal while dialog work is pending. */
    dismissDisabled?: boolean;
};
/** Props for `LayerDialog` / `LayerDialog.Root`. */
export type LayerDialogProps = LayerDialogRootProps;
declare function LayerDialogRoot(props: LayerDialogRootProps): import("react/jsx-runtime").JSX.Element;
declare namespace LayerDialogRoot {
    var displayName: string;
}
/** A confirmation dialog that requires the user to choose an explicit action. */
declare function LayerDialogAlert(props: LayerDialogRootProps): import("react/jsx-runtime").JSX.Element;
declare namespace LayerDialogAlert {
    var displayName: string;
}
export type LayerDialogTriggerProps = ComponentPropsWithoutRef<typeof DrawerBase.Trigger>;
declare function LayerDialogTrigger(props: LayerDialogTriggerProps): import("react/jsx-runtime").JSX.Element;
declare namespace LayerDialogTrigger {
    var displayName: string;
}
export interface LayerDialogContentProps {
    children: ReactNode;
    /**
     * Container element for the portal. Overrides `KumoPortalProvider` context.
     * @default document.body (or KumoPortalProvider container if set)
     */
    container?: PortalContainer;
    /** Desktop-only width. Mobile dialogs always remain full-width. */
    size?: KumoLayerDialogSize;
    /** Desktop-only positioning. Mobile dialogs always remain bottom sheets. */
    verticalAlign?: KumoLayerDialogVerticalAlign;
    /**
     * Accessible name of the automatic X button. Overrides the `close`
     * translation from KumoLocaleProvider.
     * @default "Close"
     */
    closeLabel?: string;
}
declare function LayerDialogContent({ children, closeLabel, container: containerProp, size, verticalAlign, }: LayerDialogContentProps): import("react/jsx-runtime").JSX.Element;
declare namespace LayerDialogContent {
    var displayName: string;
}
export interface LayerDialogTitleProps {
    children: ReactNode;
}
declare function LayerDialogTitle({ children }: LayerDialogTitleProps): import("react/jsx-runtime").JSX.Element;
declare namespace LayerDialogTitle {
    var displayName: string;
}
export interface LayerDialogDescriptionProps {
    children: ReactNode;
}
/**
 * Optional supporting copy rendered directly beneath the title inside the
 * sticky title frame. Also becomes the dialog's accessible description.
 */
declare function LayerDialogDescription({ children }: LayerDialogDescriptionProps): import("react/jsx-runtime").JSX.Element;
declare namespace LayerDialogDescription {
    var displayName: string;
}
export interface LayerDialogBodyProps {
    children: ReactNode;
}
declare function LayerDialogBody({ children }: LayerDialogBodyProps): import("react/jsx-runtime").JSX.Element;
declare namespace LayerDialogBody {
    var displayName: string;
}
export type LayerDialogSeparatorProps = ComponentPropsWithoutRef<"hr">;
/** A full-width divider between sections of `LayerDialog.Body`. */
declare const LayerDialogSeparator: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLHRElement>, HTMLHRElement>, "ref"> & import("react").RefAttributes<HTMLHRElement>>;
export type LayerDialogActionProps = Omit<ComponentPropsWithoutRef<"button">, "children" | "className"> & {
    children: ReactNode;
    loading?: boolean;
    /** Related actions exposed from the split-button menu. */
    menu?: ReactNode[];
    /** Accessible name for the split-button menu trigger. */
    menuLabel?: string;
    /**
     * Visual emphasis of the primary action. Use `destructive` when confirming
     * an irreversible action such as a delete.
     * @default "primary"
     */
    variant?: KumoLayerDialogPrimaryVariant;
};
/** @deprecated Use `LayerDialogActionProps` instead. */
export type LayerDialogPrimaryProps = LayerDialogActionProps;
export type KumoLayerDialogPrimaryVariant = "primary" | "destructive";
export interface LayerDialogActionsProps {
    /**
     * Exactly one action. Pass `menu` to LayerDialog.Action for related actions
     * such as "Save as draft".
     */
    children: ReactNode;
    /**
     * Text of the automatic dismiss button. Say "Cancel" only when the
     * workflow has a real cancel outcome. Translate it for non-English
     * products.
     * @default "Close" ("Cancel" inside LayerDialog.Alert)
     */
    dismissLabel?: string;
}
declare function LayerDialogAction({ children, loading, menu, menuLabel, variant, ...props }: LayerDialogActionProps): import("react/jsx-runtime").JSX.Element;
declare namespace LayerDialogAction {
    var displayName: string;
}
declare const LayerDialogActions: (({ children, dismissLabel, }: LayerDialogActionsProps) => import("react/jsx-runtime").JSX.Element) & {
    /** @deprecated Use `LayerDialog.Action` instead. */
    Primary: typeof LayerDialogAction;
    displayName: string;
};
declare const LayerDialog: typeof LayerDialogRoot & {
    Root: typeof LayerDialogRoot;
    Alert: typeof LayerDialogAlert;
    Trigger: typeof LayerDialogTrigger;
    Content: typeof LayerDialogContent;
    Title: typeof LayerDialogTitle;
    Description: typeof LayerDialogDescription;
    Body: typeof LayerDialogBody;
    Separator: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLHRElement>, HTMLHRElement>, "ref"> & import("react").RefAttributes<HTMLHRElement>>;
    Action: typeof LayerDialogAction;
    Actions: (({ children, dismissLabel, }: LayerDialogActionsProps) => import("react/jsx-runtime").JSX.Element) & {
        /** @deprecated Use `LayerDialog.Action` instead. */
        Primary: typeof LayerDialogAction;
        displayName: string;
    };
};
export { LayerDialog, LayerDialogRoot, LayerDialogAlert, LayerDialogTrigger, LayerDialogContent, LayerDialogTitle, LayerDialogDescription, LayerDialogBody, LayerDialogSeparator, LayerDialogAction, LayerDialogActions, };
