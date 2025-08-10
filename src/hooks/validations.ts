export const validateEmail = (email: string): { message: string } => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return {
            message: "Wrong email. Please use format: example@domain.com",
        };
    }
    return { message: "" };
};
