import { useSignatureStore } from "@/components/signature-detail/signature-store";
import { useContentEditStore } from "@/components/content-edit/content-edit-store";
import { Button } from "@/components/ui/button";
import { Typography } from "../ui/typography";
import { CONTENT_TYPES } from "./const";
import { ContentType } from "@/const/content";

export const ContentAdd = (props: any) => {
  const { path, onClose } = props;

  const { addRow, addRowTable } = useSignatureStore();
  const { setContentEdit, currentEdit } = useContentEditStore();

  const onClick = (type: ContentType) => {
    if (currentEdit.addPath === "table-root" && currentEdit.position) {
      addRowTable(currentEdit.position, type);
      setContentEdit({
        editPath: currentEdit.nextEditPath,
        addPath: null,
      });
      return;
    }

    addRow(path, type);
    setContentEdit({
      editPath: currentEdit.nextEditPath,
      addPath: null,
    });
  };

  return (
    <div className="pt-6">
      {CONTENT_TYPES.map((typeItem) => (
        <div key={typeItem.id}>
          <Typography>{typeItem.name}</Typography>
          <Button
            onClick={() => {
              onClick(typeItem.type);
            }}
          >
            Add text
          </Button>
        </div>
      ))}

      <div></div>
      <div className="flex justify-end mb-6">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};
