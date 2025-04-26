// generateRandomId()

import { generateRandomId } from "../utils/generateRandomId";

const getLocalizedContent = () => {
    return {
        name: "RICHARD S. BREWER",
        place: "Crestwood Realty",
        phonePrefix: "Phone: ",
        phoneValue: "+1 2015577537",
        emailPrefix: "Email: ",
        emailValue: "example@email.com",
        addressPrefix: "Address: ",
        addressValue: "2645 Beeghley Street, \nWaco, TX 76701",
        websitePrefix: "Visit ",
        websiteValue: "www.example.com",
    };
};

export const signature_c = () => {
    return {
        info: {
            templateSlug: "signature-c",
            version: "0.1",
            name: "Signature C",
        },

        "colors": [
            "rgb(0, 0, 0)",
            "rgb(48, 52, 112)",
        ],
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
                                            "id": "auizuj6",
                                            "src":
                                                "https://signatures-photos-dev.s3.us-east-1.amazonaws.com/examples/signature_c_preview.png",
                                            "padding": "0px 0px 0px 0px",
                                            "originalSrc":
                                                "https://signatures-photos-dev.s3.us-east-1.amazonaws.com/examples/signature_c_original.png",
                                            "borderRadius": "0",
                                            "previewWidth": 200,
                                            "imageSettings": {
                                                "crop": {
                                                    "x": 34.834681825032035,
                                                    "y": 2.0858955158081995,
                                                    "unit": "%",
                                                    "width": 55.25844534134578,
                                                    "height": 82.84677837308087,
                                                },
                                                "aspect": 1,
                                                "isCircular": true,
                                                "borderRadius": 0,
                                            },
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
                                            "text": getLocalizedContent().name,
                                            "type": "text",
                                            "color": "rgb(48, 52, 112)",
                                            "padding": "15px 0px 0px 0px",
                                            "fontSize": "17px",
                                            "fontStyle": "normal",
                                            "textAlign": "center",
                                            "fontFamily": "Arial",
                                            "fontWeight": "bold",
                                            "lineHeight": "1",
                                            "borderRadius": "0",
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
                                            "text": getLocalizedContent().place,
                                            "type": "text",
                                            "color": "rgb(0, 0, 0)",
                                            "padding": "10px 0px 15px 0px",
                                            "fontSize": "16px",
                                            "fontStyle": "normal",
                                            "textAlign": "center",
                                            "fontFamily": "Arial",
                                            "fontWeight": "bold",
                                            "lineHeight": "1",
                                            "borderRadius": "0",
                                            "letterSpacing": "0px",
                                            "textDecoration": "none",
                                        },
                                    ],
                                },
                            },
                        ],
                        "style": {
                            "padding": "0px 0px 0px 0px",
                            "borderRadius": "0px",
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
                            "borderBottomColor": "rgb(48, 52, 112)",
                            "borderBottomStyle": "solid",
                            "borderBottomWidth": "2px",
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
                                    "type": "phone",
                                    "components": [
                                        {
                                            "id": generateRandomId(),
                                            "text": getLocalizedContent()
                                                .phonePrefix,
                                            "type": "text",
                                            "color": "rgb(48, 52, 112)",
                                            "padding": "15px 0px 4px 0px",
                                            "fontSize": "14px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "bold",
                                            "lineHeight": "1",
                                            "borderRadius": "0",
                                            "letterSpacing": "0px",
                                            "textDecoration": "none",
                                        },
                                        {
                                            "id": generateRandomId(),
                                            "text": getLocalizedContent()
                                                .phoneValue,
                                            "type": "phoneLink",
                                            "color": "rgb(0, 0, 0)",
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
                                            "text": getLocalizedContent()
                                                .emailPrefix,
                                            "type": "text",
                                            "color": "rgb(48, 52, 112)",
                                            "padding": "0px 0px 4px 0px",
                                            "fontSize": "14px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "bold",
                                            "lineHeight": "1",
                                            "borderRadius": "0",
                                            "letterSpacing": "0px",
                                            "textDecoration": "none",
                                        },
                                        {
                                            "id": generateRandomId(),
                                            "text": getLocalizedContent()
                                                .emailValue,
                                            "type": "emailLink",
                                            "color": "rgb(0, 0, 0)",
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
                                "id": "omhwcp8",
                                "content": {
                                    "type": "customValue",
                                    "components": [
                                        {
                                            "id": "1uha5r5",
                                            "text": getLocalizedContent()
                                                .addressPrefix,
                                            "type": "text",
                                            "color": "rgb(48, 52, 112)",
                                            "padding": "0px 0px 4px 0px",
                                            "fontSize": "14px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "bold",
                                            "lineHeight": "1",
                                            "borderRadius": "0",
                                            "letterSpacing": "0px",
                                            "textDecoration": "none",
                                        },
                                        {
                                            "id": "w4wqh9v",
                                            "text": getLocalizedContent()
                                                .addressValue,
                                            "type": "text",
                                            "color": "rgb(0, 0, 0)",
                                            "fontSize": "14px",
                                            "fontStyle": "normal",
                                            "fontFamily": "Arial",
                                            "fontWeight": "normal",
                                            "lineHeight": "1",
                                            "letterSpacing": "0px",
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
                                            "text": getLocalizedContent()
                                                .websitePrefix,
                                            "type": "text",
                                            "color": "rgb(0, 0, 0)",
                                            "padding": "0px 0px 0px 0px",
                                            "fontSize": "14px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "normal",
                                            "lineHeight": "1",
                                            "borderRadius": "0",
                                            "letterSpacing": "0px",
                                            "textDecoration": "none",
                                        },
                                        {
                                            "id": generateRandomId(),
                                            "text": getLocalizedContent()
                                                .websiteValue,
                                            "type": "websiteLink",
                                            "color": "rgb(48, 52, 112)",
                                            "fontSize": "14px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "bold",
                                            "lineHeight": "1",
                                            "letterSpacing": "0px",
                                            "textDecoration": "none",
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
