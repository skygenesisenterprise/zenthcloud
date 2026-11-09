import type * as echarts from "echarts/core";
import type { ReactElement, RefAttributes } from "react";
export interface MapGeoJson {
    type: "FeatureCollection";
    features: Array<{
        type: "Feature";
        id?: string | number;
        properties?: Record<string, unknown> | null;
        geometry: unknown;
    }>;
}
/** Keys of `T` whose value is assignable to `V`. */
type KeysWithValue<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
/** Accessor for a value on a data row: a key of `T`, or a function of the row. */
export type MapAccessor<T, V> = KeysWithValue<T, V> | ((row: T) => V);
/** Per-datum style value: a constant, or a function of the row. */
export type MapStyle<T, V> = V | ((row: T) => V);
/**
 * A geographic projection in ECharts' `{ project, unproject }` shape. Maps
 * default to Mercator (the familiar flat 2D web-map look); pass another d3-geo
 * projection (e.g. `geoNaturalEarth1`) to override, or `null` for raw lng/lat.
 */
export interface MapProjection {
    project: (point: number[]) => number[];
    unproject: (point: number[]) => number[];
}
export interface BubbleMapProps<T> {
    /**
     * The ECharts core instance imported by the consumer (passed in for
     * tree-shaking). Requires `MapChart`, `ScatterChart`, `TooltipComponent`, and
     * a renderer registered via `echarts.use([...])`.
     */
    echarts: typeof echarts;
    /** GeoJSON `FeatureCollection` for the land base. */
    geoJson: MapGeoJson;
    /**
     * Optional stable ECharts map registry name. Set this when the same GeoJSON is
     * parsed into new object instances across mounts and should reuse one global
     * ECharts registration.
     */
    mapName?: string;
    /** Raw data rows. Coordinates/value/name are read via the accessors below. */
    data: T[];
    /** Longitude accessor (key of `T` or `(row) => number`). */
    lng: MapAccessor<T, number>;
    /** Latitude accessor (key of `T` or `(row) => number`). */
    lat: MapAccessor<T, number>;
    /** Value accessor — drives bubble size. */
    value: MapAccessor<T, number>;
    /** Optional name accessor — used by the default tooltip. */
    name?: MapAccessor<T, string>;
    /** Smallest bubble radius in px. Default: `6`. */
    minRadius?: number;
    /** Largest bubble radius in px. Default: `26`. */
    maxRadius?: number;
    /**
     * Explicit bubble radius `(value) => px`. Overrides the default
     * `minRadius`/`maxRadius` scaling.
     */
    bubbleSize?: (value: number) => number;
    /** Bubble fill colour — constant or `(row) => color`. Defaults to the chart blue. */
    bubbleColor?: MapStyle<T, string>;
    /** Bubble border colour — constant or `(row) => color`. Default: `transparent`. */
    bubbleBorderColor?: MapStyle<T, string>;
    /** Bubble border width — constant or `(row) => px`. Default: `0`. */
    bubbleBorderWidth?: MapStyle<T, number>;
    /** Map center as `[longitude, latitude]`. Defaults to auto-fit. */
    center?: [number, number];
    /** Zoom level — multiplies the auto-fit scale. Default: `1.25`. */
    zoom?: number;
    /** Enable drag-to-pan and scroll-to-zoom. Default: `false`. */
    roam?: boolean;
    /**
     * Geographic projection. Defaults to a latitude-clamped Mercator (flat 2D
     * web-map look). Pass another d3-geo projection to override, or `null` for
     * ECharts' raw equirectangular plotting.
     *
     * Use a stable reference (module-level or memoised): a new object each render
     * rebuilds the view and resets a roamed/zoomed map.
     */
    projection?: MapProjection | null;
    /** Show the tooltip. Default: `true`. */
    showTooltip?: boolean;
    /** Format the value for the default tooltip. Default: `toLocaleString()`. */
    valueFormat?: (value: number) => string;
    /**
     * Override the tooltip content for a row. Returns an HTML string rendered by
     * ECharts' own tooltip.
     *
     * USE WITH CAUTION: the return value is injected as HTML. Escape any
     * user-provided strings to avoid XSS.
     */
    tooltipFormatter?: (row: T) => string;
    /** Called as the pointer enters/leaves a bubble. */
    onBubbleHover?: (row: T | undefined) => void;
    /** Called when a bubble is clicked. */
    onBubbleClick?: (row: T) => void;
    /**
     * Container aspect ratio as `width / height` (e.g. `1.7` or `"16 / 9"`). The
     * height derives from the rendered width so the map fills the frame with no
     * letterboxing. Defaults to the projected aspect of the displayed window, so
     * the land fits edge-to-edge. Pass `height` to fix a pixel height instead.
     */
    aspectRatio?: number | string;
    /**
     * Fixed chart height in pixels. Overrides `aspectRatio` when set. Leave unset
     * to size by aspect ratio (the default) so the map fills the container.
     */
    height?: number;
    className?: string;
    isDarkMode?: boolean;
}
export declare const BubbleMap: (<T>(props: BubbleMapProps<T> & RefAttributes<echarts.ECharts | null>) => ReactElement | null) & {
    displayName?: string;
};
export interface ChoroplethMapProps<T> {
    /**
     * The ECharts core instance imported by the consumer (passed in for
     * tree-shaking). Requires `MapChart`, `VisualMapComponent`, `TooltipComponent`,
     * and a renderer registered via `echarts.use([...])`.
     */
    echarts: typeof echarts;
    /** GeoJSON `FeatureCollection` whose regions are shaded by value. */
    geoJson: MapGeoJson;
    /**
     * Optional stable ECharts map registry name. Set this when the same GeoJSON is
     * parsed into new object instances across mounts and should reuse one global
     * ECharts registration.
     */
    mapName?: string;
    /** Raw data rows. The region key and value are read via the accessors below. */
    data: T[];
    /**
     * Region-key accessor (key of `T` or `(row) => string`). Each row is joined to
     * a GeoJSON feature whose `nameProperty` equals this value.
     */
    name: MapAccessor<T, string>;
    /** Value accessor — drives the region's fill colour. */
    value: MapAccessor<T, number>;
    /**
     * GeoJSON feature property to join on. Default: `"name"`. Real-world data is
     * often more reliably matched on an ISO-code property (e.g. `"iso_a2"`).
     */
    nameProperty?: string;
    /**
     * Sequential colour ramp (low → high). Defaults to the Kumo choropleth blues,
     * tuned to stay distinct from the no-data fill. Distributed across the
     * continuous gradient.
     */
    colorRange?: string[];
    /** Lower bound of the continuous scale. Default: data minimum. */
    min?: number;
    /** Upper bound of the continuous scale. Default: data maximum. */
    max?: number;
    /** Fill for regions with no matching data row. Defaults to the neutral land grey. */
    noDataColor?: string;
    /** Show the visualMap colour legend. Default: `false`. */
    showLegend?: boolean;
    /** Show the tooltip. Default: `true`. */
    showTooltip?: boolean;
    /** Format the value for the default tooltip. Default: `toLocaleString()`. */
    valueFormat?: (value: number) => string;
    /**
     * Override the tooltip content for a row. Returns an HTML string rendered by
     * ECharts' own tooltip.
     *
     * USE WITH CAUTION: the return value is injected as HTML. Escape any
     * user-provided strings to avoid XSS.
     */
    tooltipFormatter?: (row: T) => string;
    /** Called as the pointer enters/leaves a region with data. */
    onRegionHover?: (row: T | undefined) => void;
    /** Called when a region with data is clicked. */
    onRegionClick?: (row: T) => void;
    /** Map center as `[longitude, latitude]`. Defaults to auto-fit. */
    center?: [number, number];
    /** Zoom level — multiplies the auto-fit scale. Default: `1.25`. */
    zoom?: number;
    /** Enable drag-to-pan and scroll-to-zoom. Default: `false`. */
    roam?: boolean;
    /**
     * Geographic projection. Defaults to a latitude-clamped Mercator (flat 2D
     * web-map look). Pass another d3-geo projection to override, or `null` for
     * ECharts' raw equirectangular plotting.
     *
     * Use a stable reference (module-level or memoised): a new object each render
     * rebuilds the view and resets a roamed/zoomed map.
     */
    projection?: MapProjection | null;
    /**
     * Container aspect ratio as `width / height` (e.g. `1.7` or `"16 / 9"`). The
     * height derives from the rendered width so the map fills the frame with no
     * letterboxing. Defaults to the projected aspect of the displayed window, so
     * the regions fit edge-to-edge. Pass `height` to fix a pixel height instead.
     */
    aspectRatio?: number | string;
    /**
     * Fixed chart height in pixels. Overrides `aspectRatio` when set. Leave unset
     * to size by aspect ratio (the default) so the map fills the container.
     */
    height?: number;
    className?: string;
    isDarkMode?: boolean;
}
export declare const ChoroplethMap: (<T>(props: ChoroplethMapProps<T> & RefAttributes<echarts.ECharts | null>) => ReactElement | null) & {
    displayName?: string;
};
export {};
