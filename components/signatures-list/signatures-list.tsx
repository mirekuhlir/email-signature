"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography } from "@/components/ui/typography";
import StyledLink from "@/components/ui/styled-link";
import t from "@/app/localization/translate";
import Modal from "../ui/modal";
import { Button } from "@/components/ui/button";
import { EmailTemplateView } from "../signature-detail/content-view/signature-view";
import { signature_a } from "@/templates/signature_a";
import { createClient } from "@/utils/supabase/client";

export const SignaturesList = (props: any) => {
  const { signatures } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  return (
    <div className="w-full">
      {signatures?.map((signature: any) => (
        <div key={signature.id}>
          <div className="flex items-center justify-between w-full p-4 my-4 bg-white rounded-md shadow-md">
            <Typography variant="h3">{signature.id}</Typography>
            <StyledLink
              variant="button-blue"
              href={`/signatures/${signature.id}`}
            >
              {t("edit")}
            </StyledLink>
            <Button
              variant="red"
              onClick={async () => {
                await supabase.functions.invoke(
                  `delete-signature?signatureId=${signature.id}`,
                  {
                    method: "DELETE",
                  },
                );
              }}
            >
              {t("delete")}
            </Button>
          </div>
        </div>
      ))}
      <div className="mt-8 flex justify-end">
        <Button size="lg" onClick={() => setIsModalOpen(true)}>
          Create signature
        </Button>
      </div>
      <Modal size="fullscreen" isOpen={isModalOpen}>
        <div>
          <Typography variant="h2">Select your signature</Typography>
          <EmailTemplateView rows={signature_a} />
          <Button
            onClick={async () => {
              const { data } = await supabase.functions.invoke(
                "post-signature",
                {
                  method: "POST",
                  body: {
                    signatureContent: { rows: signature_a },
                  },
                },
              );
              router.push(`/signatures/${data.signatureId}`);
            }}
          >
            Select
          </Button>
        </div>
      </Modal>
    </div>
  );
};
