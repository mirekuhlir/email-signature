/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToastStore } from "@/src/components/ui/toast";

export const handleCopy = async (/*signatureId: string*/) => {
  const signatureElement = document.getElementById(
    "email-signature-light-for-copy",
  );
  if (!signatureElement) return;

  const textContent = signatureElement.innerText;
  let htmlContent = signatureElement.innerHTML;

  // Remove cache busting parameter from PNG images
  htmlContent = htmlContent.replace(/\.png\?t=\d+/g, ".png");

  const { addToast } = useToastStore.getState();

  if (navigator.clipboard && window.ClipboardItem) {
    try {
      const clipboardItem = new ClipboardItem({
        "text/plain": new Blob([textContent], { type: "text/plain" }),
        "text/html": new Blob([htmlContent], { type: "text/html" }),
      });
      await navigator.clipboard.write([clipboardItem]);
      return;
    } catch (err) {
      console.error("Modern clipboard API failed:", err);
    }
  }

  // Fallback fot Safari iOS or older browsers
  try {
    const tempElement = document.createElement("div");
    tempElement.style.backgroundColor = "transparent";
    tempElement.style.color = "black";
    tempElement.innerHTML = htmlContent;
    tempElement.style.position = "fixed";
    tempElement.style.left = "-9999px";
    document.body.appendChild(tempElement);

    const range = document.createRange();
    range.selectNodeContents(tempElement);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    const success = document.execCommand("copy");

    if (selection) {
      selection.removeAllRanges();
    }
    document.body.removeChild(tempElement);

    if (!success) {
      throw new Error("execCommand copy failed");
    }
  } catch (err) {
    console.error("Fallback copying failed:", err);

    // Error toast when all methods fail
    addToast({
      title: "Error",
      description: "Failed to copy signature to clipboard",
      variant: "error",
      duration: 5000,
    });
  }
};

export const getWidthHeightStyle = (component: any) => {
  let width = 0;
  let height = 0;
  if (component) {
    width = typeof component.width === "number"
      ? component.width
      : parseInt((component.width || "0").toString().replace("px", ""), 10) ||
        0;
    height = typeof component.height === "number" ? component.height : parseInt(
      (component.height || "0").toString().replace("px", ""),
      10,
    ) || 0;
  }
  return {
    width: width === 0 ? "100%" : `${width}px`,
    height: height === 0 ? 0 : `${height}px`,
  };
};
