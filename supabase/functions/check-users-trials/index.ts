import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS, POST",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
    "";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper function to perform batch soft delete
async function softDeleteUserTrials(userIds: string[], timestamp: string) {
    if (userIds.length === 0) return { error: null };

    const { error } = await supabase
        .from("user_trials")
        .update({ soft_deleted_at: timestamp })
        .in("user_id", userIds)
        .is("soft_deleted_at", null);

    return { error };
}

// Helper function to check if user is valid
function isUserValid(
    userData: { valid_from?: string; valid_to?: string } | null,
    now: Date,
): boolean {
    if (!userData) return false;

    // Check valid_from
    if (userData.valid_from) {
        const validFrom = new Date(userData.valid_from);
        if (now < validFrom) {
            return false;
        }
    }

    // Check valid_to (null means unlimited validity)
    if (userData.valid_to) {
        const validTo = new Date(userData.valid_to);
        if (now > validTo) {
            return false;
        }
    }

    return true;
}

serve(async (req: Request): Promise<Response> => {
    const { method } = req;

    if (method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (method !== "POST") {
        return new Response(
            JSON.stringify({ error: "Method not allowed" }),
            {
                status: 405,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            },
        );
    }

    try {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        console.log(
            `Checking trials expiring between ${oneHourAgo.toISOString()} and ${now.toISOString()}`,
        );

        // Find user_trials that expired within the last hour
        const { data: expiredTrials, error: trialsError } = await supabase
            .from("user_trials")
            .select("user_id, trial_expires_at")
            .gte("trial_expires_at", oneHourAgo.toISOString())
            .lte("trial_expires_at", now.toISOString())
            .is("deleted_at", null)
            .is("soft_deleted_at", null);

        if (trialsError) {
            console.error("Error fetching expired trials:", trialsError);
            return new Response(
                JSON.stringify({
                    error: "Failed to fetch expired trials",
                    details: trialsError.message,
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        }

        if (!expiredTrials || expiredTrials.length === 0) {
            return new Response(
                JSON.stringify({
                    message: "No trials found expiring in the last hour",
                    processedUsers: 0,
                    softDeletedUsers: 0,
                }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        }

        console.log(`Found ${expiredTrials.length} expired trials`);

        const invalidUserIds: string[] = [];
        const validUserIds: string[] = [];
        const softDeletedDetails: Array<{
            userId: string;
            valid_from?: string;
            valid_to?: string;
        }> = [];
        const validUsersDetails: Array<{
            userId: string;
            valid_from?: string;
            valid_to?: string;
        }> = [];
        let method = "unknown";

        // Try optimized method first
        const { data: usersToProcess, error: usersError } = await supabase
            .from("user_trials")
            .select(`
                user_id,
                users!inner(id, valid_from, valid_to)
            `)
            .gte("trial_expires_at", oneHourAgo.toISOString())
            .lte("trial_expires_at", now.toISOString())
            .is("deleted_at", null)
            .is("soft_deleted_at", null);

        if (!usersError && usersToProcess && usersToProcess.length > 0) {
            // Optimized method succeeded
            method = "optimized";
            console.log("Using optimized method with JOIN query");

            // Process each user
            for (const trial of usersToProcess) {
                const user = Array.isArray(trial.users)
                    ? trial.users[0]
                    : trial.users;

                const userDetail = {
                    userId: trial.user_id,
                    valid_from: user?.valid_from,
                    valid_to: user?.valid_to,
                };

                if (!isUserValid(user, now)) {
                    invalidUserIds.push(trial.user_id);
                    softDeletedDetails.push(userDetail);
                    console.log(
                        `User ${trial.user_id} marked for soft deletion (optimized)`,
                    );
                } else {
                    validUserIds.push(trial.user_id);
                    validUsersDetails.push(userDetail);
                    console.log(`User ${trial.user_id} is valid (optimized)`);
                }
            }
        } else {
            console.error("Error fetching users to process:", usersError);
            return new Response(
                JSON.stringify({
                    error: "Failed to fetch users to process",
                    details: usersError?.message || "Unknown error",
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        }

        // Perform single batch soft delete for all invalid users
        const { error: updateError } = await softDeleteUserTrials(
            invalidUserIds,
            now.toISOString(),
        );

        if (updateError) {
            console.error(
                `Error batch soft deleting trials for users:`,
                updateError,
            );
            return new Response(
                JSON.stringify({
                    error: "Failed to soft delete trials",
                    details: updateError.message,
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        } else if (invalidUserIds.length > 0) {
            console.log(
                `Batch soft deleted trials for ${invalidUserIds.length} users`,
            );
        }

        return new Response(
            JSON.stringify({
                message: `Trial check completed (${method} method)`,
                processedUsers: invalidUserIds.length + validUserIds.length,
                validUsers: validUserIds.length,
                softDeletedUsers: invalidUserIds.length,
                timeRange: {
                    from: oneHourAgo.toISOString(),
                    to: now.toISOString(),
                },
                expiredTrialsFound: expiredTrials.length,
                softDeletedDetails: softDeletedDetails,
                validUsersDetails: validUsersDetails,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            },
        );
    } catch (error) {
        console.error("Error in trial check:", error);
        return new Response(
            JSON.stringify({
                error: "Internal server error",
                details: error instanceof Error ? error.message : String(error),
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            },
        );
    }
});
