"use client";
import { useState, Fragment } from "react";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { create } from "zustand";
import t from "@/app/localization/translate";
import TextInput from "../ui/text-input";
import { useForm, SubmitHandler } from "react-hook-form";
import { Column, Row, Section } from "@react-email/components";
import { signature_a } from "@/templates/signature_a";
import { SignaturePart } from "@/const/signature-parts";

export interface StoreState {
  rows: any[];
  addRow: (path: string) => void;
  addColumn: (path: string) => void;
  removeColumn: (path: string) => void;
  removeRow: (path: string) => void;
  /*   addItem: (path: string) => void;
  removeItem: (path: string) => void; */
}

const traversePath = (obj: any, path: string): any => {
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

const updatePaths = (rows: any[], basePath: string = "") => {
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

// barvy - rgba nebo hex?

const useStore = create<StoreState>((set) => ({
  rows: signature_a,
  setContent: (path: string, content: any) =>
    set((state) => {
      const newRows = [...state.rows];
      const target = traversePath(newRows, path);
      const lastIndex = parseInt(path.split(".").pop() || "0");

      if (target.columns) {
        target.columns[lastIndex].content = content;
      }

      return { rows: newRows };
    }),

  setStyle: (path: string, style: any) =>
    set((state) => {
      const newRows = [...state.rows];
      const target = traversePath(newRows, path);
      const lastIndex = parseInt(path.split(".").pop() || "0");

      if (target.columns) {
        target.columns[lastIndex].style = {
          ...target.columns[lastIndex].style,
          ...style,
        };
      } else if (target.rows) {
        target.rows[lastIndex].style = {
          ...target.rows[lastIndex].style,
          ...style,
        };
      }

      return { rows: newRows };
    }),

  addRow: (path: string) =>
    set((state) => {
      const newRows = [...state.rows];
      const target = traversePath(newRows, path);
      const newRow = {
        path: "",
        style: {},
        columns: [
          {
            path: "",
            content: { text: "New" },
            style: {},
          },
        ],
      };

      if (path === "-1") {
        // Add at the beginning
        newRows.unshift(newRow);
      } else if (path === String(newRows.length)) {
        // Add at the end
        newRows.push(newRow);
      } else if (target.rows) {
        target.rows.push(newRow);
      } else if (target.columns) {
        // Adding a row inside an empty column
        const lastIndex = parseInt(path.split(".").pop() || "0");
        target.columns[lastIndex].rows = [newRow];
      }

      return { rows: updatePaths(newRows) };
    }),

  removeRow: (path: string) =>
    set((state) => {
      const newRows = [...state.rows];
      const parts = path.split(".");
      const lastIndex = parseInt(parts.pop() || "0");
      const target = traversePath(newRows, parts.join("."));

      if (target.rows) {
        target.rows.splice(lastIndex, 1);
      }

      return { rows: updatePaths(newRows) };
    }),

  addColumn: (path: string) =>
    set((state) => {
      const newRows = [...state.rows];
      const target = traversePath(newRows, path);
      const lastIndex = parseInt(path.split(".").pop() || "0");

      const newColumn = {
        path: "",
        content: { text: "New Column" },
        style: {},
      };

      if (target.columns) {
        target.columns.push(newColumn);
      } else if (target.rows) {
        target.rows[lastIndex].columns.push(newColumn);
      }

      return { rows: updatePaths(newRows) };
    }),

  removeColumn: (path: string) =>
    set((state) => {
      const newRows = [...state.rows];
      const parts = path.split(".");
      const lastIndex = parseInt(parts.pop() || "0");
      const target = traversePath(newRows, parts.join("."));

      if (target.columns && target.columns.length > 1) {
        target.columns.splice(lastIndex, 1);
      }

      return { rows: updatePaths(newRows) };
    }),
}));
export const SignatureDetail = (props: any) => {
  const { signatureDetail } = props;

  const {
    rows,
    addRow,
    addColumn,
    removeColumn,
    removeRow,
    /*     addItem,
    removeItem, */
    /*   setContent,
    setStyle, */
  } = useStore();

  console.log("rows", rows);

  const [isDarkMode, setIsDarkMode] = useState(false);

  /*   type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
  }; */

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<any>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
    alert(`Sended: ${JSON.stringify(data)}`);
  };

  const formValue = getValues();

  const handleCopy = async (signatureId: string) => {
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

  const EmailTemplateTables = () => {
    const renderColumn = (column: any, path: string) => {
      return (
        <Column style={column.style} id={path}>
          {column.content?.text}
          {column.rows && renderRows(column.rows, `${path}`)}
        </Column>
      );
    };

    const renderRows = (rows: any, basePath: string = "") => {
      return rows.map((row: any, index: number) => {
        const currentPath = basePath ? `${basePath}.${index}` : `${index}`;
        return (
          <Row key={index} style={row.style}>
            {row.columns.map((column: any, colIndex: number) => (
              <Fragment key={colIndex}>
                {renderColumn(column, `${currentPath}.${colIndex}`)}
              </Fragment>
            ))}
          </Row>
        );
      });
    };

    return <Section>{renderRows(rows)}</Section>;
  };

  const TextInputSection = (props: any) => {
    const { path, text } = props;

    return (
      <>
        <TextInput
          name={path}
          register={register}
          validation={{
            required: "This field is required",
            minLength: {
              value: 2,
              message: "Minimum 2 characters",
            },
            maxLength: {
              value: 4,
              message: "Maximum 4 characters",
            },
          }}
          errors={errors}
          placeholder="Name"
        />
      </>
    );
  };

  const getSignaturePart = (path: string, column: any) => {
    if (column.type === SignaturePart.TEXT) {
      return <TextInputSection path={path} text={column.content?.text} />;
    }
    return null;
  };

  const EmailTemplateDivs = () => {
    const { rows, addRow } = useStore();

    const renderColumn = (column: any, path: string) => {
      return (
        <div
          style={{
            ...column.style,
            display: "table-cell",
            width: "0%",
          }}
          id={path}
        >
          {getSignaturePart(path, column)}
          {column.rows && renderRows(column.rows, `${path}`)}
        </div>
      );
    };

    const renderRows = (rows: any, basePath: string = "") => {
      return rows.map((row: any, index: number) => {
        const currentPath = basePath ? `${basePath}.${index}` : `${index}`;
        return (
          <div
            key={index}
            style={{
              ...row.style,
              width: "100%",
            }}
          >
            {row.columns.map((column: any, colIndex: number) => (
              <Fragment key={colIndex}>
                {renderColumn(column, `${currentPath}.${colIndex}`)}
              </Fragment>
            ))}
          </div>
        );
      });
    };

    return (
      <div className="">
        <Button
          /*           className="absolute -top-8 left-0" */
          onClick={() => addRow("-1")}
          size="sm"
        >
          Add Row to Start
        </Button>

        <div>{renderRows(rows)}</div>

        <Button
          /*           className="absolute -bottom-8 left-0" */
          onClick={() => addRow(String(rows.length))}
          size="sm"
        >
          Add Row to End
        </Button>
      </div>
    );
  };

  return (
    <Container>
      <Typography variant="h1">Signature</Typography>
      <Typography variant="h3">{signatureDetail.id}</Typography>

      <Button onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? "Set light Mode" : "Set dark Mode"}
      </Button>

      <Typography variant="h3">{t("signatureEdit")}</Typography>

      <div className="w-full flex justify-center">
        <div>
          <div
            id="signature5"
            style={{
              display: "table",
            }}
          >
            <EmailTemplateTables />
          </div>
          <div
            style={{
              display: "table",
            }}
          >
            <EmailTemplateDivs />
          </div>
        </div>
      </div>

      <Button
        onClick={() => {
          handleCopy("signature5");
        }}
      >
        Copy Signature
      </Button>
    </Container>
  );
};
