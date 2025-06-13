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

  const trialTable = userStatus === UserStatus.TRIAL
    ? `
    <br />
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: separate; margin: 0; background-color: #1B145D; width: 100%;">
        <tbody>
          <tr>
            <td style="padding: 0px 0px; text-align: left;">
                <span style="font-size: 14px; color: white; font-family: Arial, sans-serif; font-weight: bold;">
               You are using the trial version of the app.
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 0px 0px; text-align: left;">
              <span style="font-size: 14px; color: white; font-family: Arial, sans-serif; font-weight: bold;">
                You can upgrade to the full version of the app by clicking the link below.
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 0px 0px; text-align: left;">
              <span style="font-size: 14px; color: white; font-family: Arial, sans-serif; font-weight: bold;">
                <a href="https://example.com" target="_blank" rel="noreferrer" style="color: white; text-decoration: underline;">
                  TODO: Add link to the full version
                </a>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    `
    : "";
  htmlContent = htmlContent + trialTable;

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
