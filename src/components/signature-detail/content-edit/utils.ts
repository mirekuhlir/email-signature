/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTemplateBySlug } from "@/src/templates";

export const saveTempSignature = (
    {
        templateSlug,
        rows,
        colors,
        dimensions,
    }: {
        templateSlug: string;
        rows: any;
        colors: any;
        dimensions: any;
    },
) => {
    const slug = getTemplateBySlug(templateSlug)?.info?.templateSlug;

    localStorage.setItem(
        templateSlug,
        JSON.stringify({
            rows,
            colors,
            dimensions,
            createdAt: new Date().toISOString(),
            info: getTemplateBySlug(slug)?.info,
        }),
    );
};
