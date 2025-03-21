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
    src: z.string().max(1000),
    cropImagePreview: z.string().max(1000000).optional(), // Base64 image can be large
    originalSrc: z.string().max(1000).optional(),
    originalImageFile: z.any().optional(), // File type
    previewWidth: z.number().min(1).max(10000).optional(),
    imageSettings: imageSettingsSchema.optional(),
    padding: z.string().max(50).optional(),
});

const emailComponentSchema = baseComponentSchema.extend({
    text: z.string().max(255), // Standard email length limit
});

const phoneComponentSchema = baseComponentSchema.extend({
    text: z.string().max(50), // Phone numbers are typically shorter
});

const websiteComponentSchema = baseComponentSchema.extend({
    text: z.string().max(2000), // URLs can be longer
});

// Content schema for text type
const textContentSchema = z.object({
    type: z.literal("text"),
    components: z.array(textComponentSchema).max(30),
});

// Content schema for image type
const imageContentSchema = z.object({
    type: z.literal("image"),
    components: z.array(imageComponentSchema).max(30),
});

// Content schema for email type
const emailContentSchema = z.object({
    type: z.literal("emailLink"),
    components: z.array(emailComponentSchema).max(30),
});

// Content schema for phone type
const phoneContentSchema = z.object({
    type: z.literal("phoneLink"),
    components: z.array(phoneComponentSchema).max(30),
});

// Content schema for website type
const websiteContentSchema = z.object({
    type: z.literal("websiteLink"),
    components: z.array(websiteComponentSchema).max(30),
});

// Content schema for custom type
const customValueContentSchema = z.object({
    type: z.literal("customValue"),
    components: z.array(baseComponentSchema).max(30),
});

// Combined content schema
const baseContentSchema = z.discriminatedUnion("type", [
    textContentSchema,
    imageContentSchema,
    emailContentSchema,
    phoneContentSchema,
    websiteContentSchema,
    customValueContentSchema,
]);

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
        // deno-lint-ignore no-explicit-any
    } catch (error: any) {
        console.error(
            "Validation error:",
            error instanceof z.ZodError ? error.errors : error,
        );

        return {
            success: false,
            error: error instanceof z.ZodError
                ? error.errors
                : "Invalid signature data",
        };
    }
};
