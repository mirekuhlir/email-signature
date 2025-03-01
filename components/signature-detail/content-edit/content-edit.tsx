/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback, useState, useEffect } from "react";
import { get, set, cloneDeep } from "lodash";
import { useSignatureStore } from "@/components/signature-detail/store/content-edit-add-store";
import { ContentType } from "@/const/content";
import { Button } from "@/components/ui/button";
import { useContentEditStore } from "../store/content-edit-add-path-store";
import { RichTextEditor } from "@/components/ui/rich-text-editor/rich-text-editor";
import { EmailEditContent } from "./email-edit-content";
import { createClient } from "@/utils/supabase/client";
import { base64ToFile } from "@/utils/base64ToFile";
import { ImageEditContent } from "./image-edit-content";
import Modal from "@/components/ui/modal";
import { Typography } from "@/components/ui/typography";

const SavingInfo = () => {
  return (
    <div className="flex  w-full pb-6 pt-6 justify-center">
      <Typography variant="large">Saving... Please wait</Typography>
    </div>
  );
};

export const ContentEdit = (props: any) => {
  const { contentPathToEdit, signatureId } = props;

  const [iniContent, setIniContent] = useState<any>(null);
  const [isSavingSignature, setIsSavingSignature] = useState(false);

  const supabase = createClient();
  const { rows, setContent, removeRow } = useSignatureStore();

  const { setContentEdit, contentEdit } = useContentEditStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const path = `${contentPathToEdit}.content`;
  const content = get(rows, path);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteRow = useCallback(async () => {
    setIsDeleting(true);

    const saveData = async (rows: any) => {
      await supabase.functions.invoke("patch-signature", {
        method: "PATCH",
        body: {
          signatureId,
          signatureContent: { rows },
        },
      });

      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    };

    removeRow(contentPathToEdit, saveData);
  }, [contentPathToEdit, removeRow, signatureId, supabase.functions]);

  useEffect(() => {
    if (!iniContent) {
      setIniContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // TODO - samostatná funkce
  const saveSignature = useCallback(async () => {
    if (
      content.type == ContentType.IMAGE &&
      !content.components[0].cropImagePreview
    ) {
      return;
    }

    setIsSavingSignature(true);

    if (
      content.type == ContentType.IMAGE &&
      content.components[0].cropImagePreview
    ) {
      const cropImagePreviewBase64 = content.components[0].cropImagePreview;

      const componentId = content.components[0].id;

      const time = new Date().getTime();
      const imagePreviewFile = base64ToFile(
        cropImagePreviewBase64,
        `${time}-${componentId}.png`,
      );

      const formData = new FormData();
      formData.append("imagePreviewFile", imagePreviewFile);
      formData.append("signatureId", signatureId);

      if (!content.components[0].originalSrc) {
        const originalImageFile = content.components[0].originalImageFile;
        formData.append("originalImageFile", originalImageFile);
      }

      const { data: imageData } = await supabase.functions.invoke(
        "post-image",
        {
          method: "POST",
          body: formData,
        },
      );

      if (imageData?.imagePreviewPublicUrl) {
        const deepCopyRows = cloneDeep(rows);

        // TODO - zkusit nastavit udefined místo prádzného stringu

        // remove all unnecessary data because we wont to save them into database

        const pathToImageSrc = `${contentPathToEdit}.content.components[0].src`;
        set(deepCopyRows, pathToImageSrc, imageData.imagePreviewPublicUrl);
        setContent(pathToImageSrc, imageData.imagePreviewPublicUrl);

        const pathOriginalImagePreview = `${contentPathToEdit}.content.components[0].originalImagePreview`;
        set(deepCopyRows, pathOriginalImagePreview, "");
        setContent(pathOriginalImagePreview, "");

        const pathToCropImagePreview = `${contentPathToEdit}.content.components[0].cropImagePreview`;
        set(deepCopyRows, pathToCropImagePreview, "");
        setContent(pathToCropImagePreview, "");

        if (imageData?.originalImagePublicUrl) {
          const pathToImageOriginalSrc = `${contentPathToEdit}.content.components[0].originalSrc`;

          set(
            deepCopyRows,
            pathToImageOriginalSrc,
            imageData.originalImagePublicUrl,
          );
          setContent(pathToImageOriginalSrc, imageData.originalImagePublicUrl);

          const pathToOriginalImageFile = `${contentPathToEdit}.content.components[0].originalImageFile`;
          set(deepCopyRows, pathToOriginalImageFile, "");
        }

        await supabase.functions.invoke("patch-signature", {
          method: "PATCH",
          body: {
            signatureId,
            signatureContent: { rows: deepCopyRows },
          },
        });

        setContentEdit({
          editPath: null,
        });
      }

      return;
    }

    await supabase.functions.invoke("patch-signature", {
      method: "PATCH",
      body: {
        signatureId,
        signatureContent: { rows },
      },
    });

    setContentEdit({
      editPath: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    content.components,
    content.type,
    contentPathToEdit,
    rows,
    setContent,
    setContentEdit,
    signatureId,
  ]);

  return (
    <div key={path}>
      <div ref={wrapperRef}>
        {!isSavingSignature && (
          <div className="pb-8">{getContentType(content, path)}</div>
        )}
      </div>

      {isSavingSignature && <SavingInfo />}

      {!isSavingSignature && !contentEdit.subEdit && (
        <>
          {content.components[0].cropImagePreview && (
            <>
              <div>
                <Button
                  variant="red"
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
              <hr className="border-t border-gray-200 my-4" />
            </>
          )}

          <Modal size="medium" isOpen={isDeleteModalOpen}>
            {isDeleting && <SavingInfo />}

            {!isDeleting && (
              <div className="p-2">
                <Typography variant="h3">Delete content</Typography>
                <Typography variant="body">
                  Are you sure you want to delete this content?
                </Typography>
                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    loading={isDeleting}
                    variant="red"
                    onClick={async () => deleteRow()}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          <div className="flex flex-row w-full pb-6 pt-6 justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setContent(path, iniContent);
                setContentEdit({
                  editPath: null,
                });
              }}
            >
              Close
            </Button>
            {/*   TODO - modál pro nepřihlášené uživatele "Ukládat mohou pouze registrovaní uživatelé" */}

            {content.components[0].cropImagePreview && (
              <Button
                variant="blue"
                size="md"
                onClick={async () => {
                  await saveSignature();
                  setContentEdit({
                    editPath: null,
                  });
                }}
              >
                Save
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const getContentType = (content: any, contentPathToEdit: any) => {
  const type: ContentType = content?.type;
  const components = content?.components;

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
