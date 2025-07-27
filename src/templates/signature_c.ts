// generateRandomId()

import { generateRandomId } from "../utils/generateRandomId";
import { content } from "./constants";

const getLocalizedContent = () => {
    return {
        [content.name]: "RICHARD BREWER",
        [content.place]: "Realtor at Crestwood Realty",
        [content.phonePrefix]: "Phone: ",
        [content.phone]: "+1 2015577537",
        [content.emailPrefix]: "Email: ",
        [content.email]: "example@email.com",
        [content.addressPrefix]: "Address: ",
        [content.address]: "2645 Beeghley Street, Waco, TX 76701",
        [content.websitePrefix]: "Visit ",
        [content.website]: "www.example.com",
    };
};

export const signature_c = () => {
    const localizedContent = getLocalizedContent();
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
        "dimensions": {
            "spaces": ["15", "10", "5"],
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
                                                `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/examples/signature_c_preview.png`,
                                            "margin": "0 auto 0 auto",
                                            "padding": "0px 0px 0px 0px",
                                            "originalSrc":
                                                `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/examples/signature_c_original.jpg`,
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
                                                "borderRadius": {
                                                    "topLeft": 0,
                                                    "topRight": 0,
                                                    "bottomRight": 0,
                                                    "bottomLeft": 0,
                                                },
                                            },
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
                                            "text":
                                                localizedContent[content.name],
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
                                            "whiteSpace": "nowrap",
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
                                            "text":
                                                localizedContent[content.place],
                                            "type": "text",
                                            "color": "rgb(0, 0, 0)",
                                            "padding": "10px 0px 10px 0px",
                                            "fontSize": "16px",
                                            "fontStyle": "normal",
                                            "textAlign": "center",
                                            "fontFamily": "Arial",
                                            "fontWeight": "bold",
                                            "lineHeight": "1",
                                            "borderRadius": "0",
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
                                            "borderBottomColor":
                                                "rgb(48, 52, 112)",
                                            "borderBottomStyle": "solid",
                                            "borderBottomWidth": "2px",
                                            "whiteSpace": "nowrap",
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
                                                localizedContent[
                                                    content.phonePrefix
                                                ],
                                            "type": "text",
                                            "color": "rgb(48, 52, 112)",
                                            "padding": "10px 0px 5px 0px",
                                            "fontSize": "14px",
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
                                            "whiteSpace": "nowrap",
                                        },
                                        {
                                            "id": generateRandomId(),
                                            "text":
                                                localizedContent[content.phone],
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
                                            "whiteSpace": "nowrap",
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
                                                localizedContent[
                                                    content.emailPrefix
                                                ],
                                            "type": "text",
                                            "color": "rgb(48, 52, 112)",
                                            "padding": "0px 0px 5px 0px",
                                            "fontSize": "14px",
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
                                            "text":
                                                localizedContent[content.email],
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
                                            "whiteSpace": "nowrap",
                                        },
                                    ],
                                },
                            },
                            {
                                "id": generateRandomId(),
                                "content": {
                                    "type": "customValue",
                                    "components": [
                                        {
                                            "id": generateRandomId(),
                                            "text":
                                                localizedContent[
                                                    content.addressPrefix
                                                ],
                                            "type": "text",
                                            "color": "rgb(48, 52, 112)",
                                            "padding": "0px 0px 5px 0px",
                                            "fontSize": "14px",
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
                                            "whiteSpace": "nowrap",
                                        },
                                        {
                                            "id": generateRandomId(),
                                            "text":
                                                localizedContent[
                                                    content.address
                                                ],
                                            "type": "text",
                                            "color": "rgb(0, 0, 0)",
                                            "fontSize": "14px",
                                            "fontStyle": "normal",
                                            "textAlign": "left",
                                            "fontFamily": "Arial",
                                            "fontWeight": "normal",
                                            "lineHeight": "1",
                                            "letterSpacing": "0px",
                                            "textDecoration": "none",
                                            "whiteSpace": "nowrap",
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
                                                localizedContent[
                                                    content.websitePrefix
                                                ],
                                            "type": "text",
                                            "color": "rgb(0, 0, 0)",
                                            "padding": "0px 0px 5px 0px",
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
                                            "whiteSpace": "nowrap",
                                        },
                                        {
                                            "id": generateRandomId(),
                                            "text":
                                                localizedContent[
                                                    content.website
                                                ],
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
                                            "whiteSpace": "nowrap",
                                        },
                                    ],
                                },
                            },
                        ],
                        "style": {
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
                            "borderBottomColor": "rgb(48, 52, 112)",
                            "borderBottomStyle": "none",
                            "borderBottomWidth": "0px",
                        },
                    },
                ],
            },
        ],
    };
};
