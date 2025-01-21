import { SignaturePart } from "@/const/signature-parts"

export const signature_a = 
    [
      // row
        {
          path: "0",
          style: { backgroundColor: "red" },
          columns: [
            {
              path: "0.0",
              style: {},
              rows: [
                {
                  path: "0.0.0",
                  style: {},
                  columns: [
                    {
                    type: SignaturePart.TEXT,
                    content: { text: "A" },
                    style: { backgroundColor: "red" },
                    },
                    ],
                  }
                ],
            },
            {
              path: "0.1",
              style: {},
              rows: [
                {
                  path: "0.1.0",
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
                  path: "0.1.1",
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
                  path: "0.1.2",
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
      ]