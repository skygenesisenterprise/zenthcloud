import { type ReactNode } from "react";
type FlowParallelNodeProps = {
    children: ReactNode;
    /** When "end", each branch is right-aligned to the widest branch. */
    align?: "end";
};
export declare function FlowParallelNode({ children, align }: FlowParallelNodeProps): import("react/jsx-runtime").JSX.Element;
export {};
