// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, Content-Type",
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

  const { data, error } = await supabase.auth.getUser(
    req.headers.get("Authorization")!.replace("Bearer ", ""),
  );

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  const userId = data?.user?.id;
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "User not found" }),
    );
  }

  let jsonBody: any = {};
  try {
    jsonBody = await req.json();
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: "Invalid JSON: " + errMsg }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  const { signatureContent, signatureId } = jsonBody;
  if (!signatureContent || typeof signatureContent !== "object") {
    return new Response(
      JSON.stringify({ error: "Missing signature object in body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  const { count, error: countError } = await supabase
    .from("signatures")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    return new Response(
      JSON.stringify({ error: countError.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  // TODO
  if ((count ?? 0) >= 10) {
    return new Response(
      JSON.stringify({ error: "Signature limit reached" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  if (signatureId) {
    const { data: existingSignature, error: fetchError } = await supabase
      .from("signatures")
      .select("id, user_id")
      .eq("id", signatureId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !existingSignature) {
      return new Response(
        JSON.stringify({ error: "Signature not found or not authorized" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const { data: updatedData, error: updateError } = await supabase
      .from("signatures")
      .update({ signature_content: signatureContent, updated_at: new Date() })
      .eq("id", signatureId)
      .select();

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    return new Response(
      JSON.stringify({ data: updatedData }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } else {
    const { data: insertedData, error: insertError } = await supabase
      .from("signatures")
      .insert([{
        signature_content: signatureContent,
        user_id: userId,
        updated_at: new Date(),
      }])
      .select();

    if (insertError) {
      return new Response(
        JSON.stringify({ error: insertError.message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    return new Response(
      JSON.stringify({ data: insertedData }),
      {
        status: 201,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
});
