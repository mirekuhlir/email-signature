import { get, set } from "lodash";
import { useStore } from "@/components/signature-detail/store";
import { ContentType } from "@/const/signature-parts";
import RichTextEditor from "../ui/rich-text-editor";

export const ContentEdit = (props: any) => {
  const { contentPathToEdit } = props;
  const { rows } = useStore();

  const content = get(rows, `${contentPathToEdit}.content`);

  return <>{getContentType(content, contentPathToEdit)}</>;
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
  const { setContent } = useStore();

  const onChange = (editContent: any) => {
    setContent(`${contentPathToEdit}.content`, editContent);
  };

  return <RichTextEditor content={content} onChange={onChange} />;
};
