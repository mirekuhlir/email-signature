import { get } from "lodash";
import { useSignatureStore } from "@/components/signature-detail/signature-store";
import { ContentType } from "@/const/content";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { useContentEditStore } from "./content-edit-store";
import { useEffect, useRef } from "react";

export const ContentEdit = (props: any) => {
  const { contentPathToEdit } = props;
  const { rows, removeRow } = useSignatureStore();
  const { setCurrentEdit } = useContentEditStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const path = `${contentPathToEdit}.content`;
  const content = get(rows, path);

  useEffect(() => {
    wrapperRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div>
      {getContentType(content, path)}
      <div ref={wrapperRef}>
        <Button
          onClick={() => {
            setCurrentEdit({
              editPath: null,
            });
            removeRow(contentPathToEdit);
          }}
        >
          Remove
        </Button>
        <Button
          onClick={() => {
            setCurrentEdit({
              editPath: null,
            });
          }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

const getContentType = (content: any, contentPathToEdit: any) => {
  const type: ContentType = content?.type;

  switch (type) {
    case ContentType.TEXT:
      return (
        <TextEditContent
          content={content}
          contentPathToEdit={contentPathToEdit}
        />
      );
    default:
      return null;
  }
};

const TextEditContent = (props: any) => {
  const { content, contentPathToEdit } = props;
  const { setContent } = useSignatureStore();

  const onChange = (editContent: any) => {
    setContent(contentPathToEdit, editContent);
  };

  return <RichTextEditor content={content} onChange={onChange} />;
};
