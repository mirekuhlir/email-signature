import { SignatureTemplate } from "../types/signature";
import { generateRandomId } from "../utils/generateRandomId";

export const signature_a: SignatureTemplate = {
  info: {
    templateSlug: "signature-a",
    version: "0.1",
    name: "Signature A",
  },
  colors: [
    "rgb(0,148,47)",
  ],
  rows: [
    {
      "id": generateRandomId(),
      "columns": [
        {
          "id": generateRandomId(),
          "rows": [
            {
              "id": "c1vn98v",
              "content": {
                "type": "text",
                "components": [
                  {
                    "id": generateRandomId(),
                    "text": "Dobrý den všem",
                    "color": "rgb(0, 0, 0)",
                    "padding": "0px 0px 0px 0px",
                    "fontSize": "38",
                    "fontStyle": "normal",
                    "textAlign": "left",
                    "fontFamily": "Arial",
                    "fontWeight": "normal",
                    "lineHeight": "2.5",
                    "borderRadius": "0px",
                    "letterSpacing": "0",
                    "textDecoration": "none",
                  },
                ],
              },
            },
          ],
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
              // TODO - možná není potřeba, buď vrátit a nebo smazat
              /*               "style": {
                "margin": "0 auto",
                "display": "table"
              }, */
              "content": {
                "type": "image",
                "components": [
                  {
                    "id": "s3y0rg5",
                    "src":
                      "https://signatures-photos.s3.us-east-1.amazonaws.com/23d9b5f8-9eb2-4f3b-9d0e/c750a17f/s3y0rg5.png",
                    "padding": "0px 0px 0px 0px",
                    "originalSrc":
                      "https://signatures-photos.s3.us-east-1.amazonaws.com/example/signature-a/s3y0rg5-IMG_3682.png",
                    "borderRadius": "0px",
                    "previewWidth": 114,
                    "imageSettings": {
                      "crop": {
                        "x": 36.805213426097275,
                        "y": 53.31372744629604,
                        "unit": "%",
                        "width": 35.21833946114049,
                        "height": 27.409568121154535,
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
                    "text": "Example text",
                    "color": "rgb(0, 0, 0)",
                    "padding": "15px 0px 0px 0px",
                    "fontSize": "16",
                    "fontStyle": "normal",
                    "textAlign": "center",
                    "fontFamily": "Arial",
                    "fontWeight": "normal",
                    "lineHeight": "1",
                    "borderRadius": "0px",
                    "letterSpacing": "0",
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
                    "text": "Example text",
                    "color": "rgb(0, 0, 0)",
                    "padding": "0px 0px 0px 0px",
                    "fontSize": "13",
                    "fontStyle": "normal",
                    "textAlign": "center",
                    "fontFamily": "Arial",
                    "fontWeight": "normal",
                    "lineHeight": "1.75",
                    "borderRadius": "0px",
                    "letterSpacing": "0",
                    "textDecoration": "none",
                  },
                ],
              },
            },
          ],
          "style": {
            "padding": "0px 16px 0px 0px",
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
                "type": "text",
                "components": [
                  {
                    "id": generateRandomId(),
                    "text": "Miroslav Uhlíř",
                    "color": "rgb(0, 0, 0)",
                    "padding": "0px 0px 0px 0px",
                    "fontSize": "30",
                    "fontStyle": "normal",
                    "textAlign": "left",
                    "fontFamily": "Arial",
                    "fontWeight": "normal",
                    "lineHeight": "1",
                    "borderRadius": "0px",
                    "letterSpacing": "0",
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
                    "text": "javascript developer2",
                    "color": "rgb(0,148,47)",
                    "fontSize": "16",
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
                    "color": "rgb(0, 0, 0)",
                    "fontSize": "14",
                    "textDecoration": "none",
                  },
                  {
                    "id": generateRandomId(),
                    "text": "www.example.com",
                    "type": "websiteLink",
                    "color": "rgb(0, 0, 0)",
                    "fontSize": "14",
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
                    "color": "rgb(101, 170, 219)",
                    "padding": "5px 0px 0px 0px",
                    "fontSize": "14",
                    "fontStyle": "italic",
                    "textAlign": "left",
                    "fontFamily": "Arial",
                    "fontWeight": "bold",
                    "lineHeight": "1",
                    "borderRadius": "0px",
                    "letterSpacing": "0",
                    "textDecoration": "none",
                  },
                  {
                    "id": generateRandomId(),
                    "text": "mirek.uhlir@gmail.com",
                    "type": "emailLink",
                    "color": "rgb(0, 0, 0)",
                    "fontSize": "14",
                    "fontStyle": "normal",
                    "textAlign": "left",
                    "fontFamily": "Arial",
                    "fontWeight": "normal",
                    "lineHeight": "1",
                    "letterSpacing": "0",
                    "textDecoration": "none",
                  },
                ],
              },
            },
          ],
          "style": {
            "padding": "0px 0px 0px 21px",
            "borderRadius": "0px",
            "verticalAlign": "middle",
            "borderTopColor": "rgb(0, 0, 0)",
            "borderTopStyle": "none",
            "borderTopWidth": "0px",
            "borderLeftColor": "rgb(101, 170, 219)",
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
                    "text":
                      " when an unknown printe when an unknown  when an unknown printe when an unknown printe when an unknown printe when an unknown printe\nprinte when \nan unknown printe when an unknown printe when an \nunknown printe when an unknown printe",
                    "color": "rgb(135, 135, 135)",
                    "padding": "20px 0px 0px 0px",
                    "fontSize": "14",
                    "fontStyle": "normal",
                    "textAlign": "left",
                    "fontFamily": "Arial",
                    "fontWeight": "normal",
                    "lineHeight": "1",
                    "borderRadius": "0px",
                    "letterSpacing": "0",
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
} as SignatureTemplate;
