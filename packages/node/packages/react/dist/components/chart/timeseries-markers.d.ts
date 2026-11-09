export interface TimeseriesMarker {
    /** Unix timestamp in milliseconds. */
    timestamp: number;
    /** Short label shown on/near the marker. */
    label?: string;
    /** Optional longer tooltip/body text. */
    description?: string;
    /** Optional marker color. Defaults to a neutral/subtle chart color. */
    color?: string;
    /** Optional line style. Defaults to dashed. */
    lineStyle?: "solid" | "dashed" | "dotted";
}
export interface TimeseriesMarkerCluster {
    timestamp: number;
    label?: string;
    color?: string;
    lineStyle?: TimeseriesMarker["lineStyle"];
    markers: TimeseriesMarker[];
}
export interface TimeseriesMarkerAnnotationStyle {
    color: string;
    labelBackgroundColor: string;
}
export declare function buildTimeseriesMarkerAnnotations(clusters: TimeseriesMarkerCluster[], style: TimeseriesMarkerAnnotationStyle): {
    markLine: {
        symbol: "none";
        silent: boolean;
        animation: boolean;
        z: number;
        lineStyle: {
            type: "dashed";
            color: string;
            width: number;
        };
        emphasis: {
            lineStyle: {
                width: number;
            };
        };
        blur: {
            lineStyle: {
                opacity: number;
            };
            label: {
                opacity: number;
            };
        };
        label: {
            backgroundColor: string;
            padding: number[];
            borderRadius: number;
            shadowBlur: number;
            shadowColor: string;
            show: boolean;
            formatter: (params: {
                name?: string;
            }) => string;
            position: "insideEndTop";
            color: string;
        };
        data: {
            name: string | undefined;
            xAxis: number;
            lineStyle: {
                type: "dashed" | "dotted" | "solid";
                color: string;
                width: number;
            };
            emphasis: {
                lineStyle: {
                    width: number;
                };
            };
            blur: {
                lineStyle: {
                    opacity: number;
                };
                label: {
                    opacity: number;
                };
            };
            label: {
                backgroundColor: string;
                padding: number[];
                borderRadius: number;
                shadowBlur: number;
                shadowColor: string;
                show: boolean;
                color: string;
            };
            tooltip: {
                marker: TimeseriesMarkerCluster;
            };
        }[];
    };
} | undefined;
export declare function clusterTimeseriesMarkers(markers: TimeseriesMarker[] | undefined, interval: number): TimeseriesMarkerCluster[];
export declare function getApproximateMarkerClusterInterval(timestamps: Iterable<number>, tickCount: number): number;
export declare function getTimeseriesMarkerFromEvent(params: {
    componentType?: string;
    data?: {
        tooltip?: {
            marker?: TimeseriesMarkerCluster;
        };
    };
}): TimeseriesMarkerCluster | undefined;
