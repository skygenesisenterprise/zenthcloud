import { type ReactNode } from "react";
import { type DescendantInfo } from "./use-children";
import { type FlowAlign, type FlowOrientation, type FlowState, type TreeNode } from "./flow-layout";
export type { FlowAlign, FlowOrientation, FlowState, TreeNode };
type Orientation = FlowOrientation;
interface FlowDiagramProps {
    /**
     * Flow direction.
     * - `"horizontal"`: Nodes progress left-to-right (default)
     * - `"vertical"`: Nodes progress top-to-bottom
     */
    orientation?: Orientation;
    /**
     * Whether to render the pannable canvas wrapper.
     * - `true`: Renders with pannable canvas, scrollbars, and pan gestures (default)
     * - `false`: Renders only the node list without canvas wrapper
     */
    canvas?: boolean;
    /**
     * Cross-axis alignment of nodes.
     * - `"start"`: Nodes align to the top/left edge (default)
     * - `"center"`: Nodes are centered across the inactive axis
     */
    align?: FlowAlign;
    /**
     * Padding around the diagram content within the canvas.
     * - `x`: Horizontal padding in pixels (default: 16)
     * - `y`: Vertical padding in pixels (default: 64)
     */
    padding?: {
        x?: number;
        y?: number;
    };
    /**
     * Callback fired when the overflow state changes.
     * Called with `{ x: boolean, y: boolean }` indicating overflow in each axis.
     */
    onOverflowChange?: (overflow: {
        x: boolean;
        y: boolean;
    }) => void;
    className?: string;
    children?: ReactNode;
}
export declare function FlowDiagram({ orientation, canvas, align, padding: requestedPadding, onOverflowChange, className, children, }: FlowDiagramProps): import("react/jsx-runtime").JSX.Element;
export type NodeData = {
    kind: "node";
    disabled?: boolean;
} | {
    kind: "parallel";
    disabled?: boolean;
    children: string[];
    align?: "end";
} | {
    kind: "list";
    disabled?: boolean;
    children: string[];
};
type FlowStateContextValue = {
    reportNode: (id: string, props: {
        width: number;
        height: number;
        disabled?: boolean;
        startAnchorOffset?: number;
        endAnchorOffset?: number;
    }) => void;
    removeNode: (id: string) => void;
    /**
     * Report immediate descendants from a list/parallel node.
     * Pass `null` as `id` for the root FlowNodeList.
     */
    reportDescendants: (id: string | null, descendants: DescendantInfo<NodeData>[]) => void;
    orientation: Orientation;
    /** Derived node positions (computed synchronously from FlowState). */
    nodePositions: Record<string, {
        x: number;
        y: number;
    }>;
    /** Derived edges (computed synchronously from FlowState). */
    edges: [string, string][];
};
export declare function useFlowStateContext(): FlowStateContextValue;
export declare const useNodeGroup: () => {
    register: (id: string, renderOrder: number, props?: NodeData | undefined) => {
        unregister: () => void;
    };
    descendants: DescendantInfo<NodeData>[];
    claimRenderOrder: (id: string) => number;
};
export declare const useNode: (props: NodeData, id?: string) => {
    index: number;
    id: string;
};
/**
 * Hook to optionally register as a node if within a parent descendants context.
 * Returns registration info if registered, or null if no parent context exists.
 */
export declare const useOptionalNode: (props: NodeData) => {
    index: number;
    id: string;
} | null;
export declare function FlowNodeList({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
