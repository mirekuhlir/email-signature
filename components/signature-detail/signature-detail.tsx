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
import { EmailTemplateEdit } from "./email-template-edit";

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
          <div className="h-20" />
          <div
            style={{
              display: "table",
            }}
          >
            <EmailTemplateEdit rows={rows} />
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
