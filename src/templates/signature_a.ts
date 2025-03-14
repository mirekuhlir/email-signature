import { SignatureTemplate } from "../types/signature";

export const signature_a: SignatureTemplate = {
  templateName: "signature_a",
  templateSlug: "signature-a",
  version: "0.1",
  colors: [
    "rgb(0,148,47)",
  ],
  rows: [
    {
      id: "gp91",
      columns: [
        {
          id: "2j9b",
          style: {
            padding: "10px 10px 10px 10px",
          },
          rows: [],
        },
        {
          id: "gg6r",
          style: {
            verticalAlign: "top",
            padding: "10px 10px 10px 10px",
          },
          rows: [{
            id: "ex3p",
            content: {
              type: "text",
              components: [
                {
                  id: "2j9ba1",
                  text: "Miroslav Uhlíř",
                  fontSize: "32",
                },
              ],
            },
          }, {
            id: "7jn3",
            content: {
              type: "text",
              components: [
                {
                  id: "2j9ba2",
                  text: "javascript developer2",
                  fontSize: "16",
                  color: "rgb(0,148,47)",
                },
              ],
            },
          }],
        },
      ],
    },
    /*   {
    id: "gp91",
    style: { backgroundColor: "purple" },
    columns: [
      {
        id: "2j9b",
        style: {
          verticalAlign: "top",
        },
        rows: [{
          id: "2j9c",
          content: {
            text: "A",
          },
        }],
      },
      {
        id: "gg6r",
        rows: [{
          id: "ex3p",
          style: { backgroundColor: "red" },
          content: {
            text: "123",
          },
        }, {
          id: "7jn3",
          content: {
            text: "124",
          },
        }],
      },
    ],
  }, */
    /*   {
    id: "n9n8",
    style: { backgroundColor: "red" },
    columns: [
      {
        id: "xogy",
        style: { backgroundColor: "red", verticalAlign: "bottom" },
        rows: [
          {
            id: "692i",
            type: SignaturePart.TEXT,
            content: { text: "A" },
            style: { backgroundColor: "green" },
          },
        ],
      },
      {
        id: "50v9",
        rows: [
          {
            id: "juh3",
            type: SignaturePart.TEXT,
            content: { text: "B" },
            style: { backgroundColor: "green" },
          },
          {
            id: "yfau",
            type: SignaturePart.TEXT,
            content: { text: "C" },
            style: { backgroundColor: "blue" },
          },
          {
            id: "asnv",
            type: SignaturePart.TEXT,
            content: { text: "D" },
            style: { backgroundColor: "orange" },
          },
        ],
      },
    ],
  }, */
  ],
} as SignatureTemplate;
