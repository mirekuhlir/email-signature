import { useSignatureStore } from "@/components/signature-detail/signature-store";
import { Button } from "@/components/ui/button";
import { Typography } from "../ui/typography";
import { CONTENT_TYPES } from "./const";

export const ContentAdd = (props: any) => {
  const { path, onClose } = props;

  const { addRow } = useSignatureStore();

  return (
    <div className="pt-6">
      {CONTENT_TYPES.map((typeItem) => (
        <div key={typeItem.id}>
          <Typography>{typeItem.name}</Typography>
          <Button onClick={() => addRow(path, typeItem.type)}>Add text</Button>
        </div>
      ))}

      <div></div>
      <div>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};
