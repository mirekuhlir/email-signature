export const traversePath = (obj: any, path: string): any => {
  const parts = path.split(".");
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    if (current.rows) {
      current = current.rows[parseInt(parts[i])];
    } else if (current.columns) {
      current = current.columns[parseInt(parts[i])];
    }
  }

  return current;
};

export const updatePaths = (rows: any[], basePath: string = "") => {
  rows.forEach((row, rowIndex) => {
    const currentPath = basePath ? `${basePath}.${rowIndex}` : `${rowIndex}`;
    row.path = currentPath;

    row.columns?.forEach((column: any, colIndex: number) => {
      const columnPath = `${currentPath}.${colIndex}`;
      column.path = columnPath;

      if (column.rows) {
        updatePaths(column.rows, columnPath);
      }
    });
  });
  return rows;
};

export   const handleCopy = async (signatureId: string) => {
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
      return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1).toUpperCase()}`;
    }
  }

  export const incrementLastNumber = (versionString: string): string => {
    const parts = versionString.split('.');


    if(parts.length === 1){
     const number  = parseInt(parts[0], 10);
     const incrementNumber = number + 1;
     return String(incrementNumber);
    }

    const lastPart = parts.pop(); 
      if(lastPart == undefined){
        return versionString; 
      }
    const lastNumber = parseInt(lastPart, 10);
    if (isNaN(lastNumber)) {
      return versionString; 
    }
  
    const incrementedLastNumber = lastNumber + 1;
    
    return [...parts, String(incrementedLastNumber)].join('.'); 
  
  };

  export const decreaseLastNumber = (versionString: string): string => {
    const parts = versionString.split('.');

    if(parts.length === 1){
     const number  = parseInt(parts[0], 10);
     const incrementNumber = number - 1;
     return String(incrementNumber);
    }

    const lastPart = parts.pop();
    if(lastPart == undefined){
        return versionString;
      }
    const lastNumber = parseInt(lastPart, 10);
    if (isNaN(lastNumber)) {
      return versionString;
    }

    const decrementedLastNumber = lastNumber - 1;

    return [...parts, String(decrementedLastNumber)].join('.');
  }

