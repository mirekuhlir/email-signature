import { generateRandomId } from "@/src/utils/generateRandomId";

export const signature_empty_two_columns = () => {
    return {
        info: {
            templateSlug: "signature-empty-two-columns",
            version: "0.1",
            name: "Empty Signature Two Columns",
        },
        colors: [],
        dimensions: {
            spaces: [],
            corners: [],
            borders: [],
        },
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
                                            text: "Empty with two columns",
                                            type: "text",
                                            color: "rgb(0, 0, 0)",
                                            padding: "0px 0px 5px 0px",
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
                        style: {
                            "verticalAlign": "top",
                        },
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
                                            text: ". The second column.",
                                            type: "text",
                                            color: "rgb(0, 0, 0)",
                                            padding: "0px 0px 5px 0px",
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
                        style: {
                            "verticalAlign": "top",
                        },
                    },
                ],
            },
        ],
    };
};
