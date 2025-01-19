import { SignaturePart } from "@/const/signature-parts";
import TextInput from "@/components/ui/text-input";

const TextInputSection = (props: any) => {
  const { path, text } = props;

  return (
    <>
      {/*   <TextInput
        name={path}
        register={register}
        validation={{
          required: "This field is required",
          minLength: {
            value: 2,
            message: "Minimum 2 characters",
          },
          maxLength: {
            value: 4,
            message: "Maximum 4 characters",
          },
        }}
        errors={errors}
        placeholder="Name"
      /> */}
      INPUT
    </>
  );
};

export const getSignaturePart = (path: string, column: any) => {
  if (column.type === SignaturePart.TEXT) {
    return <TextInputSection path={path} text={column.content?.text} />;
  }
  return null;
};
