import { Typography } from "../ui/typography";
import StyledLink from "../ui/styled-link";

export const SignaturesList = (props: any) => {
  const { signatures } = props;

  return (
    <div className="flex-grow w-full pt-16">
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
              Edit
            </StyledLink>
          </div>
        </div>
      ))}
    </div>
  );
};
