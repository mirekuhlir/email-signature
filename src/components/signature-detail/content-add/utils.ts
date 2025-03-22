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
        case ContentType.PHONE:
            return getPhone();
        case ContentType.WEBSITE:
            return getWebsite();
        case ContentType.CUSTOM_VALUE:
            return getCustomValue();
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
        content: {
            type: ContentType.EMAIL,
            components: [
                {
                    id: generateRandomId(),
                    text: "email: ",
                    fontSize: "14",
                    textDecoration: "none",
                    type: ContentType.TEXT,

                },
                {
                    id: generateRandomId(),
                    text: "mirek.uhlir@gmail.com",
                    type: ContentType.EMAIL_LINK,
                    textDecoration: "none",
                    fontSize: "14",
                },
            ],
        },
    };
};

const getPhone = () => {
    return {
        id: generateRandomId(),
        content: {
            type: ContentType.PHONE,
            components: [
                {
                    id: generateRandomId(),
                    text: "tel: ",
                    fontSize: "14",
                    type: ContentType.TEXT,
                },
                {
                    id: generateRandomId(),
                    text: "+420 123 456 789",
                    type: ContentType.PHONE_LINK,
                    fontSize: "14",
                },
            ],
        },
    };
};

const getWebsite = () => {
    return {
        id: generateRandomId(),
        content: {
            type: ContentType.WEBSITE,
            components: [
                {
                    id: generateRandomId(),
                    text: "web: ",
                    fontSize: "14",
                    type: ContentType.TEXT,
                    color: "rgb(0, 0, 0)",
                    textDecoration: "none",
                },
                {
                    id: generateRandomId(),
                    text: "www.example.com",
                    type: ContentType.WEBSITE_LINK,
                    fontSize: "14",
                    color: "rgb(0, 0, 0)",
                    textDecoration: "none",
                },
            ],
        },
    };
};

const getCustomValue = () => {
    return {
        id: generateRandomId(),
        content: {
            type: ContentType.CUSTOM_VALUE,
            components: [
                {
                    id: generateRandomId(),
                    text: "prefix: ",
                    fontSize: "14",
                    type: ContentType.TEXT,
                },
                {
                    id: generateRandomId(),
                    text: "custom value",
                    fontSize: "14",
                    type: ContentType.TEXT,
                },
            ],
        },
    };
};

export const getExampleText = () => t("exampleText");

const getText = () => {
    return {
        id: generateRandomId(),
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
        columns: [
            {
                id: generateRandomId(),
                rows: [getContentAdd(type)],
            },
        ],
    });
};
