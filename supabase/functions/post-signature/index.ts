// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { deleteQueryParameters, shortenUuid } from "../_shared/utils.ts";
import { PutObjectCommand, S3Client } from "npm:@aws-sdk/client-s3@3.777.0";
import { validateSignature } from "../_shared/validation.ts";
import { MAX_SIGNATURES } from "../_shared/const.ts";
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

// Function to convert base64 to Uint8Array
function base64ToUint8Array(base64String: string): Uint8Array {
  try {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

    if (!base64Data) {
      throw new Error("Empty base64 data after removing prefix");
    }

    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  } catch (error) {
    console.error("Error converting base64 to Uint8Array:", error);
    throw new Error(
      `Failed to convert base64 to binary: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

// Function to upload to S3
async function uploadToStorage(
  userId: string,
  signatureId: string,
  filename: string,
  data: Uint8Array,
  contentType: string,
): Promise<string> {
  try {
    // Use only first 8 characters of userId and signatureId for privacy
    const shortUserId = shortenUuid(userId, 23);
    const shortSignatureId = shortenUuid(signatureId, 8);
    const filePath = `${shortUserId}/${shortSignatureId}/${filename}`;

    // Upload to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: filePath,
        Body: data,
        ContentType: contentType,
      }),
    );

    // Generate the public URL
    const publicUrl =
      `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${filePath}`;
    return publicUrl;
  } catch (error) {
    console.error("Error in uploadToStorage:", error);
    throw error; // Re-throw to be handled by the caller
  }
}

interface SignatureContent {
  [key: string]: unknown;
}

// Function to process signature content and upload base64 images
async function processSignatureContent(
  signatureContent: SignatureContent,
  userId: string,
  signatureId: string,
): Promise<{ processedContent: SignatureContent; hasBase64Images: boolean }> {
  // Create a deep copy of the signature content to avoid modifying the original
  const processedContent = JSON.parse(JSON.stringify(signatureContent));

  const uploadTasks: Promise<unknown>[] = [];

  let hasBase64Images = false;

  // Function to recursively process the signature structure
  async function processNode(node: unknown): Promise<void> {
    if (!node) return;

    if (Array.isArray(node)) {
      for (const item of node) {
        await processNode(item);
      }
      return;
    }

    if (typeof node === "object" && node !== null) {
      const objNode = node as Record<string, unknown>;

      // Check if this is an image component with base64 cropImagePreview
      if (
        objNode.cropImagePreview &&
        typeof objNode.cropImagePreview === "string" &&
        objNode.cropImagePreview.startsWith("data:image")
      ) {
        hasBase64Images = true;

        // Generate a unique filename
        const cropImagePreview = objNode.cropImagePreview as string;
        const fileExtension = "png";

        const filename = `${objNode.id}.${fileExtension}`;

        const imageData = base64ToUint8Array(cropImagePreview);

        // Create upload task using S3
        const uploadTask = uploadToStorage(
          userId,
          signatureId,
          filename,
          imageData,
          `image/${fileExtension}`,
        ).then((publicUrl) => {
          // Store clean URL without query parameters
          objNode.src = deleteQueryParameters(publicUrl);
          // Remove base64
          objNode.cropImagePreview = "";

          return { filename, url: objNode.src };
        });

        uploadTasks.push(uploadTask);
      }

      for (const key in objNode) {
        if (Object.prototype.hasOwnProperty.call(objNode, key)) {
          await processNode(objNode[key]);
        }
      }
    }
  }

  await processNode(processedContent);

  // Wait for all uploads to complete
  if (uploadTasks.length > 0) {
    try {
      await Promise.all(uploadTasks);
    } catch (error) {
      console.error("Error processing uploads:", error);
      throw new Error(
        `Failed to process image uploads: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  return { processedContent, hasBase64Images };
}

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

  try {
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
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    interface RequestBody {
      signatureContent: SignatureContent;
      info?: {
        templateSlug: string;
        version: string;
      };
    }

    let body: RequestBody = { signatureContent: {} };

    try {
      body = await req.json() as RequestBody;
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

    const { signatureContent, info } = body;

    if (!signatureContent || typeof signatureContent !== "object") {
      return new Response(
        JSON.stringify({ error: "Missing signature object in body" }),
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

    // Max signatures limit
    if ((count ?? 0) >= MAX_SIGNATURES) {
      return new Response(
        JSON.stringify({ error: "Signature limit reached" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // First, insert the record with the original content to get an ID
    const { data: insertedData, error: insertError } = await supabase
      .from("signatures")
      .insert([{
        signature_content: validationResult.data,
        user_id: userId,
        template_slug: info?.templateSlug,
        version: info?.version,
      }])
      .select()
      .single();

    if (insertError) {
      return new Response(
        JSON.stringify({ error: insertError.message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const signatureId = insertedData.id;

    // Process the signature content to handle base64 images
    const { processedContent, hasBase64Images } = await processSignatureContent(
      validationResult.data as SignatureContent,
      userId,
      signatureId,
    );

    // Only update the record if base64 images were found and processed
    if (hasBase64Images) {
      // User created signature from browser local storage
      const { error: updateError } = await supabase
        .from("signatures")
        .update({
          signature_content: processedContent,
        })
        .eq("id", signatureId)
        .eq("user_id", userId);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      }
    }

    return new Response(
      JSON.stringify({ signatureId }),
      {
        status: 201,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
});
