/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTemplateBySlug } from "@/src/templates";

export const saveTempSignature = (
    {
        templateSlug,
        createdAt,
        updatedAt,
        rows,
        colors,
        dimensions,
    }: {
        templateSlug: string;
        createdAt: string;
        updatedAt: string;
        rows: any;
        colors: any;
        dimensions: any;
    },
) => {
    if (createdAt) {
        const names = JSON.parse(
            localStorage.getItem("templates-names") || "[]",
        );
        const signatureTemplateName = `${templateSlug}-${createdAt}`;

        if (!names.includes(signatureTemplateName)) {
            names.push(signatureTemplateName);
            localStorage.setItem("templates-names", JSON.stringify(names));
        }

        const slug = getTemplateBySlug(templateSlug)?.info?.templateSlug;

        localStorage.setItem(
            signatureTemplateName,
            JSON.stringify({
                rows,
                colors,
                dimensions,
                createdAt,
                updatedAt,
                info: getTemplateBySlug(slug)?.info,
            }),
        );
    }
};

export const deleteTempSignature = (tempSignatureToDelete: any) => {
    const signatureTemplateName =
        `${tempSignatureToDelete.info?.templateSlug}-${tempSignatureToDelete.createdAt}`;

    localStorage.removeItem(signatureTemplateName);

    const names = JSON.parse(
        localStorage.getItem("templates-names") || "[]",
    );
    const newNames = names.filter(
        (name: string) => name !== signatureTemplateName,
    );
    localStorage.setItem(
        "templates-names",
        JSON.stringify(newNames),
    );
};
