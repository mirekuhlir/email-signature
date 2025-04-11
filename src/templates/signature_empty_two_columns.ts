import { generateRandomId } from "@/src/utils/generateRandomId";

export const signature_empty_two_columns = {
    info: {
        templateSlug: "signature-empty-two-columns",
        version: "0.1",
        name: "Empty Signature Two Columns",
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
                    "rows": [],
                },
                {
                    "id": generateRandomId(),
                    "rows": [],
                },
            ],
        },
    ],
};
