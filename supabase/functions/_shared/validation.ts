import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Base component schema
const baseComponentSchema = z.object({
    id: z.string().max(100),
    fontSize: z.string().max(50).optional(),
    color: z.string().max(50).optional(),
    letterSpacing: z.string().max(50).optional(),
    backgroundColor: z.string().max(50).optional(),
    fontFamily: z.string().max(100).optional(),
    fontStyle: z.string().max(50).optional(),
    fontWeight: z.string().max(50).optional(),
    lineHeight: z.string().max(50).optional(),
    textAlign: z.string().max(50).optional(),
    textDecoration: z.string().max(50).optional(),
});

// Image settings schema
const imageSettingsSchema = z.object({
    crop: z.object({
        x: z.number().min(0).max(10000),
        y: z.number().min(0).max(10000),
        width: z.number().min(1).max(10000),
        height: z.number().min(1).max(10000),
        unit: z.string().max(10),
    }),
    aspect: z.union([z.number().min(0.1).max(10), z.string().max(10)])
        .optional(),
    isCircular: z.boolean(),
    borderRadius: z.number().min(0).max(100).optional(),
});

// Component schemas
const textComponentSchema = baseComponentSchema.extend({
    text: z.string().max(10000),
});

const imageComponentSchema = baseComponentSchema.extend({
    type: z.literal("image").optional(),
    src: z.string().max(1000),
    cropImagePreview: z.string().max(1000000).optional(), // Base64 image can be large
    originalSrc: z.string().max(1000).optional(),
    originalImageFile: z.any().optional(), // File type
    previewWidth: z.number().min(1).max(10000).optional(),
    imageSettings: imageSettingsSchema.optional(),
});

const emailComponentSchema = baseComponentSchema.extend({
    type: z.literal("emailLink"),
    text: z.string().max(255), // Standard email length limit
});

const phoneComponentSchema = baseComponentSchema.extend({
    type: z.literal("phoneLink"),
    text: z.string().max(50), // Phone numbers are typically shorter
});

const websiteComponentSchema = baseComponentSchema.extend({
    type: z.literal("websiteLink"),
    text: z.string().max(2000), // URLs can be longer
});

// Content schema
const baseContentSchema = z.object({
    type: z.enum(["text", "image", "email", "phone", "website", "customValue"]),
    components: z.array(
        z.union([
            textComponentSchema,
            imageComponentSchema,
            emailComponentSchema,
            phoneComponentSchema,
            websiteComponentSchema,
        ]),
    ).max(30), // Limit to 30 components
});

// Row schema
const rowSchema = z.object({
    id: z.string().max(100),
    style: z.record(z.string().max(100)).optional(),
    content: baseContentSchema.optional(),
});

// Column schema
const columnSchema = z.object({
    id: z.string().max(100),
    style: z.object({
        verticalAlign: z.enum(["top", "middle", "bottom"]).optional(),
        padding: z.string().max(50).optional(),
    }).optional(),
    rows: z.array(rowSchema).max(30), // Limit to 30 rows
});

// Table row schema
const tableRowSchema = z.object({
    id: z.string().max(100),
    style: z.record(z.string().max(100)).optional(),
    columns: z.array(columnSchema).max(30), // Limit to 30 columns
});

// Signature template schema
export const signatureTemplateSchema = z.object({
    info: z.object({
        templateSlug: z.string().max(100),
        version: z.string().max(50),
    }).optional(),
    colors: z.array(z.string().max(50)).max(30), // Limit to 30 colors
    rows: z.array(tableRowSchema).max(30), // Limit to 30 rows
});

// Validation function
export const validateSignature = (data: unknown) => {
    try {
        const validatedData = signatureTemplateSchema.parse(data);
        return { success: true, data: validatedData };
    } catch (error: unknown) {
        // Log detailed error to console
        console.error(
            "Validation error:",
            error instanceof z.ZodError ? error.errors : error,
        );

        return {
            success: false,
            error: "Invalid signature data",
        };
    }
};
