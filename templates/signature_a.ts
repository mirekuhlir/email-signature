import { SignaturePart } from "@/const/signature-parts";

// TODO - path vymyslet

export const signature_a = [
  {
    path: "-1",
    style: { backgroundColor: "purple" },
    columns: [
      {
        path: "0.1",
        style: {},
        content: { text: "A" },
      },
      {
        path: "0.2",
        style: {},
        rows: [{
          path: "0.2.0",
          style: { backgroundColor: "red" },
          content: {
            text: "123",
          },
        }, {
          path: "0.3.0",
          style: {},
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
        path: "1.0",
        style: {},
        rows: [
          {
            path: "1.0.0",
            style: {},
            columns: [
              {
                type: SignaturePart.TEXT,
                content: { text: "A" },
                style: { backgroundColor: "red" },
              },
            ],
          },
        ],
      },
      {
        path: "0.1",
        style: {},
        rows: [
          {
            path: "1.1.0",
            style: {},
            columns: [
              {
                type: SignaturePart.TEXT,
                content: { text: "B" },
                style: { backgroundColor: "green" },
              },
            ],
          },
          {
            path: "1.1.1",
            style: {},
            columns: [
              {
                type: SignaturePart.TEXT,
                content: { text: "C" },
                style: { backgroundColor: "blue" },
              },
            ],
          },
          {
            path: "1.1.2",
            columns: [
              {
                type: SignaturePart.TEXT,
                content: { text: "D" },
                style: { backgroundColor: "orange" },
              },
            ],
          },
        ],
      },
    ],
  },
];
