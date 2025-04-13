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
                                        text:
                                            "Empty signature with two columns",
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
                                        text: ". Second column.",
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
