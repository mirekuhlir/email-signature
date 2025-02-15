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
import { useContentEditStore } from "./store/content-edit-add-path-store";

export const SignatureDetail = (props: any) => {
  const { signatureDetail } = props;

  const { rows, initRows } = useSignatureStore();
  const { contentEdit } = useContentEditStore();
  const [isEdit, setIsEdit] = useState(false);

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
      <div className="flex flex-col items-center">
        {(!isEdit || contentEdit.editPath) && (
          <>
            <div id="signature5">
              <EmailTemplateView rows={rows} />
            </div>
            {!contentEdit.editPath && (
              <>
                <Button size="lg" onClick={() => setIsEdit(true)}>
                  Edit
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    handleCopy("signature5");
                  }}
                >
                  Copy Signature
                </Button>
              </>
            )}
            <div className="mt-5"></div>
          </>
        )}
      </div>

      {isEdit && (
        <div>
          <EmailTemplateEdit rows={rows} />
          {!contentEdit.editPath && !contentEdit.addPath && (
            <div className="flex justify-center mt-5">
              {/*   TODO - view se ukáže až po save */}
              <Button size="lg" onClick={() => setIsEdit(false)}>
                View
              </Button>
              {/*  TODO - nějak rozeznat, že došlo k uložení */}
              <Button size="lg" onClick={() => {}} className="ml-5">
                Save
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
