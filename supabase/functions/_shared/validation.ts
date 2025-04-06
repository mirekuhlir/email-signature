import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Constants for validation limits

const MAX_COMPONENTS = 30;
const MAX_ROWS = 30;
const MAX_COLUMNS = 30;
const MAX_COLORS = 30;

const MAX_STRING_ID = 100;
const MAX_STRING_LENGTH = 10000;
const MAX_COLOR_LENGTH = 50;
const MAX_FONT_SIZE = 50;
const MAX_LETTER_SPACING = 50;
const MAX_FONT_FAMILY = 100;
const MAX_FONT_STYLE = 50;
const MAX_FONT_WEIGHT = 50;
const MAX_LINE_HEIGHT = 50;
const MAX_TEXT_ALIGN = 50;
const MAX_TEXT_DECORATION = 50;
const MAX_PADDING = 50;
const MAX_IMAGE_SRC = 200;
const MAX_IMAGE_PREVIEW = 1000000;
const MAX_EMAIL_LENGTH = 255;
const MAX_PHONE_LENGTH = 50;
const MAX_URL_LENGTH = 2000;

// Crop limits
const MIN_CROP_POSITION = 0;
const MAX_CROP_POSITION = 10000;
const MIN_CROP_SIZE = 1;
const MAX_CROP_SIZE = 10000;
const MAX_CROP_UNIT = 10;

// Aspect ratio limits
const MIN_ASPECT_RATIO = 0.1;
const MAX_ASPECT_RATIO = 10;
const MAX_ASPECT_STRING = 10;

// Border limits
const MIN_BORDER_RADIUS = 0;
const MAX_BORDER_RADIUS = 100;

// Image source schema
const imageSrcSchema = z.string()
    .max(MAX_IMAGE_SRC)
    .url("Invalid URL format")
    .refine((val) => val.endsWith(".png"), {
        message: "URL must end with .png",
    });

// Base component schema
const baseComponentSchema = z.object({
    id: z.string().max(MAX_STRING_ID),
    fontSize: z.string().max(MAX_FONT_SIZE).optional(),
    color: z.string().max(MAX_COLOR_LENGTH).optional(),
    letterSpacing: z.string().max(MAX_LETTER_SPACING).optional(),
    backgroundColor: z.string().max(MAX_COLOR_LENGTH).optional(),
    fontFamily: z.string().max(MAX_FONT_FAMILY).optional(),
    fontStyle: z.string().max(MAX_FONT_STYLE).optional(),
    fontWeight: z.string().max(MAX_FONT_WEIGHT).optional(),
    lineHeight: z.string().max(MAX_LINE_HEIGHT).optional(),
    textAlign: z.string().max(MAX_TEXT_ALIGN).optional(),
    textDecoration: z.string().max(MAX_TEXT_DECORATION).optional(),
});

// Image settings schema
const imageSettingsSchema = z.object({
    crop: z.object({
        x: z.number().min(MIN_CROP_POSITION).max(MAX_CROP_POSITION),
        y: z.number().min(MIN_CROP_POSITION).max(MAX_CROP_POSITION),
        width: z.number().min(MIN_CROP_SIZE).max(MAX_CROP_SIZE),
        height: z.number().min(MIN_CROP_SIZE).max(MAX_CROP_SIZE),
        unit: z.string().max(MAX_CROP_UNIT),
    }),
    aspect: z.union([
        z.number().min(MIN_ASPECT_RATIO).max(MAX_ASPECT_RATIO),
        z.string().max(MAX_ASPECT_STRING),
    ])
        .optional(),
    isCircular: z.boolean(),
    borderRadius: z.number().min(MIN_BORDER_RADIUS).max(MAX_BORDER_RADIUS)
        .optional(),
});

// Component schemas
const textComponentSchema = baseComponentSchema.extend({
    text: z.string().max(MAX_STRING_LENGTH),
});

const imageComponentSchema = baseComponentSchema.extend({
    src: imageSrcSchema,
    cropImagePreview: z.string().max(MAX_IMAGE_PREVIEW).optional(), // Base64 image can be large
    originalSrc: imageSrcSchema.optional(),
    originalImageFile: z.any().optional(), // File type
    previewWidth: z.number().min(MIN_CROP_SIZE).max(MAX_CROP_SIZE).optional(),
    imageSettings: imageSettingsSchema.optional(),
    padding: z.string().max(MAX_PADDING).optional(),
});

const emailComponentSchema = baseComponentSchema.extend({
    text: z.string().max(MAX_EMAIL_LENGTH), // Standard email length limit
});

const phoneComponentSchema = baseComponentSchema.extend({
    text: z.string().max(MAX_PHONE_LENGTH), // Phone numbers are typically shorter
});

const websiteComponentSchema = baseComponentSchema.extend({
    text: z.string().max(MAX_URL_LENGTH), // URLs can be longer
});

// Content schema for text type
const textContentSchema = z.object({
    type: z.literal("text"),
    components: z.array(textComponentSchema).max(MAX_COMPONENTS),
});

// Content schema for image type
const imageContentSchema = z.object({
    type: z.literal("image"),
    components: z.array(imageComponentSchema).max(MAX_COMPONENTS),
});

// Content schema for email type
const emailContentSchema = z.object({
    type: z.literal("email"),
    components: z.array(emailComponentSchema).max(MAX_COMPONENTS),
});

// Content schema for phone type
const phoneContentSchema = z.object({
    type: z.literal("phone"),
    components: z.array(phoneComponentSchema).max(MAX_COMPONENTS),
});

// Content schema for website type
const websiteContentSchema = z.object({
    type: z.literal("website"),
    components: z.array(websiteComponentSchema).max(MAX_COMPONENTS),
});

// Content schema for custom type
const customValueContentSchema = z.object({
    type: z.literal("customValue"),
    components: z.array(baseComponentSchema).max(MAX_COMPONENTS),
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
    id: z.string().max(MAX_STRING_ID),
    style: z.record(z.string().max(MAX_STRING_ID)).optional(),
    content: baseContentSchema.optional(),
});

// Column schema
const columnSchema = z.object({
    id: z.string().max(MAX_STRING_ID),
    style: z.object({
        verticalAlign: z.enum(["top", "middle", "bottom"]).optional(),
        padding: z.string().max(MAX_PADDING).optional(),
    }).optional(),
    rows: z.array(rowSchema).max(MAX_ROWS), // Limit to 30 rows
});

// Table row schema
const tableRowSchema = z.object({
    id: z.string().max(MAX_STRING_ID),
    style: z.record(z.string().max(MAX_STRING_ID)).optional(),
    columns: z.array(columnSchema).max(MAX_COLUMNS), // Limit to 30 columns
});

// Signature template schema
export const signatureTemplateSchema = z.object({
    info: z.object({
        templateSlug: z.string().max(MAX_STRING_ID),
        version: z.string().max(MAX_FONT_SIZE),
    }).optional(),
    colors: z.array(z.string().max(MAX_COLOR_LENGTH)).max(MAX_COLORS), // Limit to 30 colors
    rows: z.array(tableRowSchema).max(MAX_ROWS), // Limit to 30 rows
});

// Validation function
export const validateSignature = (data: unknown) => {
    try {
        // First, validate that data has the expected structure
        if (!data || typeof data !== "object") {
            console.error("Invalid input: not an object");
            return { success: false, error: "Invalid input: not an object" };
        }

        // Perform the validation
        const validatedData = signatureTemplateSchema.parse(data);
        return { success: true, data: validatedData };
    } catch (error) {
        // Enhanced error reporting
        if (error instanceof z.ZodError) {
            console.error(
                "Zod validation error:",
                JSON.stringify(error.errors, null, 2),
            );

            // Extract the specific error for more targeted debugging
            const fieldErrors = error.errors.map((err) => ({
                path: err.path.join("."),
                code: err.code,
                message: err.message,
            }));

            return {
                success: false,
                error: fieldErrors,
            };
        }

        console.error("Unexpected validation error:", error);
        return {
            success: false,
            error: "Invalid signature data",
        };
    }
};
