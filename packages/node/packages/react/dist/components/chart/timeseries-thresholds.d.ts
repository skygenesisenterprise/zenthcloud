export interface TimeseriesThreshold {
    /** Y-axis value where the threshold line is rendered. */
    value: number;
    /** Optional label shown on/near the threshold line. */
    label?: string;
    /** Threshold line and label color. */
    color: string;
}
export declare function buildTimeseriesThresholdAnnotations(thresholds: TimeseriesThreshold[] | undefined): {
    markLine: {
        symbol: "none";
        silent: boolean;
        animation: boolean;
        z: number;
        lineStyle: {
            type: "dashed";
            width: number;
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
            show: boolean;
            position: "insideEndTop";
            formatter: (params: {
                name?: string;
            }) => string;
        };
        data: {
            name: string | undefined;
            yAxis: number;
            lineStyle: {
                color: string;
                width: number;
                type: "dashed";
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
                show: boolean;
                color: string;
            };
        }[];
    };
} | undefined;
export declare function getThresholdValueExtent(thresholds: TimeseriesThreshold[] | undefined): {
    min: number;
    max: number;
} | undefined;
