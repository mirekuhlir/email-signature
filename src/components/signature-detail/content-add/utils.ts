import { generateRandomId } from "@/src/utils/generateRandomId";
import { ContentType } from "@/src/const/content";
import t from "@/src/localization/translate";

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
                    type: ContentType.TEXT,
                    fontSize: "14px",
                    color: "rgb(0, 0, 0)",
                    fontFamily: "Arial",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    letterSpacing: "0px",
                    lineHeight: "1",
                    textAlign: "left",
                    padding: "0px 0px 5px 0px",
                },
            ],
        },
    };
};

export const getImage = () => {
    return {
        id: generateRandomId(),
        content: {
            type: ContentType.IMAGE,
            components: [
                {
                    id: generateRandomId(),
                    src: "",
                    margin: "0 auto 0 0",
                },
            ],
        },
    };
};

export const getEmailTextExample = () => {
    return {
        email: "example@email.com",
        prefix: "e: ",
    };
};

export const getPhoneTextExample = () => {
    return {
        phone: "+1 123 456 7890",
        prefix: "p: ",
    };
};

export const getWebsiteTextExample = () => {
    return {
        website: "www.example.com",
        prefix: "w: ",
    };
};

export const getCustomValueTextExample = () => {
    return {
        value: "example text",
        prefix: "prefix text: ",
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
                    type: ContentType.TEXT,
                    fontSize: "14px",
                    textDecoration: "none",
                    color: "rgb(0, 0, 0)",
                    fontFamily: "Arial",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    letterSpacing: "0px",
                    lineHeight: "1",
                    textAlign: "left",
                    padding: "0px 0px 5px 0px",
                },
                {
                    id: generateRandomId(),
                    text: getEmailTextExample().email,
                    type: ContentType.EMAIL_LINK,
                    textDecoration: "none",
                    fontSize: "14px",
                    color: "rgb(0, 0, 0)",
                    fontFamily: "Arial",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    letterSpacing: "0px",
                    lineHeight: "1",
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
                    type: ContentType.TEXT,
                    fontSize: "14px",
                    textDecoration: "none",
                    color: "rgb(0, 0, 0)",
                    fontFamily: "Arial",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    letterSpacing: "0px",
                    lineHeight: "1",
                    textAlign: "left",
                    padding: "0px 0px 5px 0px",
                },
                {
                    id: generateRandomId(),
                    text: getPhoneTextExample().phone,
                    type: ContentType.PHONE_LINK,
                    fontSize: "14px",
                    textDecoration: "none",
                    color: "rgb(0, 0, 0)",
                    fontFamily: "Arial",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    letterSpacing: "0px",
                    lineHeight: "1",
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
                    type: ContentType.TEXT,
                    fontSize: "14px",
                    color: "rgb(0, 0, 0)",
                    fontFamily: "Arial",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    letterSpacing: "0px",
                    lineHeight: "1",
                    textAlign: "left",
                    padding: "0px 0px 5px 0px",
                },
                {
                    id: generateRandomId(),
                    text: getWebsiteTextExample().website,
                    type: ContentType.WEBSITE_LINK,
                    fontSize: "14px",
                    color: "rgb(0, 0, 0)",
                    fontFamily: "Arial",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    letterSpacing: "0px",
                    lineHeight: "1",
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
                    type: ContentType.TEXT,
                    fontSize: "14px",
                    color: "rgb(0, 0, 0)",
                    fontFamily: "Arial",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    letterSpacing: "0px",
                    lineHeight: "1",
                    textAlign: "left",
                    padding: "0px 0px 5px 0px",
                },
                {
                    id: generateRandomId(),
                    text: getCustomValueTextExample().value,
                    type: ContentType.CUSTOM_VALUE,
                    fontSize: "14px",
                    color: "rgb(0, 0, 0)",
                    fontFamily: "Arial",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    letterSpacing: "0px",
                    lineHeight: "1",
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
