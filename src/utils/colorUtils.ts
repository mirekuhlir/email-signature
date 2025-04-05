/**
 * Recursively traverses a data structure (array or object) and inverts colors.
 * Modifies the object/array directly (in-place).
 * @param node A part of the data structure (array, object, value).
 */
function traverseAndInvertColors(node: unknown): void {
    if (Array.isArray(node)) {
        // If it's an array, iterate through all its elements
        node.forEach(traverseAndInvertColors);
    } else if (typeof node === "object" && node !== null) {
        // If it's an object, iterate through all its properties
        const objNode = node as Record<string, unknown>;
        Object.keys(objNode).forEach((key) => {
            const value = objNode[key];
            // If the property value is a string and the key is 'color' or ends with 'Color'
            if (
                typeof value === "string" &&
                (key === "color" || key.endsWith("Color"))
            ) {
                // Invert the color
                objNode[key] = invertColor(value);
            } else if (typeof value === "object" || Array.isArray(value)) {
                // If the value is another object or array, recurse deeper
                traverseAndInvertColors(value);
            }
            // Ignore other value types
        });
    }
    // Ignore primitive data types (except strings representing colors)
}

// --- Main exported function ---

// Define a more specific type if possible, for now using Record<string, unknown>
type SignatureRow = Record<string, unknown>;

/**
 * Creates a deep copy of the signature rows data structure and inverts the colors within it.
 * The original data structure remains unchanged.
 * @param originalRows The original array of rows (e.g., signature_b.rows).
 * @returns A new array of rows with inverted colors.
 */
export function getInvertedSignatureRows(
    originalRows: SignatureRow[],
): SignatureRow[] {
    // Create a deep copy so we don't modify the original template
    const clonedRows = JSON.parse(JSON.stringify(originalRows));

    // Traverse the copy and invert colors
    traverseAndInvertColors(clonedRows);

    return clonedRows;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h * 360, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r: number, g: number, b: number;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number): number => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        h /= 360;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Inverts a color in a way that simulates dark mode adjustments.
 * Converts RGB to HSL, adjusts Hue and Lightness, then converts back to RGB.
 * @param color The original color as a string (e.g., "rgb(0, 0, 0)").
 * @returns The inverted color as a string.
 */
function invertColor(color: string): string {
    // Attempt to parse the rgb() string
    const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    if (!rgbMatch) {
        // If the format doesn't match, return the original color (or we could add support for hex, etc.)
        console.warn(`Could not parse color for inversion: ${color}`);
        return color; // Return original if parsing fails
    }

    const [, rStr, gStr, bStr] = rgbMatch;
    const r = parseInt(rStr, 10);
    const g = parseInt(gStr, 10);
    const b = parseInt(bStr, 10);

    // Convert RGB to HSL
    const [h, s, l] = rgbToHsl(r, g, b);

    // Invert Lightness (L' = 1 - L)
    const invertedL = 1 - l;

    // Optionally, rotate hue by 180 degrees for a more distinct inversion
    // const invertedH = (h + 180) % 360;
    // For a simpler dark mode simulation, often just inverting lightness is enough
    const invertedH = h; // Keep original hue

    // Keep original saturation
    const invertedS = s;

    // Convert back to RGB
    const [invertedR, invertedG, invertedB] = hslToRgb(
        invertedH,
        invertedS,
        invertedL,
    );

    // Return the inverted color as an rgb() string
    return `rgb(${invertedR}, ${invertedG}, ${invertedB})`;
}
