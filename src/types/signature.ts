import { ContentType } from "../const/content";

// Base component properties that are common across different content types
interface BaseComponent {
    id: string;
    fontSize?: string;
    color?: string;
    letterSpacing?: string;
    backgroundColor?: string;
    fontFamily?: string;
    fontStyle?: string;
    fontWeight?: string;
    lineHeight?: string;
    textAlign?: string;
    textDecoration?: string;
}

// Text component
interface TextComponent extends BaseComponent {
    text: string;
}

// Image component
interface ImageComponent extends BaseComponent {
    type?: ContentType.IMAGE;
    src: string;
    cropImagePreview?: string;
    originalSrc?: string;
    originalImageFile?: File;
}

// Email component structure
interface EmailComponent extends BaseComponent {
    type: ContentType.EMAIL_LINK;
    text: string;
}

// Phone component structure
interface PhoneComponent extends BaseComponent {
    type: ContentType.PHONE_LINK;
    text: string;
}

// Website component structure
interface WebsiteComponent extends BaseComponent {
    type: ContentType.WEBSITE_LINK;
    text: string;
}

// Content types that can be used in rows
interface BaseContent {
    type: ContentType;
    components: Array<
        | TextComponent
        | ImageComponent
        | EmailComponent
        | PhoneComponent
        | WebsiteComponent
    >;
}

// Row structure
interface Row {
    id: string;
    style?: {
        backgroundColor?: string;
        [key: string]: string | undefined;
    };
    content?: BaseContent;
}

// Column structure
interface Column {
    id: string;
    style?: {
        verticalAlign?: "top" | "middle" | "bottom";
        padding?: string;
        [key: string]: string | undefined;
    };
    rows: Row[];
}

// Table row structure
interface TableRow {
    id: string;
    style?: {
        backgroundColor?: string;
        [key: string]: string | undefined;
    };
    columns: Column[];
}

// Signature template structure
export interface SignatureTemplate {
    templateName: string;
    templateSlug: string;
    version: string;
    rows: TableRow[];
}
