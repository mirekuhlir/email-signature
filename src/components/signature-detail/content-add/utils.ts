import { generateRandomId } from "@/src/utils/generateRandomId";
import { ContentType } from "@/src/const/content";
import t from "@/app/localization/translate";

export const getContentAdd = (type: ContentType) => {
    switch (type) {
        case ContentType.TEXT:
            return getText();
        case ContentType.IMAGE:
            return getImage();
        case ContentType.EMAIL:
            return getEmail();
        default:
            return getText();
    }
};

export const getImage = () => {
    return {
        id: generateRandomId(),
        style: {
            display: "table",
            margin: "0 auto",
        },
        content: {
            type: ContentType.IMAGE,
            components: [
                {
                    id: generateRandomId(),
                    src: "",
                },
            ],
        },
    };
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
                    type: ContentType.TEXT,
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
