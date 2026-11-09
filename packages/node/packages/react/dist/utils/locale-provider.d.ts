import { type ReactNode } from "react";
export interface KumoTranslations {
    label?: {
        optional: string;
        tooltip: string;
    };
    layerDialog: {
        close: string;
        cancel: string;
    };
}
export type KumoTranslationsPartial = {
    [Key in keyof KumoTranslations]?: Partial<NonNullable<KumoTranslations[Key]>>;
};
type ResolvedKumoTranslations = {
    [Key in keyof KumoTranslations]-?: NonNullable<KumoTranslations[Key]>;
};
export interface KumoLocaleProviderProps {
    children: ReactNode;
    /**
     * Partial overrides for Kumo's built-in English copy. Components without an
     * override continue to use their English defaults.
     */
    translations?: KumoTranslationsPartial;
}
/**
 * Supplies translations for Kumo-owned UI copy. Explicit component props take
 * precedence over these defaults.
 */
export declare function KumoLocaleProvider({ children, translations, }: KumoLocaleProviderProps): import("react/jsx-runtime").JSX.Element;
/** @internal Used by Kumo components to resolve translated built-in copy. */
export declare function useKumoLocale(): ResolvedKumoTranslations;
export {};
