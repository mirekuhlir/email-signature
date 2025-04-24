import { generateRandomId } from "@/src/utils/generateRandomId";

export const signature_empty_one_columns = () => {
  return {
    info: {
      templateSlug: "signature-empty-one-columns",
      version: "0.1",
      name: "Empty Signature One Column",
    },
    colors: [],
    rows: [
      {
        id: generateRandomId(),
        columns: [
          {
            id: generateRandomId(),
            rows: [
              {
                id: generateRandomId(),
                content: {
                  type: "text",
                  components: [
                    {
                      id: generateRandomId(),
                      text: "Empty with one column.",
                      type: "text",
                      color: "rgb(0, 0, 0)",
                      padding: "0px 0px 0px 0px",
                      fontSize: "14px",
                      fontStyle: "normal",
                      textAlign: "left",
                      fontFamily: "Arial",
                      fontWeight: "normal",
                      lineHeight: "1",
                      borderRadius: "0",
                      letterSpacing: "0px",
                      textDecoration: "none",
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  };
};
