"use client";
import { useState, useEffect } from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import t from "@/app/localization/translate";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSignatureStore } from "./content-signature-store";
import { handleCopy } from "../content-view/utils";
import { EmailTemplateView } from "../content-view/email-template-view";
import { EmailTemplateEdit } from "../content-edit/email-template-edit";

export const SignatureDetail = (props: any) => {
  const { signatureDetail } = props;

  const [isDarkMode, setIsDarkMode] = useState(false);

  const { rows, initRows } = useSignatureStore();

  useEffect(() => {
    initRows(signatureDetail.rows);
  }, []);

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
    <>
      {/* TODO */}
      {/*    <Typography variant="h1">Signature</Typography>
      <Typography variant="h3">{signatureDetail.id}</Typography> */}

      <Button onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? "Set light Mode" : "Set dark Mode"}
      </Button>

      <Typography variant="h3">{t("signatureEdit")}</Typography>

      <div className="flex justify-center">
        <div>
          <div id="signature5" className="table mx-auto">
            <EmailTemplateView rows={rows} />
          </div>
          <div>
            <Button
              onClick={() => {
                handleCopy("signature5");
              }}
            >
              Copy Signature
            </Button>
          </div>

          <div className="h-20" />
          <div>
            <EmailTemplateEdit rows={rows} />
          </div>
        </div>
      </div>
    </>
  );
};
