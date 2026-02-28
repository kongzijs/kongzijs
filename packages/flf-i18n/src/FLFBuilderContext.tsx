import { createContext, useContext, ReactNode, useMemo } from "react";
import { FLFBuilderDictionary } from "./types";
import { enUS } from "./locales/en";

export type Locale =
    | "en"
    | "zh-CN"
    | "zh-TW"
    | "ja"
    | "ko"
    | "hi"
    | "ar"
    | "ru"
    | "es"
    | string;

export interface I18nContextType {
    locale: Locale;
    dictionary: FLFBuilderDictionary;
}

const defaultContextValue: I18nContextType = {
    locale: "en",
    dictionary: enUS,
};

export const FLFBuilderContext =
    createContext<I18nContextType>(defaultContextValue);

export interface FLFBuilderProviderProps {
    children: ReactNode;
    locale?: Locale;
    dictionary?: FLFBuilderDictionary;
    customDictionary?: Partial<FLFBuilderDictionary>;
}

export function FLFBuilderProvider({
    children,
    locale = "en",
    dictionary = enUS,
    customDictionary,
}: FLFBuilderProviderProps) {
    const value = useMemo(() => {
        let baseDictionary = dictionary;

        // Deep merge custom dictionary if provided
        const finalDictionary = customDictionary
            ? {
                  editor: {
                      ...baseDictionary.editor,
                      ...customDictionary.editor,
                  },
                  markdown: {
                      ...baseDictionary.markdown,
                      ...customDictionary.markdown,
                  },
                  settings: {
                      ...baseDictionary.settings,
                      ...customDictionary.settings,
                  },
              }
            : baseDictionary;

        return {
            locale,
            dictionary: finalDictionary,
        };
    }, [locale, dictionary, customDictionary]);

    return (
        <FLFBuilderContext.Provider value={value}>
            {children}
        </FLFBuilderContext.Provider>
    );
}

export function useFLFTranslation() {
    const context = useContext(FLFBuilderContext);
    return {
        t: context.dictionary,
        locale: context.locale,
    };
}
