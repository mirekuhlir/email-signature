export const handleCopy = async (signatureId: string) => {
  const signatureElement = document.getElementById(signatureId);
  if (signatureElement) {
    const textContent = signatureElement.innerText;
    try {
      const htmlContent = signatureElement.outerHTML;

      const clipboardItem = new ClipboardItem({
        "text/plain": new Blob([textContent], { type: "text/plain" }),
        "text/html": new Blob([htmlContent], { type: "text/html" }),
      });

      await navigator.clipboard.write([clipboardItem]);

      console.warn("htmlContent", htmlContent);
      /*  setCopySuccess(`Signature ${signatureId} copied!`);
        setTimeout(() => setCopySuccess(null), 2000); */
    } catch (err) {
      console.error("Copying failed:", err);
      // Fallback for browsers without Clipboard API support
      try {
        await navigator.clipboard.writeText(textContent);

        /*        setCopySuccess(`Signature ${signatureId} copied (plain text)!`);
          setTimeout(() => setCopySuccess(null), 2000); */
      } catch (fallbackErr) {
        console.error("Fallback copying failed:", fallbackErr);
      }
    }
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
