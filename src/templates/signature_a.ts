import { SignatureTemplate } from "../types/signature";

export const signature_a: SignatureTemplate = {
  info: {
    templateSlug: "signature-a",
    version: "0.1",
  },
  colors: [
    "rgb(0,148,47)",
  ],
  "rows": [
    {
      "id": "gp91",
      "columns": [
        {
          "id": "2j9b",
          "rows": [
            {
              "id": "muj6la5",
              "style": {
                "margin": "0 auto",
                "display": "table",
              },
              "content": {
                "type": "image",
                "components": [
                  {
                    "id": "s3y0rg5",
                    "src":
                      "https://signatures-photos.s3.us-east-1.amazonaws.com/example/signature-a/1742027516885-s3y0rg5.png",
                    "padding": "0px 0px 0px 0px",
                    "originalSrc":
                      "https://signatures-photos.s3.us-east-1.amazonaws.com/example/signature-a/s3y0rg5-IMG_3682.png",
                    "imageSettings": {
                      "crop": {
                        "x": 37.4712342261509,
                        "y": 6.967136707034535,
                        "unit": "%",
                        "width": 35.21833946114049,
                        "height": 27.409568121154535,
                      },
                      "aspect": 1,
                      "isCircular": true,
                    },
                  },
                ],
              },
            },
          ],
        },
        {
          "id": "gg6r",
          "rows": [
            {
              "id": "ex3p",
              "content": {
                "type": "text",
                "components": [
                  {
                    "id": "2j9ba1",
                    "text": "Miroslav Uhlíř",
                    "fontSize": "32",
                  },
                ],
              },
            },
            {
              "id": "7jn3",
              "content": {
                "type": "text",
                "components": [
                  {
                    "id": "2j9ba2",
                    "text": "javascript developer2",
                    "color": "rgb(0,148,47)",
                    "fontSize": "16",
                  },
                ],
              },
            },
          ],
          "style": {
            "padding": "0px 0px 0px 10px",
            "verticalAlign": "top",
          },
        },
      ],
    },
  ],
} as SignatureTemplate;
