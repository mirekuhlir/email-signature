import { createInstance, i18n, TFunction } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { getOptions } from "./settings";

interface TranslationOptions {
    keyPrefix?: string;
}

const initI18next = async (
    lng: string,
): Promise<i18n> => {
    const i18nInstance = createInstance();
    await i18nInstance
        .use(initReactI18next)
        .use(
            resourcesToBackend((language: string, namespace: string) =>
                import(`./locales/${language}/${namespace}.json`)
            ),
        )
        .init(getOptions(lng));
    return i18nInstance;
};

export async function useTranslation(
    lng?: string,
    options?: TranslationOptions,
): Promise<{
    t: TFunction;
    i18n: i18n;
}> {
    const i18nextInstance = await initI18next(lng || "en");
    return {
        t: i18nextInstance.getFixedT(
            lng || "en",
            "translation",
            options?.keyPrefix,
        ),
        i18n: i18nextInstance,
    };
}
