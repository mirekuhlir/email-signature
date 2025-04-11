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
              "id": generateRandomId(),
              "content": {
                "type": "text",
                "components": [
                  {
                    "id": generateRandomId(),
                    "text": "Example text",
                    "color": "rgb(0, 0, 0)",
                    "padding": "15px 0px 0px 0px",
                    "fontSize": "16px",
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
                    "fontSize": "13px",
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
                    "fontSize": "30px",
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
                    "fontSize": "16px",
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
                    "fontSize": "14px",
                    "textDecoration": "none",
                  },
                  {
                    "id": generateRandomId(),
                    "text": "www.example.com",
                    "type": "websiteLink",
                    "color": "rgb(0, 0, 0)",
                    "fontSize": "14px",
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
                    "fontSize": "14px",
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
                    "fontSize": "14px",
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
  ],
} as SignatureTemplate;
