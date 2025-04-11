import { generateRandomId } from "@/src/utils/generateRandomId";

export const signature_empty_one_columns = {
  info: {
    templateSlug: "signature-empty-one-columns",
    version: "0.1",
    name: "Empty Signature One Column",
  },
  colors: [
    "rgb(0,148,47)",
  ],
  rows: [
    {
      id: generateRandomId(),
      columns: [
        {
          id: generateRandomId(),
          rows: [],
        },
      ],
    },
  ],
};
