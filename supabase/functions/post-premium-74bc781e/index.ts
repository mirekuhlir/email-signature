// deno-lint-ignore-file no-explicit-any
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

serve(async (req: Request) => {
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

    let userEmail: string | null = null;
    try {
        const body = await req.json();
        if (typeof body.email !== "string") {
            throw new Error("Missing or invalid 'email' in request body");
        }
        userEmail = body.email;
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: `Failed to parse request body: ${
                    (error as Error).message
                }`,
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            },
        );
    }

    // Find user by email
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", userEmail)
        .single();

    if (userError) {
        return new Response(
            JSON.stringify({
                error: "User not found with the specified email",
            }),
            {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            },
        );
    }

    const validFrom = new Date().toISOString();

    // Update user metadata
    const { data: updatedUserData, error: updateError } = await supabase
        .auth.admin.updateUserById(
            user.id,
            {
                app_metadata: {
                    premium: { validFrom: validFrom, validTo: "" },
                },
            },
        );

    if (updateError) {
        return new Response(
            JSON.stringify({
                error: "Error updating user metadata",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            },
        );
    }

    const { error: usersTableUpdateError } = await supabase
        .from("users")
        .update({ valid_from: validFrom })
        .eq("id", user.id);

    if (usersTableUpdateError) {
        return new Response(
            JSON.stringify({
                error: "Error updating users table",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            },
        );
    }

    return new Response(
        JSON.stringify({ success: true, user: updatedUserData }),
        {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
        },
    );
});
