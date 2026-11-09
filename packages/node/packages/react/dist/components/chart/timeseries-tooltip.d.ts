import type { TimeseriesMarker } from "./timeseries-markers";
export interface TooltipRow {
    name: string;
    value: number;
    color: string;
}
export interface SeriesTooltipState {
    type: "series";
    ts: number;
    rows: TooltipRow[];
    hiddenCount: number;
}
export interface MarkerTooltipState {
    type: "marker";
    ts: number;
    color: string;
    markers: TimeseriesMarker[];
    rows: TooltipRow[];
    hiddenCount: number;
}
export type TooltipState = SeriesTooltipState | MarkerTooltipState;
export interface TooltipContentProps {
    state: TooltipState;
    formatValue?: (v: number) => string;
    formatTimestamp: (timestamp: number) => string;
    footer?: string;
}
export declare const TooltipContent: import("react").MemoExoticComponent<({ state, formatValue, formatTimestamp, footer, }: TooltipContentProps) => import("react/jsx-runtime").JSX.Element>;
