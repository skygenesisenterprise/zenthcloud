import { type ReactNode } from "react";
export type DescendantInfo<T = Record<string, unknown>> = {
    id: string;
    props: T;
    renderOrder: number;
};
type DescendantsContextType<DescendantType = Record<string, unknown>> = {
    register: (id: string, renderOrder: number, props?: DescendantType) => {
        unregister: () => void;
    };
    descendants: DescendantInfo<DescendantType>[];
    claimRenderOrder: (id: string) => number;
};
export declare function useDescendants<DescendantType extends Record<string, unknown>>(): DescendantsContextType<DescendantType>;
type DescendantsProviderProps<T extends Record<string, unknown>> = {
    value: DescendantsContextType<T>;
    children: ReactNode;
};
export declare function DescendantsProvider<T extends Record<string, unknown>>({ value, children, }: DescendantsProviderProps<T>): import("react/jsx-runtime").JSX.Element;
export declare function useDescendantsContext<T extends Record<string, unknown>>(): DescendantsContextType<T>;
export declare function useOptionalDescendantsContext<T extends Record<string, unknown>>(): DescendantsContextType<T> | null;
export declare function useDescendantIndex<T extends Record<string, unknown>>(props?: T, customId?: string): {
    index: number;
    id: string;
};
export {};
