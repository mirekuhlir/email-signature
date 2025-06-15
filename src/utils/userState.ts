import { User } from "@supabase/supabase-js";

export const enum UserStatus {
    TRIAL = "trial",
    PREMIUM = "premium",
    AFTER_TRIAL = "after_trial",
}

export const getIsPremium = (user: User) => {
    const validFrom = user.app_metadata.premium?.validFrom;
    const validTo = user.app_metadata.premium?.validTo;

    const isPremium = validFrom &&
        new Date(validFrom) < new Date() &&
        (!validTo || new Date(validTo) > new Date());

    return isPremium;
};

export const getIsTrial = (user: User) => {
    const validFrom = user.app_metadata.premium?.validFrom;
    const validTo = user.app_metadata.premium?.validTo;

    return !!validFrom && !validTo;
};

export const getIsAfterTrial = (user: User) => {
    const validTo = user.app_metadata.premium?.validTo;
    return !!validTo && new Date(validTo) < new Date();
};

export const getUserStatus = (user: User | null) => {
    if (!user) return UserStatus.TRIAL;

    const isPremium = getIsPremium(user);
    const isTrial = getIsTrial(user);
    const isAfterTrial = getIsAfterTrial(user);

    if (isPremium) return UserStatus.PREMIUM;
    if (isTrial) return UserStatus.TRIAL;
    if (isAfterTrial) return UserStatus.AFTER_TRIAL;
    return UserStatus.TRIAL;
};
