import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { type FieldErrorMatch } from "../field/field";
import { type KumoInputVariant } from "../input/input";
export declare const KUMO_TAG_INPUT_VARIANTS: {
    readonly variant: {
        readonly default: {
            readonly classes: "";
            readonly description: "Default tag input appearance.";
        };
        readonly error: {
            readonly classes: "";
            readonly description: "Error state for validation failures.";
        };
    };
};
export declare const KUMO_TAG_INPUT_DEFAULT_VARIANTS: {
    readonly variant: "default";
};
export declare const KUMO_TAG_INPUT_STYLING: {
    readonly baseClasses: "flex flex-wrap items-center";
};
/** Labels for TagInput feedback and controls. Override these for localization. */
export interface TagInputLabels {
    /** Accessible name used when neither `label` nor `aria-label` is provided. */
    input?: string;
    /** Accessible name for a tag's remove button. */
    removeValue?: (value: string) => string;
    /** Validation feedback shown when `validateValue` rejects a value. */
    invalidValue?: (value: string) => string;
    /** Feedback shown when adding a tag would exceed `maxValues`. */
    maxValuesReached?: (maxValues: number) => string;
}
type NativeInputProps = Omit<ComponentPropsWithoutRef<"input">, "defaultValue" | "disabled" | "size" | "value">;
export interface TagInputProps extends NativeInputProps {
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    validateValue?: (value: string, acceptedValues: string[]) => boolean;
    maxValues?: number;
    /** Translated labels for generated input, action, and validation text. */
    labels?: TagInputLabels;
    label?: ReactNode;
    labelTooltip?: ReactNode;
    description?: ReactNode;
    error?: string | {
        message: ReactNode;
        match: FieldErrorMatch;
    };
    variant?: KumoInputVariant;
    disabled?: boolean;
    /** Submits each accepted tag as a separate form value under this name. */
    name?: string;
    /**
     * Requires at least one accepted tag for native form validation. Like a
     * native input, a `readOnly` TagInput is skipped by validation.
     */
    required?: boolean;
    /** Prevents adding or removing tags while keeping the input focusable. */
    readOnly?: boolean;
}
export declare const TagInput: import("react").ForwardRefExoticComponent<TagInputProps & import("react").RefAttributes<HTMLInputElement>>;
export {};
