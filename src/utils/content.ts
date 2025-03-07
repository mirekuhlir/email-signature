/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentType } from "../const/content";

export const countImageComponents = (rows: any[]): number => {
    let imageCount = 0;

    // Recursive function to traverse the nested structure
    const traverseRows = (item: any) => {
        // Check if this is a row with content of type IMAGE
        if (
            item?.content?.type === ContentType.IMAGE &&
            item.content.components
        ) {
            imageCount += item.content.components.length;
        }

        // Check if this is a table with columns
        if (item?.columns) {
            item.columns.forEach((column: any) => {
                if (column.rows) {
                    column.rows.forEach(traverseRows);
                }
            });
        }

        // Check if this is an array of rows
        if (Array.isArray(item)) {
            item.forEach(traverseRows);
        }
    };

    // Start traversal with the rows array
    traverseRows(rows);

    return imageCount;
};
