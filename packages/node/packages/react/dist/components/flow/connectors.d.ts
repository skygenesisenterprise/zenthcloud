import { type ReactNode } from "react";
import type { Edges, FlowOrientation, FlowState, NodePositions } from "./flow-layout";
export interface Connector {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    isBottom?: boolean;
    disabled?: boolean;
    single?: boolean;
    /** Id of the source node this connector originates from. */
    fromId?: string;
    /** Id of the target node this connector points to. */
    toId?: string;
}
type PathProps = Partial<{
    cornerRadius: number;
    midOffset: number;
    arrowheadOffset: number;
    isBottom: boolean;
    single: boolean;
    orientation: "vertical" | "horizontal";
}>;
export declare function createRoundedPath({ x1, y1, x2, y2 }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}, { cornerRadius: maxCornerRadius, midOffset, arrowheadOffset, isBottom, single, orientation, }?: PathProps): string;
type FlowConnectorsProps = {
    edges: Edges;
    nodePositions: NodePositions;
    nodes: FlowState["nodes"];
    orientation: FlowOrientation;
};
/**
 * Draws every edge in the flow using only computed positions and measured
 * node sizes — no DOM rect lookups needed.
 *
 * Horizontal edges connect source right-center to target left-center.
 * Vertical edges connect source bottom-center to target top-center.
 *
 * Intended to be rendered once at the top-level Flow component, absolutely
 * positioned to overlay the entire diagram.
 */
export declare function FlowConnectors({ edges, nodePositions, nodes, orientation, }: FlowConnectorsProps): import("react/jsx-runtime").JSX.Element;
export declare const Connectors: import("react").ForwardRefExoticComponent<{
    connectors: Connector[];
    children?: ReactNode;
} & Omit<Partial<{
    cornerRadius: number;
    midOffset: number;
    arrowheadOffset: number;
    isBottom: boolean;
    single: boolean;
    orientation: "vertical" | "horizontal";
}>, "isBottom" | "single"> & import("react").RefAttributes<SVGSVGElement>>;
export {};
