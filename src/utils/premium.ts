import { User } from "@supabase/supabase-js";

export const getIsPremium = async (user: User) => {
    const validFrom = user.app_metadata.premium?.validFrom;
    const validTo = user.app_metadata.premium?.validTo;

    const isPremium = validFrom &&
        new Date(validFrom) < new Date() &&
        (!validTo || new Date(validTo) > new Date());

    return isPremium;
};
