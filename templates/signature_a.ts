import { SignaturePart } from "@/const/signature-parts";

export const signature_a = [
  {
    path: "-1",
    style: { backgroundColor: "purple" },
    columns: [
      {
        path: "-1.0",
        style: {
          verticalAlign: "top",
        },
        content: { text: "A" },
      },
      {
        path: "-1.1",
        rows: [{
          path: "-1.1.0",
          style: { backgroundColor: "red" },
          content: {
            text: "123",
          },
        }, {
          path: "-1.1.1",
          content: {
            text: "124",
          },
        }],
      },
    ],
  },
  {
    path: "0",
    style: { backgroundColor: "red" },
    columns: [
      {
        path: "0.1",
        content: { text: "A" },
        style: { backgroundColor: "red" },
      },
      {
        path: "0.2",
        rows: [
          {
            path: "0.2.0",
            type: SignaturePart.TEXT,
            content: { text: "B" },
            style: { backgroundColor: "green" },
          },
          {
            path: "0.2.1",
            type: SignaturePart.TEXT,
            content: { text: "C" },
            style: { backgroundColor: "blue" },
          },
          {
            path: "0.2.2",
            type: SignaturePart.TEXT,
            content: { text: "D" },
            style: { backgroundColor: "orange" },
          },
        ],
      },
    ],
  },
];
