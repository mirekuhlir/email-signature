import { get } from "lodash";
import { useSignatureStore } from "@/components/signature-detail/store/content-edit-add-store";
import { ContentType } from "@/const/content";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { useContentEditStore } from "../store/content-edit-add-path-store";
import { useEffect, useRef, useState } from "react";
import t from "@/app/localization/translate";

export const ContentEdit = (props: any) => {
  const { contentPathToEdit } = props;
  const { rows, removeRow } = useSignatureStore();
  const { setContentEdit } = useContentEditStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const path = `${contentPathToEdit}.content`;
  const content = get(rows, path);

  useEffect(() => {
    wrapperRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div>
      {getContentType(content, path)}
      <Button
        onClick={() => {
          setContentEdit({
            editPath: null,
          });
          removeRow(contentPathToEdit);
        }}
        variant="red"
      >
        Remove
      </Button>
      <div className="flex justify-end mb-6" ref={wrapperRef}>
        <Button
          onClick={() => {
            setContentEdit({
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

// TODO - refactor, nějak ty komponenty sjednotit

const getContentType = (content: any, contentPathToEdit: any) => {
  const type: ContentType = content?.type;

  const { components } = content;

  switch (type) {
    case ContentType.TEXT:
      return (
        <TextEditContent
          contentType={type}
          components={components}
          contentPathToEdit={contentPathToEdit}
        />
      );
    case ContentType.EMAIL:
      return (
        <EmailEditContent
          contentType={type}
          components={components}
          contentPathToEdit={contentPathToEdit}
        />
      );
    default:
      return null;
  }
};

const TextEditContent = (props: any) => {
  const { components, contentPathToEdit, contentType } = props;
  const { setContent } = useSignatureStore();

  return components.map((component: any, index: number) => {
    const path = `${contentPathToEdit}.components[${index}]`;

    const onChange = (editContent: any) => {
      setContent(path, editContent);
    };

    return (
      <div key={index}>
        <RichTextEditor
          content={component}
          onChange={onChange}
          contentType={contentType}
        />
      </div>
    );
  });
};

const EmailEditContent = (props: any) => {
  const { components, contentPathToEdit, contentType } = props;
  const { setContent } = useSignatureStore();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validate = (text: string, componentId: string) => {
    if (!validateEmail(text)) {
      setErrors((prev) => ({
        ...prev,
        [componentId]: t("emailWrongFormat"),
      }));
      return false;
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[componentId];
      return newErrors;
    });
    return true;
  };

  return components.map((component: any, index: number) => {
    const path = `${contentPathToEdit}.components[${index}]`;

    const onChange = (editContent: any) => {
      if (component.type === ContentType.EMAIL_LINK && editContent.text) {
        validate(editContent.text, component.id);
      }

      setContent(path, editContent);
    };

    return (
      <div key={component.id}>
        <RichTextEditor
          content={component}
          onChange={onChange}
          contentType={contentType}
        />
        {errors[component.id] && (
          <p className="text-red-500 mt-2 text-sm">{errors[component.id]}</p>
        )}
      </div>
    );
  });
};
