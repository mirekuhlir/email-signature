// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
    generateRandomId,
    removeQueryParameters,
    shortenUuid,
} from "../_shared/utils.ts";
import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "npm:@aws-sdk/client-s3";

import { validateSignature } from "../_shared/validation.ts";

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

//Get S3 object data
async function getS3Object(key: string): Promise<Uint8Array> {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        const response = await s3.send(command);

        if (!response.Body) {
            throw new Error("No body in S3 response");
        }

        // Using AWS SDK specific methods that should be available
        return new Uint8Array(await response.Body.transformToByteArray());
    } catch (error) {
        console.error("Error getting S3 object:", error);
        throw error;
    }
}

//Upload to S3
async function uploadToStorage(
    userId: string,
    signatureId: string,
    filename: string,
    data: Uint8Array,
    contentType: string,
): Promise<string> {
    try {
        const shortUserId = shortenUuid(userId, 23);
        const shortSignatureId = shortenUuid(signatureId, 8);
        const filePath = `${shortUserId}/${shortSignatureId}/${filename}`;

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
        throw error;
    }
}

//Process signature content and duplicate its images
async function duplicateSignatureImages(
    signatureContent: Record<string, unknown>,
    userId: string,
    newSignatureId: string,
): Promise<Record<string, unknown>> {
    // Create a deep copy of the signature content
    const processedContent = JSON.parse(JSON.stringify(signatureContent));
    const imageProcessingTasks: Promise<unknown>[] = [];

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

            // Check if this is an image component with a source
            if (
                objNode.src &&
                typeof objNode.src === "string" &&
                objNode.src.includes(bucketName)
            ) {
                // Get the source image key
                const sourceKey = objNode.src.split(
                    `${bucketName}.s3.${AWS_REGION}.amazonaws.com/`,
                )[1];
                if (!sourceKey) return;

                // Create a new filename with a random ID - always use png extension
                const newFilename = `${generateRandomId()}.png`;

                // Create an upload task
                const uploadTask = getS3Object(sourceKey)
                    .then((imageData) => {
                        return uploadToStorage(
                            userId,
                            newSignatureId,
                            newFilename,
                            imageData,
                            "image/png",
                        );
                    })
                    .then((publicUrl) => {
                        // Update the image source to the new URL
                        objNode.src = removeQueryParameters(publicUrl);
                        return { filename: newFilename, url: objNode.src };
                    });

                imageProcessingTasks.push(uploadTask);
            }

            // Also handle originalSrc if it exists
            if (
                objNode.originalSrc &&
                typeof objNode.originalSrc === "string" &&
                objNode.originalSrc.includes(bucketName)
            ) {
                const sourceKey = objNode.originalSrc.split(
                    `${bucketName}.s3.${AWS_REGION}.amazonaws.com/`,
                )[1];
                if (!sourceKey) return;

                // Always use png extension
                const newFilename = `${generateRandomId()}.png`;

                const uploadTask = getS3Object(sourceKey)
                    .then((imageData) => {
                        return uploadToStorage(
                            userId,
                            newSignatureId,
                            newFilename,
                            imageData,
                            "image/png",
                        );
                    })
                    .then((publicUrl) => {
                        objNode.originalSrc = removeQueryParameters(publicUrl);
                        return {
                            filename: newFilename,
                            url: objNode.originalSrc,
                        };
                    });

                imageProcessingTasks.push(uploadTask);
            }

            // Continue recursively processing all properties of the object
            for (const key in objNode) {
                if (Object.prototype.hasOwnProperty.call(objNode, key)) {
                    await processNode(objNode[key]);
                }
            }
        }
    }

    await processNode(processedContent);

    // Wait for all image processing to complete
    if (imageProcessingTasks.length > 0) {
        try {
            await Promise.all(imageProcessingTasks);
        } catch (error) {
            console.error("Error processing image duplications:", error);
            throw new Error(
                `Failed to duplicate images: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
        }
    }

    return processedContent;
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
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        }

        const userId = data?.user?.id;
        if (!userId) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                {
                    status: 403,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        }

        // Parse request body to get the signature ID to duplicate
        let body: { signatureId: string };
        try {
            body = await req.json() as { signatureId: string };
        } catch (error) {
            const errMsg = error instanceof Error
                ? error.message
                : String(error);
            return new Response(
                JSON.stringify({ error: "Invalid JSON: " + errMsg }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        }

        const { signatureId } = body;
        if (!signatureId) {
            return new Response(
                JSON.stringify({
                    error: "Missing signatureId in request body",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        }

        // Check the user's signature count
        const { count, error: countError } = await supabase
            .from("signatures")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId);

        if (countError) {
            return new Response(
                JSON.stringify({ error: countError.message }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        }

        // Max signatures limit
        if ((count ?? 0) >= 10) {
            return new Response(
                JSON.stringify({ error: "Signature limit reached" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        }

        // Fetch the source signature
        const { data: sourceSignature, error: fetchError } = await supabase
            .from("signatures")
            .select("*")
            .eq("id", signatureId)
            .eq("user_id", userId)
            .single();

        if (fetchError || !sourceSignature) {
            return new Response(
                JSON.stringify({
                    error: "Signature not found or not authorized",
                }),
                {
                    status: 403,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        }

        // Validate signature content
        const validationResult = validateSignature(
            sourceSignature.signature_content,
        );
        if (!validationResult.success) {
            return new Response(
                JSON.stringify({
                    error: "Invalid signature data",
                    details: validationResult.error,
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        }

        // First, insert a new record with the original content to get a new ID
        const { data: newSignature, error: insertError } = await supabase
            .from("signatures")
            .insert([{
                signature_content: sourceSignature.signature_content,
                user_id: userId,
                template_slug: sourceSignature.template_slug,
                version: sourceSignature.version,
            }])
            .select()
            .single();

        if (insertError) {
            return new Response(
                JSON.stringify({ error: insertError.message }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        }

        const newSignatureId = newSignature.id;

        // Process and duplicate the signature's images
        const processedContent = await duplicateSignatureImages(
            sourceSignature.signature_content,
            userId,
            newSignatureId,
        );

        // Update the new signature with the processed content
        const { error: updateError } = await supabase
            .from("signatures")
            .update({
                signature_content: processedContent,
            })
            .eq("id", newSignatureId)
            .eq("user_id", userId);

        if (updateError) {
            return new Response(
                JSON.stringify({ error: updateError.message }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                },
            );
        }

        return new Response(
            JSON.stringify({ signatureId: newSignatureId }),
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
