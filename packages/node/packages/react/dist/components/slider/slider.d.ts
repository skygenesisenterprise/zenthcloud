import { Slider as BaseSlider } from "@base-ui/react/slider";
import { type ReactNode } from "react";
/** Slider size definitions mapping sizes to their track heights. */
export declare const KUMO_SLIDER_VARIANTS: {
    readonly size: {
        readonly sm: {
            readonly classes: "h-6 rounded-md";
            readonly description: "Compact slider for dense layouts";
        };
        readonly base: {
            readonly classes: "h-8 rounded-lg";
            readonly description: "Default slider size";
        };
    };
};
export declare const KUMO_SLIDER_DEFAULT_VARIANTS: {
    readonly size: "base";
};
export type KumoSliderSize = keyof typeof KUMO_SLIDER_VARIANTS.size;
export interface KumoSliderVariantsProps {
    /**
     * Height of the slider track.
     * - `"sm"` — Compact slider for dense layouts
     * - `"base"` — Default slider size
     * @default "base"
     */
    size?: KumoSliderSize;
}
export declare function sliderVariants({ size, }?: KumoSliderVariantsProps): string;
type SliderValue = number | readonly number[];
/**
 * Slider component props.
 *
 * @example
 * ```tsx
 * <Slider label="Match count" defaultValue={2} max={5} />
 * <Slider label="Price" defaultValue={[25, 75]} />
 * ```
 */
export interface SliderProps<Value extends SliderValue = SliderValue> extends Omit<BaseSlider.Root.Props<Value>, "children" | "orientation">, KumoSliderVariantsProps {
    /** Label displayed above the slider track. */
    label?: ReactNode;
    /**
     * Accessible name for each thumb. Use it when there is no visible `label`,
     * or to tell the thumbs of a range slider apart.
     */
    getAriaLabel?: (index: number) => string;
}
/**
 * Lets people pick a number, or a range between two numbers, by dragging a
 * thumb along a track. Pass an array to `value` or `defaultValue` for a range.
 *
 * @example
 * ```tsx
 * <Slider label="Volume" defaultValue={40} />
 * ```
 */
export declare function Slider<Value extends SliderValue = SliderValue>({ label, size, getAriaLabel, thumbAlignment, className, min, max, format, locale, value, defaultValue, ...props }: SliderProps<Value>): import("react/jsx-runtime").JSX.Element;
export declare namespace Slider {
    var displayName: string;
}
export {};
