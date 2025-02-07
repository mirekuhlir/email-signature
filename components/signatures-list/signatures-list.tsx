import { Typography } from "@/components/ui/typography";
import StyledLink from "@/components/ui/styled-link";
import t from "@/app/localization/translate";

export const SignaturesList = (props: any) => {
  const { signatures } = props;

  return (
    <div className="w-full">
      <Typography variant="h1">Signatures</Typography>

      {signatures?.map((signature: any) => (
        <div key={signature.id}>
          <div
            key={props.id}
            className="flex items-center justify-between w-full p-4 my-4 bg-white rounded-md shadow-md"
          >
            <Typography variant="h3">{signature.id}</Typography>
            <StyledLink
              variant="button-blue"
              href={`/signatures/${signature.id}`}
            >
              {t("edit")}
            </StyledLink>
          </div>
        </div>
      ))}
    </div>
  );
};
