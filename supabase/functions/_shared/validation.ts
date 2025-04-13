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

// Helper function for HTML escaping
const sanitizeString = (val: string) =>
    val.replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Helper schema for basic string sanitization
const sanitizedString = (maxLength: number) =>
    z.string().max(maxLength).transform(sanitizeString);

// Helper schema for safe URLs
const safeUrlSchema = (maxLength: number) =>
    z.string()
        .max(maxLength)
        .url("Invalid URL format")
        .refine((val) => /^https?:/.test(val), {
            message: "URL must start with http: or https:",
        })
        .transform(sanitizeString); // Sanitize just in case

// Helper schema for valid CSS property names
const cssPropertyNameSchema = z.string().regex(/^[a-zA-Z-]+$/, {
    message: "Invalid CSS property name format",
});

// Image source schema
const imageSrcSchema = safeUrlSchema(MAX_IMAGE_SRC)
    .refine((val) => val.endsWith(".png"), {
        message: "URL must end with .png",
    });

// Base component schema
const baseComponentSchema = z.object({
    id: sanitizedString(MAX_STRING_ID),
    fontSize: sanitizedString(MAX_FONT_SIZE).optional(),
    color: sanitizedString(MAX_COLOR_LENGTH).optional(),
    letterSpacing: sanitizedString(MAX_LETTER_SPACING).optional(),
    backgroundColor: sanitizedString(MAX_COLOR_LENGTH).optional(),
    fontFamily: sanitizedString(MAX_FONT_FAMILY).optional(), // Basic check, complex fonts might need more
    fontStyle: sanitizedString(MAX_FONT_STYLE).optional(),
    fontWeight: sanitizedString(MAX_FONT_WEIGHT).optional(),
    lineHeight: sanitizedString(MAX_LINE_HEIGHT).optional(),
    textAlign: sanitizedString(MAX_TEXT_ALIGN).optional(), // Consider enums for stricter validation: z.enum(["left", "center", "right", "justify"])
    textDecoration: sanitizedString(MAX_TEXT_DECORATION).optional(), // Consider enums: z.enum(["none", "underline", "overline", "line-through"])
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
    text: sanitizedString(MAX_STRING_LENGTH),
});

const imageComponentSchema = baseComponentSchema.extend({
    src: z.union([imageSrcSchema, z.literal("")]),
    cropImagePreview: z.string().max(MAX_IMAGE_PREVIEW).optional(), // Base64 image can be large - consider stricter validation if needed
    originalSrc: z.union([imageSrcSchema, z.literal("")]).optional(),
    originalImageFile: z.any().optional(), // File type - ensure server-side handling is secure
    previewWidth: z.number().min(MIN_CROP_SIZE).max(MAX_CROP_SIZE).optional(),
    imageSettings: imageSettingsSchema.optional(),
    padding: sanitizedString(MAX_PADDING).optional(),
});

const emailComponentSchema = baseComponentSchema.extend({
    text: z.string().max(MAX_EMAIL_LENGTH).transform(sanitizeString),
});

const phoneComponentSchema = baseComponentSchema.extend({
    // Basic sanitization, consider regex for specific phone formats if needed
    text: sanitizedString(MAX_PHONE_LENGTH),
});

const websiteComponentSchema = baseComponentSchema.extend({
    // Sanitize
    text: sanitizedString(MAX_URL_LENGTH),
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
    id: sanitizedString(MAX_STRING_ID),
    // Validate both style property names and values
    style: z.record(cssPropertyNameSchema, sanitizedString(MAX_STRING_ID))
        .optional(),
    content: baseContentSchema.optional(),
});

// Column schema
const columnSchema = z.object({
    id: sanitizedString(MAX_STRING_ID),
    style: z.object({
        verticalAlign: z.enum(["top", "middle", "bottom"]).optional(),
        padding: sanitizedString(MAX_PADDING).optional(),
    }).optional(),
    rows: z.array(rowSchema).max(MAX_ROWS), // Limit to 30 rows
});

// Table row schema
const tableRowSchema = z.object({
    id: sanitizedString(MAX_STRING_ID),
    // Validate both style property names and values
    style: z.record(cssPropertyNameSchema, sanitizedString(MAX_STRING_ID))
        .optional(),
    columns: z.array(columnSchema).max(MAX_COLUMNS), // Limit to 30 columns
});

// Signature template schema
export const signatureTemplateSchema = z.object({
    info: z.object({
        templateSlug: sanitizedString(MAX_STRING_ID),
        version: sanitizedString(MAX_FONT_SIZE),
    }).optional(),
    // Ensure colors are sanitized
    colors: z.array(sanitizedString(MAX_COLOR_LENGTH)).max(MAX_COLORS),
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
