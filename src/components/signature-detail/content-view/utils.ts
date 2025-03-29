import { useToastStore } from "@/src/components/ui/toast";

export const handleCopy = async (signatureId: string) => {
  const signatureElement = document.getElementById(signatureId);
  if (!signatureElement) return;

  const textContent = signatureElement.innerText;
  let htmlContent = signatureElement.outerHTML;

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

function adjustColorForDarkMode(hex: string): string {
  // Odstraní hash z hex kódu, pokud existuje
  hex = hex.replace("#", "");

  // Pokud je to tříznakový hex kód, rozšiř na šesti znakový
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Převést hex na decimální hodnoty
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Heuristika pro rozhodnutí, jak barvu upravit
  // Tmavé pozadí -> světlé; světlé pozadí -> tmavé
  if ((r + g + b) / 3 > 200) {
    // Pokud je barva velmi světlá, použij jemnou tmavší šedou
    return "#333333"; // tmavě šedá pro světlé pozadí
  } else if ((r + g + b) / 3 < 55) {
    // Pokud je barva velmi tmavá, použij jemnou světlou šedou
    return "#CCCCCC"; // světle šedá pro tmavý text
  } else {
    // Lehce upravit barvy, aby odpovídaly tmavému režimu
    const newR = Math.floor(r * 0.8);
    const newG = Math.floor(g * 0.8);
    const newB = Math.floor(b * 0.8);
    return `#${
      ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)
        .toUpperCase()
    }`;
  }
}
