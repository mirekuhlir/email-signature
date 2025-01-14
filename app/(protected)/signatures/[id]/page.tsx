import { Typography } from "@/components/ui/typography";
import { SignatureDetail } from "@/components/signature-detail/signature-detail";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Signature(props: Props) {
  const { params } = props;
  const { id } = await params;

  // TODO - načíst detail z BE

  return (
    <>
      <SignatureDetail signatureDetail={{ id }} />
    </>
  );
}
