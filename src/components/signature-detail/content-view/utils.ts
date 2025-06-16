/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToastStore } from "@/src/components/ui/toast";
import { UserStatus } from "@/src/utils/userState";

export const handleCopy = async (userStatus: UserStatus) => {
  const signatureElement = document.getElementById(
    "email-signature-light-for-copy",
  );
  if (!signatureElement) return;

  const textContent = signatureElement.innerText;
  let htmlContent = signatureElement.innerHTML;

  // Remove cache busting parameter from PNG imagesis
  htmlContent = htmlContent.replace(/\.png\?t=\d+/g, ".png");

  // Add trial information for trial users
  if (userStatus === UserStatus.TRIAL) {
    // Find the main table structure and add trial row
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Find the main table
    const mainTable = doc.querySelector('table[role="presentation"]');

    if (mainTable) {
      // Create spacer row
      const spacerRow = doc.createElement("tr");
      const spacerCell = doc.createElement("td");
      spacerCell.setAttribute("colspan", "2");
      spacerCell.style.cssText =
        "height: 20px; line-height: 20px; font-size: 1px;";
      spacerCell.innerHTML = "&nbsp;";
      spacerRow.appendChild(spacerCell);

      // Create trial row
      const trialRow = doc.createElement("tr");
      const trialCell = doc.createElement("td");

      trialCell.setAttribute("colspan", "2");

      trialCell.style.cssText =
        "padding: 6px 6px 6px 6px; text-align: left; background-color: #1B145D; border-radius: 4px; width: 100%; border: 2px dotted red; height: 80px;";

      trialCell.innerHTML = `
        <div style="font-size: 14px; color: white; font-family: Arial, sans-serif; font-weight: bold; padding-bottom: 5px; line-height: normal;">
          You are using the free version
        </div>
        <div style="font-size: 14px; color: white; font-family: Arial, sans-serif; padding-bottom: 5px; line-height: normal;">
          Upgrade to the full version:
        </div>
        <div style="font-size: 14px; color: white; font-family: Arial, sans-serif; line-height: normal;">
          <a href="https://www.myemailavatar.com" target="_blank" rel="noreferrer" style="color: white; text-decoration: underline;">
          https://www.myemailavatar.com
          </a>
        </div>
      `;

      trialRow.appendChild(trialCell);

      // Add spacer and trial rows to the main table
      mainTable.appendChild(spacerRow);
      mainTable.appendChild(trialRow);

      // Get the modified HTML
      htmlContent = doc.body.innerHTML;
    }
  }

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
    height: height === 0 ? "auto" : `${height}px`,
  };
};
