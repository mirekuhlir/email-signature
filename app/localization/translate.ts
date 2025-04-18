import en from "./en.json" assert { type: "json" };

type TranslationType = {
    [key: string]: string;
};

const allTranslations: Record<string, TranslationType> = {
    en,
};

const currentLanguage = "en";

const t = (key: string) => {
    const currentTranslation = allTranslations[currentLanguage];
    const targetKey = key as keyof typeof currentTranslation;

    if (!currentTranslation[targetKey]) {
        return key;
    }

    return currentTranslation[targetKey];
};

export default t;
