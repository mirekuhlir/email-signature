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

export const getImage = () => {
    return {
        id: generateRandomId(),
        // TODO - možná není potřeba, buď vrátit a nebo smazat
        /*       style: {
            display: "table",
            margin: "0 auto",
        }, */
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

export const getEmailTextExample = () => {
    return {
        email: "example@email.com",
        prefix: "email: ",
    };
};

export const getPhoneTextExample = () => {
    return {
        phone: "+1 123 456 7890",
        prefix: "tel: ",
    };
};

export const getWebsiteTextExample = () => {
    return {
        website: "www.example.com",
        prefix: "web: ",
    };
};

export const getCustomValueTextExample = () => {
    return {
        value: "custom value",
        prefix: "prefix: ",
    };
};

export const getEmail = () => {
    return {
        id: generateRandomId(),
        content: {
            type: ContentType.EMAIL,
            components: [
                {
                    id: generateRandomId(),
                    text: getEmailTextExample().prefix,
                    fontSize: "14",
                    textDecoration: "none",
                    type: ContentType.TEXT,
                },
                {
                    id: generateRandomId(),
                    text: getEmailTextExample().email,
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
                    text: getPhoneTextExample().prefix,
                    fontSize: "14",
                    textDecoration: "none",
                    type: ContentType.TEXT,
                },
                {
                    id: generateRandomId(),
                    text: getPhoneTextExample().phone,
                    type: ContentType.PHONE_LINK,
                    fontSize: "14",
                    textDecoration: "none",
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
                    text: getWebsiteTextExample().prefix,
                    fontSize: "14",
                    type: ContentType.TEXT,
                    color: "rgb(0, 0, 0)",
                    textDecoration: "none",
                },
                {
                    id: generateRandomId(),
                    text: getWebsiteTextExample().website,
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
                    text: getCustomValueTextExample().prefix,
                    fontSize: "14",
                    type: ContentType.TEXT,
                },
                {
                    id: generateRandomId(),
                    text: getCustomValueTextExample().value,
                    fontSize: "14",
                    type: ContentType.TEXT,
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
