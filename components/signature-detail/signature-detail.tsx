import { Typography } from "../ui/typography";
import { Container } from "../ui/container";

export const SignatureDetail = (props: any) => {
  const { signatureDetail } = props;

  return (
    <Container>
      <Typography variant="h1">Signature</Typography>
      <Typography variant="h3">{signatureDetail.id}</Typography>
    </Container>
  );
};
