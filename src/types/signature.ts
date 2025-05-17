import { ContentType } from "../const/content";

// Image settings for crop and display
interface ImageSettings {
    crop: {
        x: number;
        y: number;
        width: number;
        height: number;
        unit: "px" | "%";
    };
    aspect?: number | string;
    isCircular: boolean;
    borderRadius?: {
        topLeft: number;
        topRight: number;
        bottomRight: number;
        bottomLeft: number;
    };
}

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
export interface ImageComponent extends BaseComponent {
    type?: ContentType.IMAGE;
    src: string;
    cropImagePreview?: string;
    originalSrc?: string;
    originalImageFile?: File;
    previewWidth?: number;
    imageSettings?: ImageSettings;
    margin?: string;
    link?: string;
    padding?: string;
    backgroundColor?: string;
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
export interface WebsiteComponent extends BaseComponent {
    type: ContentType.WEBSITE_LINK;
    text: string;
    link?: string;
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
export interface Row {
    id: string;
    style?: {
        backgroundColor?: string;
        [key: string]: string | undefined;
    };
    content?: BaseContent;
}

// Column structure
export interface Column {
    id: string;
    style?: {
        verticalAlign?: "top" | "middle" | "bottom";
        padding?: string;
        [key: string]: string | undefined;
    };
    rows: Row[];
}

// Table row structure
export interface TableRow {
    id: string;
    style?: {
        backgroundColor?: string;
        [key: string]: string | undefined;
    };
    columns: Column[];
}

interface SignatureInfo {
    templateSlug: string;
    version: string;
    name: string;
}

// Signature template structure
export interface SignatureTemplate {
    info?: SignatureInfo;
    colors: string[];
    rows: TableRow[];
}
