import { generateRandomId } from "@/utils/generateRandomId";
import { ContentType } from "@/const/content";
import t from "@/app/localization/translate";

export const getContentAdd = (type: ContentType) => {
    switch (type) {
        case ContentType.TEXT:
            return getText();
        /*    TODO - case ContentType.IMAGE: */
        case ContentType.EMAIL:
            return getEmail();
        default:
            return getText();
    }
};

const getEmail = () => {
    return {
        id: generateRandomId(),
        style: { backgroundColor: "green" },
        content: {
            type: ContentType.EMAIL,
            components: [
                {
                    id: generateRandomId(),
                    text: "email: ",
                    fontSize: "14",
                },
                {
                    id: generateRandomId(),
                    text: "mirek.uhlir@gmail.com",
                    type: ContentType.EMAIL_LINK,
                    fontSize: "14",
                },
            ],
        },
    };
};

export const getExampleText = () => t("exampleText");

const getText = () => {
    return {
        id: generateRandomId(),
        style: { backgroundColor: "purple" },
        content: {
            type: ContentType.TEXT,
            components: [
                {
                    id: generateRandomId(),
                    text: getExampleText(),
                },
            ],
        },
    };
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
