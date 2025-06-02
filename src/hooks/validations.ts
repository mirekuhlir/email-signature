import t from "@/src/localization/translate";

export const validateEmail = (email: string): { message: string } => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return { message: t("emailWrongFormat") };
    }
    return { message: "" };
};
