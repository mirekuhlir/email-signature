import { Typography } from "@/components/ui/typography";
import { SignatureDetail } from "@/components/signature-detail/signature-detail";
import { Header } from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { createClient } from "@/utils/supabase/server";
import { signature_a } from "@/templates/signature_a";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Signature(props: Props) {
  const { params } = props;
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO - načíst detail z BE

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header user={user} />
      <main>
        <div className="pt-24">
          <Container>
            <SignatureDetail
              signatureDetail={{
                rows: signature_a,
              }}
            />
          </Container>
        </div>
      </main>
    </div>
  );
}
