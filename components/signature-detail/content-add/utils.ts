import { generateRandomId } from "@/utils/generateRandomId";
import { ContentType } from "@/const/content";
import t from "@/app/localization/translate";

export const getExampleText = () => t("exampleText");

const getText = () => {
    return {
        id: generateRandomId(),
        style: { backgroundColor: "purple" },
        content: {
            type: ContentType.TEXT,
            text: getExampleText(),
        },
    };
};

export const getContentAdd = (type: ContentType) => {
    switch (type) {
        case ContentType.TEXT:
            return getText();
        default:
            return getText();
    }
};

export const getRowTable = (type: ContentType) => {
    return ({
        id: generateRandomId(),
        style: { backgroundColor: "purple" },
        columns: [
            {
                id: generateRandomId(),
                rows: [getContentAdd(type)],
            },
        ],
    });
};
