import { useSignatureStore } from "@/components/signature-detail/content-signature-store";
import { useContentEditStore } from "@/components/content-edit/content-edit-path-store";
import { Button } from "@/components/ui/button";
import { Typography } from "../ui/typography";
import { CONTENT_TYPES } from "./const";
import { ContentType } from "@/const/content";

export const ContentAdd = (props: any) => {
  const { path, onClose } = props;

  const { addRow, addRowTable } = useSignatureStore();
  const { contentEdit, setContentEdit } = useContentEditStore();

  const onAdd = (type: ContentType) => {
    if (contentEdit.addPath === "table-root" && contentEdit.position) {
      addRowTable(contentEdit.position, type);
      setContentEdit({
        editPath: contentEdit.nextEditPath,
        addPath: null,
      });
      return;
    }

    addRow(path, type);
    setContentEdit({
      editPath: contentEdit.nextEditPath,
      addPath: null,
    });
  };

  return (
    <div className="pt-6">
      {CONTENT_TYPES.map((typeItem, index) => (
        <div key={index}>
          <Typography>{typeItem.name}</Typography>
          <Button onClick={() => onAdd(typeItem.type)}>Add text</Button>
        </div>
      ))}

      <div></div>
      <div className="flex justify-end mb-6">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};
