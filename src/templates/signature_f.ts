import { generateRandomId } from "../utils/generateRandomId";

const getLocalizedContent = () => {
    return {
        name: "ROBERT ",
        surname: "STANFORD",
        title: "Lawyer",
        phonePrefix: "P: ",
        phoneValue: "+1 123 456 7890",
        emailPrefix: "E: ",
        emailValue: "example@email.com",
        websitePrefix: "W: ",
        websiteValue: "www.example.com",
        websiteLink: "https://www.example.com",
        address1: "3943 Lyon Avenue, Worcester",
        address2: "Massachusetts 01608",
        disclaimer:
            "This email is intended only for the recipient and may contain confidential information.\nIf you are not the intended recipient, please notify the sender and delete this email.",
    };
};

export const signature_f = () => {
    const localizedContent = getLocalizedContent();
    return {
        "info": {
            templateSlug: "signature-f",
            version: "0.1",
            name: "Signature F",
        },
        "colors": [
            "rgb(41, 41, 41)",
            "rgb(94, 94, 94)",
        ],
        "dimensions": {
            "spaces": ["15", "10", "5", "7", "3"],
            "corners": [],
            "borders": ["2"],
            "lengths": [],
        },
        "rows": [
            {
                "id": generateRandomId(),
                "columns": [
                    {
                        "id": generateRandomId(),
                        "rows": [
                            {
                                "id": generateRandomId(),
                                "content": {
                                    "type": "image",
                                    "components": [
                                        {
                                            "id": generateRandomId(),
                                            "src":
                                                `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/examples/signature_f_preview.png`,
                                            "width": "0px",
                                            "height": "0px",
                                            "margin": "0 auto 0 0",
                                            "padding": "0px 15px 0px 0px",
                                            "originalSrc":
                                                `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/examples/signature_f_original.jpg`,
                                            "borderRadius": "0px 0px 0px 0px",
                                            "previewWidth": 107,
                                            "imageSettings": {
                                                "crop": {
                                                    "x": 20.65116670396593,
                                                    "y": 0.5411873537689581,
                                                    "unit": "%",
                                                    "width": 59.46735594007703,
                                                    "height": 74.33469903953747,
                                                },
                                                "aspect": 1,
                                                "isCircular": true,
                                                "borderRadius": {
                                                    "topLeft": 0,
                                                    "topRight": 0,
                                                    "bottomLeft": 0,
                                                    "bottomRight": 0,
                                                },
                                            },
                                            "borderTopColor": "rgb(0, 0, 0)",
                                            "borderTopStyle": "none",
                                            "borderTopWidth": "0px",
                                            "borderLeftColor": "rgb(0, 0, 0)",
                                            "borderLeftStyle": "none",
                                            "borderLeftWidth": "0px",
                                            "borderRightColor":
                                                "rgb(94, 94, 94)",
                                            "borderRightStyle": "none",
                                            "borderRightWidth": "0px",
                                            "borderBottomColor": "rgb(0, 0, 0)",
                                            "borderBottomStyle": "none",
                                            "borderBottomWidth": "0px",
                                        },
                                    ],
                                },
                            },
                        ],
                        "style": {
                            "width": "auto",
                            "height": "auto",
                            "padding": "0px 0px 0px 0px",
                            "borderRadius": "0px 0px 0px 0px",
                            "verticalAlign": "middle",
                            "borderTopColor": "rgb(0, 0, 0)",
                            "borderTopStyle": "none",
                            "borderTopWidth": "0px",
                            "borderLeftColor": "rgb(0, 0, 0)",
                            "borderLeftStyle": "none",
                            "borderLeftWidth": "0px",
                            "borderRightColor": "rgb(0, 0, 0)",
                            "borderRightStyle": "none",
                            "borderRightWidth": "0px",
                            "borderBottomColor": "rgb(0, 0, 0)",
                            "borderBottomStyle": "none",
                            "borderBottomWidth": "0px",
                        },
                    },
                    {
                        "id": generateRandomId(),
                        "rows": [
                            {
                                "id": generateRandomId(),
                                "content": {
                                    "type": "customValue",
                                    "components": [
                                        {
                                            "id": generateRandomId(),
                                            "text": localizedContent.name,
                                            "type": "text",
                                            "color": "rgb(94, 94, 94)",
                                            "width": "0px",
                                            "height": "0px",
                                            "padding": "0px 0px 5px 0px",
                                            "fontSize": "15px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "normal",
                                            "lineHeight": "1",
                                            "borderRadius": "0px 0px 0px 0px",
                                            "letterSpacing": "3px",
                                            "borderTopColor": "rgb(0, 0, 0)",
                                            "borderTopStyle": "none",
                                            "borderTopWidth": "0px",
                                            "textDecoration": "none",
                                            "borderLeftColor": "rgb(0, 0, 0)",
                                            "borderLeftStyle": "none",
                                            "borderLeftWidth": "0px",
                                            "borderRightColor": "rgb(0, 0, 0)",
                                            "borderRightStyle": "none",
                                            "borderRightWidth": "0px",
                                            "borderBottomColor": "rgb(0, 0, 0)",
                                            "borderBottomStyle": "none",
                                            "borderBottomWidth": "0px",
                                        },
                                        {
                                            "id": generateRandomId(),
                                            "text": localizedContent.surname,
                                            "type": "customValue",
                                            "color": "rgb(41, 41, 41)",
                                            "fontSize": "15px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "bold",
                                            "lineHeight": "1",
                                            "letterSpacing": "3px",
                                            "textDecoration": "none",
                                        },
                                    ],
                                },
                            },
                            {
                                "id": generateRandomId(),
                                "content": {
                                    "type": "text",
                                    "components": [
                                        {
                                            "id": generateRandomId(),
                                            "text": localizedContent.title,
                                            "color": "rgb(41, 41, 41)",
                                            "width": "0px",
                                            "height": "0px",
                                            "padding": "0px 0px 15px 0px",
                                            "fontSize": "15px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "normal",
                                            "lineHeight": "1",
                                            "borderRadius": "0px 0px 0px 0px",
                                            "letterSpacing": "0px",
                                            "borderTopColor": "rgb(0, 0, 0)",
                                            "borderTopStyle": "none",
                                            "borderTopWidth": "0px",
                                            "textDecoration": "none",
                                            "borderLeftColor": "rgb(0, 0, 0)",
                                            "borderLeftStyle": "none",
                                            "borderLeftWidth": "0px",
                                            "borderRightColor": "rgb(0, 0, 0)",
                                            "borderRightStyle": "none",
                                            "borderRightWidth": "0px",
                                            "borderBottomColor": "rgb(0, 0, 0)",
                                            "borderBottomStyle": "none",
                                            "borderBottomWidth": "0px",
                                        },
                                    ],
                                },
                            },
                            {
                                "id": generateRandomId(),
                                "content": {
                                    "type": "phone",
                                    "components": [
                                        {
                                            "id": generateRandomId(),
                                            "text":
                                                localizedContent.phonePrefix,
                                            "type": "text",
                                            "color": "rgb(41, 41, 41)",
                                            "width": "0px",
                                            "height": "0px",
                                            "padding": "0px 0px 7px 0px",
                                            "fontSize": "15px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "bold",
                                            "lineHeight": "1",
                                            "borderRadius": "0px 0px 0px 0px",
                                            "letterSpacing": "0px",
                                            "borderTopColor": "rgb(0, 0, 0)",
                                            "borderTopStyle": "none",
                                            "borderTopWidth": "0px",
                                            "textDecoration": "none",
                                            "borderLeftColor": "rgb(0, 0, 0)",
                                            "borderLeftStyle": "none",
                                            "borderLeftWidth": "0px",
                                            "borderRightColor": "rgb(0, 0, 0)",
                                            "borderRightStyle": "none",
                                            "borderRightWidth": "0px",
                                            "borderBottomColor": "rgb(0, 0, 0)",
                                            "borderBottomStyle": "none",
                                            "borderBottomWidth": "0px",
                                        },
                                        {
                                            "id": generateRandomId(),
                                            "text": localizedContent.phoneValue,
                                            "type": "phoneLink",
                                            "color": "rgb(94, 94, 94)",
                                            "fontSize": "14px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "normal",
                                            "lineHeight": "1",
                                            "letterSpacing": "0px",
                                            "textDecoration": "none",
                                        },
                                    ],
                                },
                            },
                            {
                                "id": generateRandomId(),
                                "content": {
                                    "type": "email",
                                    "components": [
                                        {
                                            "id": generateRandomId(),
                                            "text":
                                                localizedContent.emailPrefix,
                                            "type": "text",
                                            "color": "rgb(41, 41, 41)",
                                            "width": "0px",
                                            "height": "0px",
                                            "padding": "0px 0px 7px 0px",
                                            "fontSize": "15px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "bold",
                                            "lineHeight": "1",
                                            "borderRadius": "0px 0px 0px 0px",
                                            "letterSpacing": "0px",
                                            "borderTopColor": "rgb(0, 0, 0)",
                                            "borderTopStyle": "none",
                                            "borderTopWidth": "0px",
                                            "textDecoration": "none",
                                            "borderLeftColor": "rgb(0, 0, 0)",
                                            "borderLeftStyle": "none",
                                            "borderLeftWidth": "0px",
                                            "borderRightColor": "rgb(0, 0, 0)",
                                            "borderRightStyle": "none",
                                            "borderRightWidth": "0px",
                                            "borderBottomColor": "rgb(0, 0, 0)",
                                            "borderBottomStyle": "none",
                                            "borderBottomWidth": "0px",
                                        },
                                        {
                                            "id": generateRandomId(),
                                            "text": localizedContent.emailValue,
                                            "type": "emailLink",
                                            "color": "rgb(94, 94, 94)",
                                            "fontSize": "14px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "normal",
                                            "lineHeight": "1",
                                            "letterSpacing": "0px",
                                            "textDecoration": "none",
                                        },
                                    ],
                                },
                            },
                            {
                                "id": generateRandomId(),
                                "content": {
                                    "type": "website",
                                    "components": [
                                        {
                                            "id": generateRandomId(),
                                            "text":
                                                localizedContent.websitePrefix,
                                            "type": "text",
                                            "color": "rgb(41, 41, 41)",
                                            "width": "0px",
                                            "height": "0px",
                                            "padding": "0px 0px 7px 0px",
                                            "fontSize": "15px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "bold",
                                            "lineHeight": "1",
                                            "borderRadius": "0px 0px 0px 0px",
                                            "letterSpacing": "0px",
                                            "borderTopColor": "rgb(0, 0, 0)",
                                            "borderTopStyle": "none",
                                            "borderTopWidth": "0px",
                                            "textDecoration": "none",
                                            "borderLeftColor": "rgb(0, 0, 0)",
                                            "borderLeftStyle": "none",
                                            "borderLeftWidth": "0px",
                                            "borderRightColor": "rgb(0, 0, 0)",
                                            "borderRightStyle": "none",
                                            "borderRightWidth": "0px",
                                            "borderBottomColor": "rgb(0, 0, 0)",
                                            "borderBottomStyle": "none",
                                            "borderBottomWidth": "0px",
                                        },
                                        {
                                            "id": generateRandomId(),
                                            "link":
                                                localizedContent.websiteLink,
                                            "text":
                                                localizedContent.websiteValue,
                                            "type": "websiteLink",
                                            "color": "rgb(94, 94, 94)",
                                            "fontSize": "14px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "normal",
                                            "lineHeight": "1",
                                            "letterSpacing": "0px",
                                            "textDecoration": "none",
                                        },
                                    ],
                                },
                            },
                            {
                                "id": generateRandomId(),
                                "content": {
                                    "type": "text",
                                    "components": [
                                        {
                                            "id": generateRandomId(),
                                            "text": localizedContent.address1,
                                            "color": "rgb(94, 94, 94)",
                                            "width": "0px",
                                            "height": "0px",
                                            "padding": "0px 0px 3px 0px",
                                            "fontSize": "14px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "normal",
                                            "lineHeight": "1",
                                            "borderRadius": "0px 0px 0px 0px",
                                            "letterSpacing": "0px",
                                            "borderTopColor": "rgb(0, 0, 0)",
                                            "borderTopStyle": "none",
                                            "borderTopWidth": "0px",
                                            "textDecoration": "none",
                                            "borderLeftColor": "rgb(0, 0, 0)",
                                            "borderLeftStyle": "none",
                                            "borderLeftWidth": "0px",
                                            "borderRightColor": "rgb(0, 0, 0)",
                                            "borderRightStyle": "none",
                                            "borderRightWidth": "0px",
                                            "borderBottomColor": "rgb(0, 0, 0)",
                                            "borderBottomStyle": "none",
                                            "borderBottomWidth": "0px",
                                        },
                                    ],
                                },
                            },
                            {
                                "id": generateRandomId(),
                                "content": {
                                    "type": "text",
                                    "components": [
                                        {
                                            "id": generateRandomId(),
                                            "text": localizedContent.address2,
                                            "color": "rgb(94, 94, 94)",
                                            "width": "0px",
                                            "height": "0px",
                                            "padding": "0px 0px 0px 0px",
                                            "fontSize": "14px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "normal",
                                            "lineHeight": "1",
                                            "borderRadius": "0px 0px 0px 0px",
                                            "letterSpacing": "0px",
                                            "borderTopColor": "rgb(0, 0, 0)",
                                            "borderTopStyle": "none",
                                            "borderTopWidth": "0px",
                                            "textDecoration": "none",
                                            "borderLeftColor": "rgb(0, 0, 0)",
                                            "borderLeftStyle": "none",
                                            "borderLeftWidth": "0px",
                                            "borderRightColor": "rgb(0, 0, 0)",
                                            "borderRightStyle": "none",
                                            "borderRightWidth": "0px",
                                            "borderBottomColor": "rgb(0, 0, 0)",
                                            "borderBottomStyle": "none",
                                            "borderBottomWidth": "0px",
                                        },
                                    ],
                                },
                            },
                        ],
                        "style": {
                            "width": "auto",
                            "height": "auto",
                            "padding": "0px 0px 0px 10px",
                            "borderRadius": "0px 0px 0px 0px",
                            "verticalAlign": "top",
                            "borderTopColor": "rgb(0, 0, 0)",
                            "borderTopStyle": "none",
                            "borderTopWidth": "0px",
                            "borderLeftColor": "rgb(94, 94, 94)",
                            "borderLeftStyle": "solid",
                            "borderLeftWidth": "2px",
                            "borderRightColor": "rgb(0, 0, 0)",
                            "borderRightStyle": "none",
                            "borderRightWidth": "0px",
                            "borderBottomColor": "rgb(0, 0, 0)",
                            "borderBottomStyle": "none",
                            "borderBottomWidth": "0px",
                        },
                    },
                ],
            },
            {
                "id": generateRandomId(),
                "columns": [
                    {
                        "id": generateRandomId(),
                        "rows": [
                            {
                                "id": generateRandomId(),
                                "content": {
                                    "type": "text",
                                    "components": [
                                        {
                                            "id": generateRandomId(),
                                            "text": localizedContent.disclaimer,
                                            "color": "rgb(94, 94, 94)",
                                            "width": "0px",
                                            "height": "0px",
                                            "padding": "10px 0px 0px 0px",
                                            "fontSize": "14px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "normal",
                                            "lineHeight": "1.25",
                                            "borderRadius": "0px 0px 0px 0px",
                                            "letterSpacing": "0px",
                                            "borderTopColor": "rgb(0, 0, 0)",
                                            "borderTopStyle": "none",
                                            "borderTopWidth": "0px",
                                            "textDecoration": "none",
                                            "borderLeftColor": "rgb(0, 0, 0)",
                                            "borderLeftStyle": "none",
                                            "borderLeftWidth": "0px",
                                            "borderRightColor": "rgb(0, 0, 0)",
                                            "borderRightStyle": "none",
                                            "borderRightWidth": "0px",
                                            "borderBottomColor": "rgb(0, 0, 0)",
                                            "borderBottomStyle": "none",
                                            "borderBottomWidth": "0px",
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };
};
