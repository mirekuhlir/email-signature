import { useRef, useCallback } from "react";
import { get } from "lodash";
import { useSignatureStore } from "@/components/signature-detail/store/content-edit-add-store";
import { ContentType } from "@/const/content";
import RichTextEditor, {
  LayoutType,
} from "@/components/ui/rich-text-editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { useContentEditStore } from "../store/content-edit-add-path-store";
import useValidate from "@/hooks/useValidate";
import { validateEmail } from "@/hooks/validations";
import { Img } from "@/components/ui/img";
import ImageUploaderCrop from "@/components/ui/image-uploader-crop/image-uploader-crop";

export const ContentEdit = (props: any) => {
  const { contentPathToEdit } = props;
  const { rows, removeRow } = useSignatureStore();
  const { setContentEdit } = useContentEditStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const path = `${contentPathToEdit}.content`;
  const content = get(rows, path);

  return (
    <div key={path}>
      <div ref={wrapperRef}>{getContentType(content, path)}</div>
      {/*        TODO  */}
      {/*       <Button
        onClick={() => {
          setContentEdit({
            editPath: null,
          });
          removeRow(contentPathToEdit);
        }}
        variant="red"
      >
        Remove
      </Button> */}
      <div className="flex w-full justify-end pb-6 pt-6">
        <Button
          variant="outline"
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

    case ContentType.IMAGE:
      return (
        <ImageEditContent
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

const ImageEditContent = (props: any) => {
  const { components, contentPathToEdit } = props;
  const { setContent } = useSignatureStore();
  const imageComponent = components[0];

  const handleCropImagePreview = useCallback(
    (croppedImage: string) => {
      setContent(
        `${contentPathToEdit}.components[0].cropImagePreview`,
        croppedImage,
      );
    },
    [contentPathToEdit, setContent],
  );

  const handleOriginalImagePreview = useCallback(
    (originalImage: string) => {
      setContent(
        `${contentPathToEdit}.components[0].originalImagePreview`,
        originalImage,
      );
    },
    [contentPathToEdit, setContent],
  );

  const handleCropImageFile = useCallback(
    (file: File) => {
      setContent(`${contentPathToEdit}.components[0].cropImageFile`, file);
    },
    [contentPathToEdit, setContent],
  );

  const handleOriginalImageFile = useCallback(
    (file: File) => {
      setContent(`${contentPathToEdit}.components[0].originalImageFile`, file);
    },
    [contentPathToEdit, setContent],
  );

  const handleImageSettings = useCallback(
    (imageSettings: any) => {
      setContent(
        `${contentPathToEdit}.components[0].imageSettings`,
        imageSettings,
      );
    },
    [contentPathToEdit, setContent],
  );

  const handlePreviewWidth = useCallback(
    (width: number) => {
      setContent(`${contentPathToEdit}.components[0].previewWidth`, width);
    },
    [contentPathToEdit, setContent],
  );

  if (imageComponent.src) {
    return <Img src={imageComponent.src} />;
  }

  const onInit = useCallback(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

  return (
    <ImageUploaderCrop
      onSetCropImagePreview={handleCropImagePreview}
      onSetOriginalImagePreview={handleOriginalImagePreview}
      originalImagePreview={imageComponent.originalImagePreview}
      onSetCropImageFile={handleCropImageFile}
      onSetOriginalImageFile={handleOriginalImageFile}
      onSetImageSettings={handleImageSettings}
      imageSettings={imageComponent.imageSettings}
      imageName={imageComponent.id}
      previewWidthInit={imageComponent.previewWidth}
      onSetPreviewWidth={handlePreviewWidth}
      onInit={onInit}
    />
  );
};

// TODO - samostatný soubor

const EmailEditContent = (props: any) => {
  const { components, contentPathToEdit, contentType } = props;
  const { setContent } = useSignatureStore();
  const { validate, errors } = useValidate();

  return components
    .slice()
    .reverse()
    .map((component: any, index: number) => {
      const originalIndex = components.length - 1 - index;
      const path = `${contentPathToEdit}.components[${originalIndex}]`;

      const onChange = (editContent: any) => {
        if (component.type === ContentType.EMAIL_LINK && editContent.text) {
          validate({
            text: editContent.text,
            componentId: component.id,
            validation: validateEmail,
          });
        }

        setContent(path, editContent);
      };

      const getLabelText = useCallback(() => {
        if (component.type === ContentType.TEXT) {
          return "Prefix";
        }

        if (component.type === ContentType.EMAIL_LINK) {
          return "Email";
        }

        return "";
      }, []);

      const labeText = getLabelText();

      const getLayoutType = useCallback(() => {
        if (component.type === ContentType.TEXT) {
          return LayoutType.PREFIX;
        }

        return LayoutType.TEXT;
      }, []);

      const layoutType = getLayoutType();

      return (
        <div key={component.id} className="pt-6 border-b border-gray-300 pb-4">
          <RichTextEditor
            label={labeText}
            content={component}
            onChange={onChange}
            contentType={contentType}
            errorMessage={errors[component.id]}
            layoutType={layoutType}
          />
        </div>
      );
    });
};
