interface TextNode {
    type: "text";
    content: string;
    styles?: {
        color?: string;
        fontSize?: string;
        fontWeight?: string;
        fontStyle?: string;
        textDecoration?: string;
        textAlign?: string;
    };
}

interface ElementNode {
    type: "element";
    tag: string;
    children: (TextNode | ElementNode)[];
    styles?: {
        color?: string;
        fontSize?: string;
        fontWeight?: string;
        fontStyle?: string;
        textDecoration?: string;
        textAlign?: string;
    };
}

export function formatHtmlToJson(html: string): (TextNode | ElementNode)[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    function getStyles(element: Element): Record<string, string> {
        const styles: Record<string, string> = {};
        const computedStyle = window.getComputedStyle(element);

        if (element instanceof HTMLFontElement && element.color) {
            styles.color = element.color;
        } else if (element.getAttribute("style")?.includes("color")) {
            styles.color = computedStyle.color;
        }

        if (computedStyle.fontSize) styles.fontSize = computedStyle.fontSize;
        if (computedStyle.fontWeight !== "400") {
            styles.fontWeight = computedStyle.fontWeight;
        }
        if (computedStyle.fontStyle !== "normal") {
            styles.fontStyle = computedStyle.fontStyle;
        }
        if (computedStyle.textDecoration !== "none") {
            styles.textDecoration = computedStyle.textDecoration;
        }
        if (computedStyle.textAlign !== "left") {
            styles.textAlign = computedStyle.textAlign;
        }

        return styles;
    }

    function parseNode(node: Node): (TextNode | ElementNode)[] {
        if (node.nodeType === Node.TEXT_NODE) {
            const content = node.textContent?.trim();
            if (!content) return [];
            return [{
                type: "text",
                content,
            }];
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const children: (TextNode | ElementNode)[] = [];

            element.childNodes.forEach((child) => {
                children.push(...parseNode(child));
            });

            const styles = getStyles(element);

            return [{
                type: "element",
                tag: element.tagName.toLowerCase(),
                children,
                ...(Object.keys(styles).length > 0 && { styles }),
            }];
        }

        return [];
    }

    return doc.body.childNodes.length > 0
        ? Array.from(doc.body.childNodes).flatMap((node) => parseNode(node))
        : [];
}
