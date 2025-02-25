/* eslint-disable @typescript-eslint/no-explicit-any */
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  FormFile,
  multiParser,
} from "https://deno.land/x/multiparser@0.114.0/mod.ts";
import { PutObjectCommand, S3Client } from "npm:@aws-sdk/client-s3";

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

const AWS_ACCESS_KEY_ID = Deno.env.get("AWS_ACCESS_KEY_ID");
const AWS_SECRET_ACCESS_KEY = Deno.env.get("AWS_SECRET_ACCESS_KEY");

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// TODO - nějaké omození, kolik obrázků může uložit

// TODO z env
const bucketName = "signatures-photos";

serve(async (req: Request) => {
  const { method } = req;

  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const { data, error } = await supabase.auth.getUser(
    req.headers.get("Authorization")!.replace("Bearer ", ""),
  );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 403,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const userId = data?.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "User not found" }));
  }

  const form = await multiParser(req);

  const signatureId = form.fields.signatureId;

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

  if (!form) {
    return new Response(
      JSON.stringify({ success: false, error: "no file found" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

  const image: FormFile = form.files.image as FormFile;

  const uploadKey = `${userId}/${signatureId}/${image.filename}`;

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uploadKey,
      Body: image.content,
      /*       ACL: "public-read", */
      /*       ContentType: image.contentType, */
    });
    await s3.send(command);
  } catch (uploadError: any) {
    return new Response(
      JSON.stringify({
        error: "Error uploading file",
        details: uploadError.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  // TODO - nějaká funkce a region do env
  const publicUrl = `https://${bucketName}.s3.${
    Deno.env.get("AWS_REGION") || "us-east-1"
  }.amazonaws.com/${uploadKey}`;

  return new Response(JSON.stringify({ publicUrl }), {
    status: 201,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
});
