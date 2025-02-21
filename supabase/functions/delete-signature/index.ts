// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS, DELETE",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req: Request) => {
  const { method } = req;

  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (method !== "DELETE") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Authorization header missing" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  const { data, error } = await supabase.auth.getUser(
    authHeader.replace("Bearer ", "")
  );

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  const userId = data?.user?.id;
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "User not found" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  const { searchParams } = new URL(req.url);
  const signatureId = searchParams.get("signatureId");

  if (!signatureId) {
    return new Response(
      JSON.stringify({ error: "Missing signatureId parameter" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  const { data: existingSignature, error: fetchError } = await supabase
    .from("signatures")
    .select("id, user_id")
    .eq("id", signatureId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !existingSignature) {
    return new Response(
      JSON.stringify({ error: "Signature not found or not authorized" }),
      { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  const { data: deletedData, error: deleteError } = await supabase
    .from("signatures")
    .delete()
    .eq("id", signatureId)
    .select();

  if (deleteError) {
    return new Response(
      JSON.stringify({ error: deleteError.message }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  return new Response(
    JSON.stringify({ deleted: "ok" }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
});