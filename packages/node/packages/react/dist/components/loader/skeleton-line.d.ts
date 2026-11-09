/** SkeletonLine variant definitions mapping variant names to their root classes and descriptions. */
export declare const KUMO_SKELETON_LINE_VARIANTS: {
    readonly variant: {
        readonly default: {
            readonly classes: "zenth-skeleton-line";
            readonly description: "Flat grey bar with a sliding shimmer";
        };
        readonly sketch: {
            readonly classes: "relative h-2 w-(--skeleton-width)";
            readonly description: "Wireframe-style bar: rounded fill with a sliding shimmer, a 1px outline, and construction strokes that overshoot each corner by 4px";
        };
    };
};
export declare const KUMO_SKELETON_LINE_DEFAULT_VARIANTS: {
    readonly variant: "default";
};
export type KumoSkeletonLineVariant = keyof typeof KUMO_SKELETON_LINE_VARIANTS.variant;
export declare const SkeletonLine: ({ variant, minWidth, maxWidth, minDuration, maxDuration, minDelay, maxDelay, blockHeight, className, }: {
    /**
     * Visual style of the line.
     * - `"default"` — flat grey bar with a sliding shimmer
     * - `"sketch"` — wireframe-style bar with an outline and construction
     *   strokes that overshoot each corner by 4px. Leave 4px of room around it
     *   so an `overflow: hidden` parent doesn't clip the strokes.
     * @default "default"
     */
    variant?: KumoSkeletonLineVariant;
    minWidth?: number;
    maxWidth?: number;
    minDuration?: number;
    maxDuration?: number;
    minDelay?: number;
    maxDelay?: number;
    blockHeight?: string | number;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element;
