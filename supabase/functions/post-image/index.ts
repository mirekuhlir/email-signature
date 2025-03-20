/* eslint-disable @typescript-eslint/no-explicit-any */
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  FormFile,
  multiParser,
} from "https://deno.land/x/multiparser@0.114.0/mod.ts";
import { PutObjectCommand, S3Client } from "npm:@aws-sdk/client-s3";
import { countImagesInS3, shortenUuid } from "../_shared/utils.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
};

const isValidPngFile = (filename: string): boolean => {
  return filename.toLowerCase().endsWith(".png");
};

// Maximum file size
const MAX_FILE_SIZE_BYTES = 70 * 1024 * 1024;

const isValidFileSize = (fileSize: number): boolean => {
  return fileSize <= MAX_FILE_SIZE_BYTES;
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

const bucketName = Deno.env.get("AWS_S3_BUCKET_NAME");

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

  if (!bucketName) {
    return new Response(
      JSON.stringify({ error: "S3 bucket name is not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  // Get the signature to verify ownership
  const { data: existingSignature, error: fetchError } = await supabase
    .from("signatures")
    .select("id")
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

  // Count existing images in S3
  const imageCount = await countImagesInS3(userId, signatureId, s3, bucketName);

  if (imageCount >= 10) {
    return new Response(
      JSON.stringify({
        error: "Maximum number of images (10) reached for this signature",
      }),
      {
        status: 400,
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

  const imagePreviewFile: FormFile = form.files.imagePreviewFile as FormFile;

  if (!isValidPngFile(imagePreviewFile.filename)) {
    return new Response(
      JSON.stringify({ error: "Only PNG files are allowed" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  // Check image preview file size
  if (!isValidFileSize(imagePreviewFile.content.length)) {
    return new Response(
      JSON.stringify({
        error: "File size exceeds the maximum limit",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  // Use only first 8 characters of userId and signatureId for privacy
  const shortUserId = shortenUuid(userId);
  const shortSignatureId = shortenUuid(signatureId);

  const imagePreviewUploadKey = imagePreviewFile
    ? `${shortUserId}/${shortSignatureId}/${imagePreviewFile.filename}`
    : "";

  const originalImageFile = form.files.originalImageFile &&
    form.files.originalImageFile as FormFile;

  if (originalImageFile && !isValidPngFile(originalImageFile.filename)) {
    return new Response(
      JSON.stringify({ error: "Only PNG files are allowed" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  // Check original image file size if it exists
  if (originalImageFile && !isValidFileSize(originalImageFile.content.length)) {
    return new Response(
      JSON.stringify({
        error: "File size exceeds the maximum limit",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  const originalImageKey = originalImageFile?.filename &&
    `${shortUserId}/${shortSignatureId}/${originalImageFile?.filename}`;

  try {
    const uploadTasks = [];
    uploadTasks.push(s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: imagePreviewUploadKey,
        Body: imagePreviewFile.content,
      }),
    ));

    if (originalImageFile) {
      uploadTasks.push(s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: originalImageKey,
          Body: originalImageFile.content,
        }),
      ));
    }

    await Promise.all(uploadTasks);
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
  const imagePreviewPublicUrl = `https://${bucketName}.s3.${
    Deno.env.get("AWS_REGION") || "us-east-1"
  }.amazonaws.com/${imagePreviewUploadKey}`;

  const originalImagePublicUrl = `https://${bucketName}.s3.${
    Deno.env.get("AWS_REGION") || "us-east-1"
  }.amazonaws.com/${originalImageKey}`;

  const responseImageUrl: any = {};

  if (imagePreviewUploadKey) {
    responseImageUrl["imagePreviewPublicUrl"] = imagePreviewPublicUrl;
  }

  if (originalImageKey) {
    responseImageUrl["originalImagePublicUrl"] = originalImagePublicUrl;
  }

  return new Response(JSON.stringify(responseImageUrl), {
    status: 201,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
});
