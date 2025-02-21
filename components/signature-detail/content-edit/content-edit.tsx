import { useRef, useCallback } from "react";
import { get } from "lodash";
import { useSignatureStore } from "@/components/signature-detail/store/content-edit-add-store";
import { ContentType } from "@/const/content";
import { Button } from "@/components/ui/button";
import { useContentEditStore } from "../store/content-edit-add-path-store";
import { Img } from "@/components/ui/img";
import ImageUploaderCrop from "@/components/ui/image-uploader-crop/image-uploader-crop";
import { RichTextEditor } from "@/components/ui/rich-text-editor/rich-text-editor";
import { EmailEditContent } from "./email-edit-content";
import { createClient } from "@/utils/supabase/client";

export const ContentEdit = (props: any) => {
  const { contentPathToEdit, signatureId } = props;

  const supabase = createClient();
  const { rows } = useSignatureStore();
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
      {/*     TODO - save to BE on close */}
      <div className="flex w-full justify-end pb-6 pt-6">
        <Button
          variant="outline"
          onClick={async () => {
            setContentEdit({
              editPath: null,
            });

            await supabase.functions.invoke("patch-signature", {
              method: "PATCH",
              body: {
                signatureId,
                signatureContent: { rows },
              },
            });

            //
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
