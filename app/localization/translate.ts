import {en} from "./en"


const allLanguages = {
    en,
}

const currentLanguage = "en"

const t = (key: string) => {


    const currentTranslation = allLanguages[currentLanguage]
    const targetKey = key as keyof typeof en

    if (!currentTranslation[targetKey]) {
        return key
    }

    return currentTranslation[targetKey]
}

export default t