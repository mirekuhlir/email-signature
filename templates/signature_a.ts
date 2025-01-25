import { SignaturePart } from "@/const/signature-parts";

export const signature_a = [
  {
    id: "gp91",
    style: { backgroundColor: "purple" },
    columns: [
      {
        id: "2j9b",
        style: {
          verticalAlign: "top",
        },
        content: { text: "A" },
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
  },
  {
    id: "n9n8",
    style: { backgroundColor: "red" },
    columns: [
      {
        id: "xogy",
        content: { text: "A" },
        style: { backgroundColor: "red", verticalAlign: "bottom" },
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
  },
];
