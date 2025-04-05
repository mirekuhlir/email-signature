import { assertEquals, assertExists } from "jsr:@std/assert";
import { validateSignature } from "./validation.ts";

Deno.test("validateSignature - valid data", () => {
    const validData = {
        colors: ["rgb(255,255,255)", "rgb(0,0,0)"],
        rows: [
            {
                id: "row1",
                columns: [
                    {
                        id: "col1",
                        rows: [
                            {
                                id: "r1c1r1",
                                content: {
                                    type: "text",
                                    components: [
                                        {
                                            id: "comp1",
                                            text: "Hello World",
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

    const result = validateSignature(validData);
    assertEquals(result.success, true);
    assertExists(result.data);
});

Deno.test("validateSignature - invalid data (missing rows)", () => {
    const invalidData = {
        colors: ["rgb(255,255,255)"],
        // rows property is missing
    };

    const result = validateSignature(invalidData);
    assertEquals(result.success, false);
    assertExists(result.error);
    // You could add more specific error checking here if needed
    // For example, check if the error message indicates 'rows' is required
});
