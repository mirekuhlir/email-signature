import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
    "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req: Request): Promise<Response> => {
    const { method } = req;

    if (method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        console.log(
            `Checking trials expiring between ${oneHourAgo.toISOString()} and ${now.toISOString()}`,
        );

        // Get expired trials with user information
        const { data: expiredTrials, error: fetchError } = await supabase
            .from("user_trials")
            .select(`
                user_id,
                trial_expires_at,
                users!inner(id, valid_from, valid_to)
            `)
            .gte("trial_expires_at", oneHourAgo.toISOString())
            .lte("trial_expires_at", now.toISOString())
            .is("deleted_at", null)
            .is("soft_deleted_at", null);

        if (fetchError) {
            console.log("Error fetching expired trials:", fetchError);
            return new Response(
                JSON.stringify({
                    error: "Failed to fetch expired trials",
                    details: fetchError.message,
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
            console.log("No expired trials found in the last hour");
            return new Response(
                JSON.stringify({
                    message: "No expired trials found in the last hour",
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

        // Filter for invalid users (users without valid subscription)
        const invalidUserTrials = expiredTrials.filter((trial) => {
            const user = Array.isArray(trial.users)
                ? trial.users[0]
                : trial.users;
            if (!user) return true; // No user data means invalid

            // User is invalid if:
            // 1. No valid_from (never had paid version)
            // 2. OR valid_to is in the past (expired)
            return !user.valid_from ||
                (user.valid_to && new Date(user.valid_to) < now);
        });

        if (invalidUserTrials.length === 0) {
            console.log("No invalid users found with expired trials");
            return new Response(
                JSON.stringify({
                    message: "No invalid users found with expired trials",
                    processedUsers: expiredTrials.length,
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

        // Extract user IDs for soft deletion
        const userIdsToSoftDelete = invalidUserTrials.map((trial) =>
            trial.user_id
        );

        // Perform soft delete for invalid users
        const { data: softDeletedTrials, error: updateError } = await supabase
            .from("user_trials")
            .update({ soft_deleted_at: now.toISOString() })
            .in("user_id", userIdsToSoftDelete)
            .gte("trial_expires_at", oneHourAgo.toISOString())
            .lte("trial_expires_at", now.toISOString())
            .is("deleted_at", null)
            .is("soft_deleted_at", null)
            .select("user_id, trial_expires_at");

        if (updateError) {
            console.log("Error soft deleting expired trials:", updateError);

            return new Response(
                JSON.stringify({
                    error: "Failed to soft delete expired trials",
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
        }

        const softDeletedCount = softDeletedTrials?.length || 0;

        console.log(
            `Soft deleted trials for ${softDeletedCount} invalid users`,
        );

        // Log details of soft deleted users
        const softDeletedDetails = invalidUserTrials.map((trial) => {
            const user = Array.isArray(trial.users)
                ? trial.users[0]
                : trial.users;
            console.log(
                `User ${trial.user_id} trial soft deleted`,
            );
            return {
                userId: trial.user_id,
                valid_from: user?.valid_from,
                valid_to: user?.valid_to,
            };
        }) || [];

        console.log("Time range:", {
            from: oneHourAgo.toISOString(),
            to: now.toISOString(),
        });

        console.log("Soft deleted details:", softDeletedDetails);
        console.log("expired trials found:", expiredTrials.length);
        console.log("invalid users found:", invalidUserTrials.length);
        console.log("soft deleted users:", softDeletedCount);

        return new Response(
            JSON.stringify({
                message:
                    `Trial check completed - processed ${expiredTrials.length} expired trials, soft deleted ${softDeletedCount} invalid users`,
                processedUsers: expiredTrials.length,
                softDeletedUsers: softDeletedCount,
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
        console.log("Error in trial check:", error);

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
