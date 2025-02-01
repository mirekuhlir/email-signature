"use client";
import { useState, useEffect } from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import t from "@/app/localization/translate";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSignatureStore } from "./store/content-edit-add-store";
import { handleCopy } from "./content-view/utils";
import { EmailTemplateView } from "./content-view/signature-view";
import { EmailTemplateEdit } from "./signature-edit-add";
export const SignatureDetail = (props: any) => {
  const { signatureDetail } = props;

  const [isDarkMode, setIsDarkMode] = useState(false);

  const { rows, initRows } = useSignatureStore();

  useEffect(() => {
    initRows(signatureDetail.rows);
  }, []);

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
      <Button onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? "Set light Mode" : "Set dark Mode"}
      </Button>

      <Typography variant="h3">{t("signatureEdit")}</Typography>
      <div className="flex flex-col items-center">
        <div id="signature5">
          <EmailTemplateView rows={rows} />
        </div>
        <div className="mt-5">
          <Button
            onClick={() => {
              handleCopy("signature5");
            }}
          >
            Copy Signature
          </Button>
        </div>
      </div>
      <div className="h-20" />
      <div>
        <EmailTemplateEdit rows={rows} />
      </div>
    </>
  );
};
