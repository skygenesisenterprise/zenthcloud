import { type ReactNode } from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
/** Event details passed to onCheckedChange callback. Re-exported from Base UI. */
export type CheckboxChangeEventDetails = Parameters<NonNullable<BaseCheckbox.Root.Props["onCheckedChange"]>>[1];
/** Checkbox variant definitions mapping variant names to their Tailwind classes. */
export declare const KUMO_CHECKBOX_VARIANTS: {
    readonly variant: {
        readonly default: {
            readonly classes: "[&:focus-within>span]:ring-zenth-focus [&:hover>span]:ring-zenth-hairline";
            readonly description: "Default checkbox appearance";
        };
        readonly error: {
            readonly classes: "[&>span]:ring-zenth-danger";
            readonly description: "Error state for validation failures";
        };
    };
    readonly appearance: {
        readonly default: {
            readonly classes: "";
            readonly description: "Standard inline checkbox item";
        };
        readonly card: {
            readonly classes: "rounded-lg border border-zenth-hairline bg-zenth-base p-3 hover:not-has-[[data-checked]]:bg-zenth-elevated has-[[data-checked]]:border-zenth-interact has-[[data-checked]]:bg-zenth-tint";
            readonly description: "Choice card appearance with border, padding, and highlighted selection state";
        };
    };
};
export declare const KUMO_CHECKBOX_DEFAULT_VARIANTS: {
    readonly variant: "default";
    readonly appearance: "default";
};
export type KumoCheckboxVariant = keyof typeof KUMO_CHECKBOX_VARIANTS.variant;
export type KumoCheckboxAppearance = keyof typeof KUMO_CHECKBOX_VARIANTS.appearance;
export interface KumoCheckboxVariantsProps {
    /**
     * Visual variant.
     * - `"default"` — Standard checkbox appearance
     * - `"error"` — Error state for validation failures
     * @default "default"
     */
    variant?: KumoCheckboxVariant;
    /**
     * Visual appearance.
     * - `"default"` — Standard inline checkbox item
     * - `"card"` — Choice card with border, padding, and highlighted selection state
     * @default "default"
     */
    appearance?: KumoCheckboxAppearance;
}
export declare function checkboxVariants({ variant, appearance, }?: KumoCheckboxVariantsProps): string;
export type CheckboxVariant = KumoCheckboxVariant;
/**
 * Single checkbox component props with accessibility guidance.
 *
 * **Accessible Name Required:** Checkbox should have one of:
 * 1. `label` prop (recommended) - built-in Field wrapper with horizontal layout
 * 2. `aria-label` - for checkboxes without visible label
 * 3. `aria-labelledby` - for custom label association
 *
 * **Note:** When used inside Checkbox.Group or Dropdown, label is optional (parent provides context).
 *
 * Missing accessible names will trigger console warnings in development (unless inside a group).
 *
 * @example
 * // Recommended: Built-in Field wrapper with label
 * <Checkbox label="Accept terms and conditions" />
 *
 * @example
 * // Control-first layout (checkbox before label)
 * <Checkbox label="Remember me" controlFirst={true} />
 *
 * @example
 * // Label-first layout (label before checkbox)
 * <Checkbox label="Enable notifications" controlFirst={false} />
 *
 * @example
 * // Error variant (visual only, no error text for single checkboxes)
 * <Checkbox label="Required field" variant="error" />
 *
 * @example
 * // Without visible label (aria-label required)
 * <Checkbox aria-label="Select all items" />
 *
 * @example
 * // Custom label association
 * <label id="terms-label">I accept the terms</label>
 * <Checkbox aria-labelledby="terms-label" />
 *
 * @example
 * // Inside Checkbox.Group (label optional)
 * <Checkbox.Group legend="Preferences">
 *   <Checkbox.Item value="email" label="Email notifications" />
 *   <Checkbox.Item value="sms" label="SMS notifications" />
 * </Checkbox.Group>
 */
export type CheckboxProps = {
    /** Visual variant: "default" or "error" for validation failures (visual only, no error text) */
    variant?: CheckboxVariant;
    /** Label content for the checkbox (enables built-in Field wrapper) - can be a string or any React node */
    label?: ReactNode;
    /** Tooltip content to display next to the label via an info icon */
    labelTooltip?: ReactNode;
    /** When true (default), checkbox appears before label. When false, label appears before checkbox. */
    controlFirst?: boolean;
    /** Whether the checkbox is checked (controlled) */
    checked?: boolean;
    /** Whether the checkbox is in indeterminate state */
    indeterminate?: boolean;
    /** Whether the checkbox is disabled */
    disabled?: boolean;
    /** Callback when the checked state changes */
    onCheckedChange?: BaseCheckbox.Root.Props["onCheckedChange"];
    /** Name for form submission */
    name?: string;
    /** Whether the field is required */
    required?: boolean;
    /** Additional class name */
    className?: string;
    /** Accessible label when no visible label is provided */
    "aria-label"?: string;
    /** ID of element that labels this checkbox */
    "aria-labelledby"?: string;
};
/**
 * Checkbox group component props (with built-in Fieldset and CheckboxGroup)
 *
 * Usage:
 * ```tsx
 * <Checkbox.Group
 *   legend="Choose preferences"
 *   defaultValue={['email']}
 *   error="You must select at least one option"
 * >
 *   <Checkbox.Item label="Email notifications" value="email" />
 *   <Checkbox.Item label="SMS notifications" value="sms" />
 * </Checkbox.Group>
 * ```
 */
/**
 * Props for Checkbox.Legend — a composable sub-component for labeling a Checkbox.Group.
 *
 * Place as a direct child of `<Checkbox.Group>` to provide a styled, accessible legend.
 * Accepts `className` for full styling control (e.g. `className="sr-only"` to visually hide).
 *
 * @example
 * ```tsx
 * <Checkbox.Group>
 *   <Checkbox.Legend className="sr-only">Preferences</Checkbox.Legend>
 *   <Checkbox.Item label="Email" value="email" />
 * </Checkbox.Group>
 * ```
 */
export interface CheckboxLegendProps {
    /** Legend content */
    children: ReactNode;
    /** Additional CSS classes (e.g. "sr-only" to visually hide the legend) */
    className?: string;
}
export interface CheckboxGroupProps {
    /**
     * Legend text for the group.
     * For more control over legend styling, omit this prop and use `<Checkbox.Legend>` as a child instead.
     */
    legend?: string;
    /** Child Checkbox.Item components (and optionally a Checkbox.Legend) */
    children: ReactNode;
    /** Error message for the group (only appears in groups, not single checkboxes) */
    error?: string;
    /** Helper text for the group */
    description?: ReactNode;
    /** Values of checkboxes that should be initially checked (uncontrolled) */
    defaultValue?: string[];
    /** Values of checkboxes that should be checked (controlled) */
    value?: string[];
    /** Event handler called when checkbox values change */
    onValueChange?: (value: string[]) => void;
    /** All possible checkbox values (required for parent checkbox pattern) */
    allValues?: string[];
    /** Whether all checkboxes in the group are disabled */
    disabled?: boolean;
    /** Layout direction of the checkbox items */
    orientation?: "vertical" | "horizontal";
    /**
     * Visual appearance applied to all Checkbox.Item children.
     * - `"default"` — Standard inline checkbox items
     * - `"card"` — Choice card with border, padding, and highlighted selection state
     *
     * Individual items can override this with their own `appearance` prop.
     * @default "default"
     */
    appearance?: KumoCheckboxAppearance;
    /** When true, checkbox appears before label. When false, label appears before checkbox. Defaults to true for default appearance and false for card appearance. */
    controlFirst?: boolean;
    /** Additional CSS classes */
    className?: string;
}
/**
 * Individual checkbox item within a group
 */
export type CheckboxItemProps = {
    /** Visual variant: "default" or "error" for validation failures */
    variant?: CheckboxVariant;
    /**
     * Visual appearance of the checkbox item.
     * - `"default"` — Standard inline checkbox item
     * - `"card"` — Choice card with border, padding, and highlighted selection state
     *
     * When set on an individual item, overrides the group-level `appearance`.
     * @default "default"
     */
    appearance?: KumoCheckboxAppearance;
    /** Label text displayed next to checkbox */
    label: string;
    /** Description text displayed below the label (only visible in card appearance) */
    description?: ReactNode;
    /** Value of the checkbox (required when used in Checkbox.Group) */
    value?: string;
    /** Additional CSS classes for the label wrapper */
    className?: string;
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    /** Callback when the checked state changes */
    onCheckedChange?: BaseCheckbox.Root.Props["onCheckedChange"];
    name?: string;
};
declare function CheckboxLegend({ children, className }: CheckboxLegendProps): import("react/jsx-runtime").JSX.Element;
declare function CheckboxGroup({ legend, children, error, description, defaultValue, value, onValueChange, allValues, disabled, orientation, appearance, controlFirst, className, }: CheckboxGroupProps): import("react/jsx-runtime").JSX.Element;
export declare const Checkbox: import("react").ForwardRefExoticComponent<CheckboxProps & import("react").RefAttributes<HTMLButtonElement>> & {
    Item: import("react").ForwardRefExoticComponent<CheckboxItemProps & import("react").RefAttributes<HTMLButtonElement>>;
    Group: typeof CheckboxGroup;
    Legend: typeof CheckboxLegend;
};
export {};
