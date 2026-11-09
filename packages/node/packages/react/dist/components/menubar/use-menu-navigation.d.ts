import React from "react";
type UseMenuNavigationProps = {
    menuRef: React.RefObject<HTMLElement | null>;
    direction?: "horizontal" | "vertical";
};
export declare const useMenuNavigation: ({ menuRef, direction, }: UseMenuNavigationProps) => void;
export {};
