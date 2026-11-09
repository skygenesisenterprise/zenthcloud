export type TreeNode = {
    kind: "list";
    children: TreeNode[];
} | {
    kind: "parallel";
    children: TreeNode[];
    align?: "end";
} | {
    kind: "node";
    id: string;
};
export type FlowAlign = "start" | "center";
export type FlowOrientation = "horizontal" | "vertical";
export type FlowState = {
    nodes: {
        [id: string]: {
            width: number;
            height: number;
            disabled?: boolean;
            /** Y offset from the node's top edge to the outgoing anchor's midpoint. */
            startAnchorOffset?: number;
            /** Y offset from the node's top edge to the incoming anchor's midpoint. */
            endAnchorOffset?: number;
        };
    };
    tree: TreeNode;
    align: FlowAlign;
    orientation: FlowOrientation;
};
export type Edges = [string, string][];
export type NodePositions = Record<string, {
    x: number;
    y: number;
}>;
export type DiagramRect = {
    width: number;
    height: number;
};
/**
 * Computes edges between flow nodes from the tree stored in FlowState.
 *
 * Rules (from spec):
 * 1. Adjacent `node` entries in a list are connected directly.
 * 2. A `node` adjacent to a `parallel` group connects to all of that group's
 *    immediate entry/exit points.
 * 3. Adjacent `parallel` groups are NOT connected to one another.
 * 4. A `list` group connects externally to its first and last node only.
 *
 * The function is pure — it does not access the DOM and has no side effects.
 */
export declare function computeEdges(flowState: FlowState): Edges;
/**
 * Computes pixel positions for every node in the flow.
 *
 * - Horizontal flows lay lists left-to-right and parallel branches top-to-bottom.
 * - Vertical flows lay lists top-to-bottom and parallel branches left-to-right.
 * - `columnGap` controls primary-axis list spacing; `rowGap` controls branch spacing.
 *
 * Returns a map of node ID → `{ x, y }` (top-left corner, relative to the
 * flow container origin).
 *
 * This function is pure — it does not access the DOM.
 */
export declare function computePositions(flowState: FlowState, { columnGap, rowGap }?: {
    columnGap?: number | undefined;
    rowGap?: number | undefined;
}): NodePositions;
/**
 * Returns the bounding rectangle of the entire diagram.
 *
 * - `width`  = x of the rightmost node's left edge + that node's width
 * - `height` = y of the bottommost node's top edge + that node's height
 *
 * This function is pure — it does not access the DOM.
 */
export declare function computeDiagramRect(positions: NodePositions, flowState: FlowState): DiagramRect;
