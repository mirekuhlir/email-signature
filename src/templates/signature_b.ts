// generateRandomId()

import { generateRandomId } from "../utils/generateRandomId";

export const signature_b = {
    info: {
        templateSlug: "signature-b",
        version: "0.1",
        name: "Signature B",
    },

    colors: [
        "rgb(58, 135, 176)",
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
                                        "id": generateRandomId(),
                                        "src":
                                            "https://signatures-photos-dev.s3.us-east-1.amazonaws.com/examples/signature_b_preview.png",
                                        "padding": "0px 0px 0px 0px",
                                        "originalSrc":
                                            "https://signatures-photos-dev.s3.us-east-1.amazonaws.com/examples/signature_b_original.png",
                                        "borderRadius": "0",
                                        "previewWidth": 120,
                                        "imageSettings": {
                                            "crop": {
                                                "x": 27.195619931183135,
                                                "y": 0.6912433092844557,
                                                "unit": "%",
                                                "width": 45.908577597899594,
                                                "height": 30.60591607675713,
                                            },
                                            "aspect": 1,
                                            "isCircular": true,
                                            "borderRadius": 0,
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
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
                                        "text": "Madison Brooks",
                                        "color": "rgb(0, 0, 0)",
                                        "padding": "0px 0px 0px 0px",
                                        "fontSize": "17px",
                                        "fontStyle": "normal",
                                        "textAlign": "left",
                                        "fontFamily": "Verdana",
                                        "fontWeight": "normal",
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
                                        "text": "Professional Photographer",
                                        "color": "rgb(0, 0, 0)",
                                        "padding": "5px 0px 7px 0px",
                                        "fontSize": "14px",
                                        "fontStyle": "normal",
                                        "textAlign": "left",
                                        "fontFamily": "Verdana",
                                        "fontWeight": "normal",
                                        "lineHeight": "1",
                                        "borderRadius": "0px",
                                        "letterSpacing": "0px",
                                        "textDecoration": "none",
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
                                        "text": "tel: ",
                                        "type": "text",
                                        "color": "rgb(58, 135, 176)",
                                        "padding": "0px 0px 0px 0px",
                                        "fontSize": "14px",
                                        "fontStyle": "normal",
                                        "textAlign": "left",
                                        "fontFamily": "Verdana",
                                        "fontWeight": "normal",
                                        "lineHeight": "1",
                                        "borderRadius": "0px",
                                        "letterSpacing": "0px",
                                        "textDecoration": "none",
                                    },
                                    {
                                        "id": generateRandomId(),
                                        "text": "+1 123 456 7890 ",
                                        "type": "phoneLink",
                                        "color": "rgb(0, 0, 0)",
                                        "fontSize": "14px",
                                        "fontStyle": "normal",
                                        "textAlign": "left",
                                        "fontFamily": "Verdana",
                                        "fontWeight": "normal",
                                        "lineHeight": "1.25",
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
                                        "text": "email: ",
                                        "type": "text",
                                        "color": "rgb(58, 135, 176)",
                                        "padding": "0px 0px 0px 0px",
                                        "fontSize": "14px",
                                        "fontStyle": "normal",
                                        "textAlign": "left",
                                        "fontFamily": "Verdana",
                                        "fontWeight": "normal",
                                        "lineHeight": "1",
                                        "borderRadius": "0",
                                        "letterSpacing": "0px",
                                        "textDecoration": "none",
                                    },
                                    {
                                        "id": generateRandomId(),
                                        "text": "example@email.com",
                                        "type": "emailLink",
                                        "color": "rgb(0, 0, 0)",
                                        "fontSize": "14px",
                                        "fontStyle": "normal",
                                        "textAlign": "left",
                                        "fontFamily": "Verdana",
                                        "fontWeight": "normal",
                                        "lineHeight": "1.25",
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
                                        "text": "web: ",
                                        "type": "text",
                                        "color": "rgb(58, 135, 176)",
                                        "padding": "0px 0px 0px 0px",
                                        "fontSize": "14px",
                                        "fontStyle": "normal",
                                        "textAlign": "left",
                                        "fontFamily": "Verdana",
                                        "fontWeight": "normal",
                                        "lineHeight": "1",
                                        "borderRadius": "0px",
                                        "letterSpacing": "0px",
                                        "textDecoration": "none",
                                    },
                                    {
                                        "id": generateRandomId(),
                                        "text": "www.example.com",
                                        "type": "websiteLink",
                                        "color": "rgb(0, 0, 0)",
                                        "fontSize": "14px",
                                        "fontStyle": "normal",
                                        "textAlign": "left",
                                        "fontFamily": "Verdana",
                                        "fontWeight": "normal",
                                        "lineHeight": "1.25",
                                        "letterSpacing": "0px",
                                        "textDecoration": "none",
                                    },
                                ],
                            },
                        },
                    ],
                    "style": {
                        "padding": "0px 0px 0px 10px",
                        "borderRadius": "0",
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
            ],
        },
    ],
};
