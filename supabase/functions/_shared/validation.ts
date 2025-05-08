import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

import { MAX_COLORS, MAX_COLUMNS, MAX_COMPONENTS, MAX_ROWS } from "./const.ts";

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

// Adding a generic CSS value length for properties like string borderRadius
const MAX_CSS_VALUE_LENGTH = 50;

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

import {
    MAX_BORDER_RADIUS,
    MAX_MARGIN,
    MAX_PADDING,
    MIN_BORDER_RADIUS,
} from "./const.ts";

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

// New schema for website link text, allowing for URLs without http/https prefix
const websiteLinkTextSchema = (maxLength: number) =>
    z.string()
        .max(maxLength)
        .transform((val) => {
            if (
                typeof val === "string" && val.length > 0 &&
                !val.startsWith("http://") && !val.startsWith("https://") &&
                val.includes(".")
            ) {
                // Basic check to see if it's likely a domain name missing a scheme
                if (
                    val.split(".").length > 1 && !val.includes(" ") &&
                    !val.startsWith("/") && !val.includes("://")
                ) {
                    return `http://${val}`;
                }
            }
            return val;
        })
        .pipe(
            z.string().url({
                message:
                    "Invalid URL format. Please provide a full URL including http:// or https://, or a valid domain name like www.example.com.",
            }),
        )
        .transform(sanitizeString);

// Helper schema for valid CSS property names
const cssPropertyNameSchema = z.string().regex(/^[a-zA-Z][a-zA-Z0-9]*$/, {
    message:
        "Invalid CSS property name format. Must be camelCase or a simple word (e.g., padding, backgroundColor).",
});

// Image source schema
const imageSrcSchema = safeUrlSchema(MAX_IMAGE_SRC)
    .refine((val) => val.endsWith(".png") || val.endsWith(".jpg"), {
        message: "URL must end with .png or .jpg",
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
    // Added properties based on JSON
    padding: sanitizedString(MAX_PADDING).optional(),
    borderRadius: sanitizedString(MAX_CSS_VALUE_LENGTH).optional(), // For string based border radius like "0px" or "0px 0px 0px 0px"
    borderTopColor: sanitizedString(MAX_COLOR_LENGTH).optional(),
    borderTopStyle: sanitizedString(MAX_FONT_STYLE).optional(),
    borderTopWidth: sanitizedString(MAX_FONT_SIZE).optional(),
    borderLeftColor: sanitizedString(MAX_COLOR_LENGTH).optional(),
    borderLeftStyle: sanitizedString(MAX_FONT_STYLE).optional(),
    borderLeftWidth: sanitizedString(MAX_FONT_SIZE).optional(),
    borderRightColor: sanitizedString(MAX_COLOR_LENGTH).optional(),
    borderRightStyle: sanitizedString(MAX_FONT_STYLE).optional(),
    borderRightWidth: sanitizedString(MAX_FONT_SIZE).optional(),
    borderBottomColor: sanitizedString(MAX_COLOR_LENGTH).optional(),
    borderBottomStyle: sanitizedString(MAX_FONT_STYLE).optional(),
    borderBottomWidth: sanitizedString(MAX_FONT_SIZE).optional(),
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
    // TODO - jinak
    borderRadius: z.object({
        topLeft: z.number().min(MIN_BORDER_RADIUS).max(MAX_BORDER_RADIUS),
        topRight: z.number().min(MIN_BORDER_RADIUS).max(MAX_BORDER_RADIUS),
        bottomRight: z.number().min(MIN_BORDER_RADIUS).max(MAX_BORDER_RADIUS),
        bottomLeft: z.number().min(MIN_BORDER_RADIUS).max(MAX_BORDER_RADIUS),
    }).optional(),
    margin: sanitizedString(MAX_MARGIN).optional(),
});

// Component schemas
const imageComponentSchema = baseComponentSchema.extend({
    src: z.union([imageSrcSchema, z.literal("")]),
    cropImagePreview: z.string().max(MAX_IMAGE_PREVIEW).optional(), // Base64 image can be large - consider stricter validation if needed
    originalSrc: z.union([imageSrcSchema, z.literal("")]).optional(),
    originalImageFile: z.any().optional(), // File type - ensure server-side handling is secure
    previewWidth: z.number().min(MIN_CROP_SIZE).max(MAX_CROP_SIZE).optional(),
    imageSettings: imageSettingsSchema.optional(),
    padding: sanitizedString(MAX_PADDING).optional(),
    margin: sanitizedString(MAX_MARGIN).optional(),
});

/* The following schemas are no longer directly used in content schemas as their
   functionality has been incorporated into TextTypedComponentSchema and the discriminated unions
   for link-type components (EmailLinkTypedComponentSchema, PhoneLinkTypedComponentSchema, WebsiteLinkTypedComponentSchema).

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
*/

// Specific typed components (for use within content.components arrays)
const TextTypedComponentSchema = baseComponentSchema.extend({
    text: sanitizedString(MAX_STRING_LENGTH),
    type: z.literal("text"),
});

// Schema for text components specifically within textContentSchema, type is implied
const TextComponentContentSchema = baseComponentSchema.extend({
    text: sanitizedString(MAX_STRING_LENGTH),
    // No 'type' field here as it's implied by the parent textContentSchema
});

const PhoneLinkTypedComponentSchema = baseComponentSchema.extend({
    text: sanitizedString(MAX_PHONE_LENGTH),
    type: z.literal("phoneLink"),
});

const EmailLinkTypedComponentSchema = baseComponentSchema.extend({
    text: z.string().max(MAX_EMAIL_LENGTH).email({
        message:
            "Invalid email format. If this is a template variable, ensure it is a valid email placeholder.",
    }).transform(sanitizeString),
    type: z.literal("emailLink"),
});

const WebsiteLinkTypedComponentSchema = baseComponentSchema.extend({
    text: websiteLinkTextSchema(MAX_URL_LENGTH), // text is a URL for websiteLink, using the new permissive schema
    type: z.literal("websiteLink"),
});

// Content schema for text type
const textContentSchema = z.object({
    type: z.literal("text"),
    components: z.array(TextComponentContentSchema).max(MAX_COMPONENTS), // Use TextComponentContentSchema
});

// Content schema for image type
const imageContentSchema = z.object({
    type: z.literal("image"),
    components: z.array(imageComponentSchema).max(MAX_COMPONENTS),
});

// Content schema for email type
const emailContentSchema = z.object({
    type: z.literal("email"),
    components: z.array(
        z.discriminatedUnion("type", [
            TextTypedComponentSchema, // For labels like "Email: "
            EmailLinkTypedComponentSchema, // For the actual email link
        ]),
    ).max(MAX_COMPONENTS),
});

// Content schema for phone type
const phoneContentSchema = z.object({
    type: z.literal("phone"),
    components: z.array(
        z.discriminatedUnion("type", [
            TextTypedComponentSchema, // For labels like "Tel: "
            PhoneLinkTypedComponentSchema, // For the actual phone link
        ]),
    ).max(MAX_COMPONENTS),
});

// Content schema for website type
const websiteContentSchema = z.object({
    type: z.literal("website"),
    components: z.array(
        z.discriminatedUnion("type", [
            TextTypedComponentSchema, // For labels
            WebsiteLinkTypedComponentSchema, // For the actual website link
        ]),
    ).max(MAX_COMPONENTS),
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
    style: z.record(cssPropertyNameSchema, sanitizedString(MAX_STRING_ID))
        .optional(),
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
