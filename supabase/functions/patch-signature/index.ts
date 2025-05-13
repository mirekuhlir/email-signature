// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { extractImageSrc } from "../_shared/utils.ts";
import {
  DeleteObjectsCommand,
  S3Client,
  waitUntilObjectNotExists,
} from "@aws-sdk/client-s3";
import { validateSignature } from "../_shared/validation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS, PATCH",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
  "";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const AWS_ACCESS_KEY_ID = Deno.env.get("AWS_ACCESS_KEY_ID") || "";
const AWS_SECRET_ACCESS_KEY = Deno.env.get("AWS_SECRET_ACCESS_KEY") || "";
const AWS_REGION = Deno.env.get("AWS_REGION") || "";

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = Deno.env.get("AWS_S3_BUCKET_NAME") || "";

serve(async (req: Request) => {
  const { method } = req;

  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (method !== "PATCH") {
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
  let body: any = {};

  try {
    body = await req.json();
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
  const { signatureContent, signatureId } = body;

  if (!signatureContent || typeof signatureContent !== "object") {
    return new Response(
      JSON.stringify({ error: "Missing signature object in body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  if (!signatureId) {
    return new Response(
      JSON.stringify({ error: "Missing signatureId in body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  // Validate signature content
  const validationResult = validateSignature(signatureContent);
  if (!validationResult.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid signature data",
        details: validationResult.error,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  const { data: existingSignature, error: fetchError } = await supabase
    .from("signatures")
    .select("*")
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
    .update({
      signature_content: validationResult.data,
      updated_at: new Date(),
    })
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

  const existingSrcImages = extractImageSrc(
    existingSignature.signature_content.rows,
  );
  const currentSrcImages = extractImageSrc(signatureContent.rows);

  const srcImagesToDelete = existingSrcImages.filter(
    (src) => !currentSrcImages.includes(src),
  ).filter(
    (src) => !src.includes("example"),
  );

  try {
    if (srcImagesToDelete.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {
            Objects: srcImagesToDelete.map((k) => ({ Key: k })),
          },
        }),
      );

      for (const key in srcImagesToDelete) {
        await waitUntilObjectNotExists(
          { client: s3 },
          { Bucket: bucketName, Key: key },
        );
      }
    }
  } catch (error) {
    console.error(
      `Error from S3 while deleting objects from ${bucketName}.  ${error.name}: ${error.message}`,
    );
  }

  return new Response(
    JSON.stringify({ data: updatedData }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    },
  );
});
