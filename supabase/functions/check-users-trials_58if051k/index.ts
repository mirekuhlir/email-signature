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

        // Perform soft delete of expired trials for invalid users in one query
        const { data: softDeletedTrials, error: updateError } = await supabase
            // Target the user_trials table
            .from("user_trials")
            // Set soft_deleted_at timestamp to mark records as soft deleted
            .update({ soft_deleted_at: now.toISOString() })
            // Filter trials that expired at or after one hour ago
            .gte("trial_expires_at", oneHourAgo.toISOString())
            // Filter trials that expired at or before current time
            .lte("trial_expires_at", now.toISOString())
            // Only include records that are not hard deleted
            .is("deleted_at", null)
            // Only include records that are not already soft deleted
            .is("soft_deleted_at", null)
            // SQL conditions for invalid users:
            // 1. No valid_from (never had paid version)
            // 2. OR valid_from is in the future
            // 3. OR valid_to is in the past (expired)
            // Apply OR conditions to identify invalid users
            .or(`users.valid_from.is.null,users.valid_from.gt."${now.toISOString()}",users.valid_to.lt."${now.toISOString()}"`)
            // Select specific fields to return: user_id, trial_expires_at, and user details via inner join
            .select(`
                user_id,
                trial_expires_at,
                users!inner(id, valid_from, valid_to)
            `);

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

        if (softDeletedCount === 0) {
            console.log(
                "No invalid users found with expired trials in the last hour",
            );

            return new Response(
                JSON.stringify({
                    message:
                        "No invalid users found with expired trials in the last hour",
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

        console.log(
            `Soft deleted trials for ${softDeletedCount} invalid users`,
        );

        // Log details of soft deleted users
        const softDeletedDetails = softDeletedTrials?.map((trial) => {
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
        console.log("expired trials found:", softDeletedCount);
        console.log("invalid users found:", softDeletedCount);
        console.log("soft deleted users:", softDeletedCount);

        return new Response(
            JSON.stringify({
                message: `Trial check completed - processed invalid users only`,
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
