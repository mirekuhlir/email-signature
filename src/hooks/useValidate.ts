import { useState } from "react";

const useValidate = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [errorMessage, setErrorMessage] = useState<string>("");

    const validate = (
        {
            text,
            componentId,
            validation,
        }: {
            text: string;
            componentId: string;
            validation: (text: string) => { message: string };
        },
    ) => {
        const { message } = validation(text);

        if (message) {
            setErrors((prev) => ({
                ...prev,
                [componentId]: message,
            }));
            setErrorMessage(message);
            return false;
        }
        setErrorMessage("");
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[componentId];
            return newErrors;
        });
        return true;
    };

    return { validate, errors, errorMessage: errorMessage };
};

export default useValidate;
