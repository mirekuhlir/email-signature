"use client";
import { useState, Fragment } from "react";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import t from "@/app/localization/translate";
import TextInput from "../ui/text-input";
import { useForm, SubmitHandler } from "react-hook-form";
import { SignaturePart } from "@/const/signature-parts";
import { useStore } from "./store";
import { handleCopy } from "./utils";
import { EmailTemplateView } from "./email-template-view";
import { getSignaturePart } from "./email-template-edit";

export const SignatureDetail = (props: any) => {
  const { signatureDetail } = props;

  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const EmailTemplateDivs = () => {
    const { rows, addRow } = useStore();

    console.warn("rows", rows);

    const renderAddRowButton = ({
      path,
      position,
    }: {
      path: string;
      position?: "start" | "end";
    }) => {
      // TODO - nějaký výčet cest
      if (path === "0.0" || path === "0.1" || path === "") {
        return (
          <Button
            onClick={() => {
              addRow(path, position);
            }}
          >
            Add row
          </Button>
        );
      }

      return null;
    };

    const renderColumn = (column: any, path: string) => {
      return (
        <div
          style={{
            ...column.style,
            display: "table-cell",
            /*             width: "fit-content", */
          }}
          id={path}
        >
          {getSignaturePart(path, column)}
          {column.rows && renderRows(column.rows)}
          {renderAddRowButton({
            path,
          })}
        </div>
      );
    };

    const renderRows = (rows: any) => {
      return rows.map((row: any, rowIndex: number) => {
        return (
          <div
            key={rowIndex}
            style={{
              ...row.style,
              /*   width: "100%", */
            }}
          >
            {row.columns.map((column: any, colIndex: number) => (
              <Fragment key={colIndex}>
                {renderColumn(column, column.path)}
              </Fragment>
            ))}
          </div>
        );
      });
    };

    return (
      <>
        <>
          {renderAddRowButton({
            path: "",
            position: "start",
          })}
        </>
        <>{renderRows(rows)}</>
        {renderAddRowButton({
          path: "",
          position: "end",
        })}
      </>
    );
  };

  return (
    <Container>
      {/*    <Typography variant="h1">Signature</Typography>
      <Typography variant="h3">{signatureDetail.id}</Typography> */}

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
            <EmailTemplateView rows={rows} />
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
