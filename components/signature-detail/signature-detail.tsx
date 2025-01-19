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

export interface StoreState {
  rows: any[];
  setContent: (id: string, content: string) => void;
  setStyle: (id: string, style: Partial<any>) => void;
  addItem: (id: string, item: any) => void;
  removeItem: (id: any) => void;
}

// barvy - rgba nebo hex?

const useStore = create<StoreState>((set) => ({
  rows: [
    {
      path: "0",
      style: { backgroundColor: "red" },
      columns: [
        {
          path: "0.0",
          content: { text: "A" },
          style: { paddingRight: "10px" },
        },
        {
          path: "0.1",
          style: {},
          rows: [
            {
              path: "0.1.0",
              style: {},
              columns: [
                {
                  content: { text: "A" },
                  style: { backgroundColor: "orange" },
                },
              ],
            },
            {
              path: "0.1.1",
              style: {},
              columns: [
                {
                  content: { text: "B" },
                  style: { backgroundColor: "orange" },
                },
              ],
            },
            {
              path: "0.1.2",
              style: { background: "green", color: "white" },
              columns: [
                {
                  content: { text: "C" },
                  style: { backgroundColor: "orange" },
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  addItem: (path: string, item: any) => set((state) => {}),
  setContent: (path: string, content: any) => set((state) => {}),
  setStyle: (path: string, style: any) => set((state) => {}),
  removeItem: (path: string) => set((state) => {}),
  addRow: (path: string) => set((state) => {}),
  removeRow: (path: string) => set((state) => {}),
  addColumn: (path: string) => set((state) => {}),
  removeColumn: (path: string) => set((state) => {}),
}));
export const SignatureDetail = (props: any) => {
  const { signatureDetail } = props;

  const { rows } = useStore();

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

  // sekce jasně pojmenované náhled podpisu
  // editace podpoisu

  const MyEmailTemplate = () => {
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

  return (
    <Container>
      <Typography variant="h1">Signature</Typography>
      <Typography variant="h3">{signatureDetail.id}</Typography>

      <Button onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? "Set light Mode" : "Set dark Mode"}
      </Button>
      <>
        <Button onClick={() => handleCopy("signature4")}>Copy Signature</Button>

        <Typography variant="h3">{t("signatureEdit")}</Typography>
        <div>
          <div>
            {Array.from(["1", "2"]).map((key) => (
              <div key={key}>
                <TextInput
                  label="Name"
                  name={key}
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
              </div>
            ))}
          </div>
        </div>

        <div
          id="signature5"
          style={{
            display: "table",
          }}
        >
          <MyEmailTemplate />
        </div>

        <Button
          onClick={() => {
            handleCopy("signature5");
          }}
        >
          Copy Signature
        </Button>
      </>
    </Container>
  );
};
