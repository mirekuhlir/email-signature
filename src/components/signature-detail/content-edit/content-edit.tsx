/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { ContentType } from '@/src/const/content';
import { Button } from '@/src/components/ui/button';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { RichTextEditor } from '@/src/components/ui/rich-text-editor/rich-text-editor';
import { EmailEditContent } from './email-edit-content';
import { ImageEditContent } from './image-edit-content';
import Modal from '@/src/components/ui/modal';
import { Typography } from '@/src/components/ui/typography';

const SavingInfo = () => {
  return (
    <div className="flex  w-full pb-6 pt-6 justify-center">
      <Typography variant="large">Saving... Please wait</Typography>
    </div>
  );
};

export const ContentEdit = (props: any) => {
  const { contentPathToEdit, signatureId, isSignedIn, templateSlug } = props;

  const [iniContent, setIniContent] = useState<any>(null);
  const [isSavingSignature, setIsSavingSignature] = useState(false);

  const { rows, setContent, removeRow, saveSignatureContentRow } =
    useSignatureStore();

  const { setContentEdit, contentEdit } = useContentEditStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  console.warn('rows', rows);

  const path = `${contentPathToEdit}.content`;
  const content = useMemo(() => get(rows, path), [rows, path]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteRow = useCallback(async () => {
    setIsDeleteModalOpen(false);
    setIsSavingSignature(true);

    try {
      await removeRow(contentPathToEdit, signatureId, isSignedIn);
    } catch (error) {
      // TODO toast error
      console.error(error);
    } finally {
      setIsSavingSignature(false);
      setContentEdit({ editPath: null });
    }
  }, [contentPathToEdit, isSignedIn, removeRow, setContentEdit, signatureId]);

  useEffect(() => {
    if (!iniContent) {
      setIniContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const isImage = content?.type === ContentType.IMAGE;

  const canDisplaySave = isImage
    ? Boolean(
        content?.components[0]?.cropImagePreview &&
          content?.components[0]?.originalImagePreview,
      )
    : true;

  const canDisplayDeleteButton = isImage
    ? content?.components[0]?.cropImagePreview
    : true;

  const closeContent = () => {
    const closeEdit = () => {
      setContent(path, iniContent);
      setContentEdit({
        editPath: null,
      });
    };

    // image was not loaded so we can delete row
    const image = content?.components[0];
    if (
      content.type === ContentType.IMAGE &&
      !image.src &&
      !image.cropImagePreview
    ) {
      removeRow(contentPathToEdit, signatureId, isSignedIn);
    } else {
      closeEdit();
    }
  };

  return (
    <div key={path}>
      <div ref={wrapperRef}>
        {!isSavingSignature && (
          <div className="pb-8">
            {getContentType(content, path, isSignedIn)}
          </div>
        )}
      </div>

      {isSavingSignature && <SavingInfo />}

      {!isSavingSignature &&
        !contentEdit.subEdit &&
        !contentEdit.isImageLoading && (
          <>
            {canDisplayDeleteButton && (
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

            <Modal size="large" isOpen={isDeleteModalOpen}>
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
                  <Button variant="red" onClick={async () => deleteRow()}>
                    Delete
                  </Button>
                </div>
              </div>
            </Modal>

            <div className="flex flex-row w-full pb-6 pt-2 justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  closeContent();
                }}
              >
                Close
              </Button>
              {/*   TODO - modál pro nepřihlášené uživatele "Ukládat mohou pouze registrovaní uživatelé" */}

              {canDisplaySave && (
                <Button
                  variant="blue"
                  size="md"
                  onClick={async () => {
                    if (!isSignedIn) {
                      localStorage.setItem(templateSlug, JSON.stringify(rows));
                      setContentEdit({
                        editPath: null,
                      });
                    } else {
                      setIsSavingSignature(true);

                      try {
                        await saveSignatureContentRow(
                          signatureId,
                          `${contentPathToEdit}.content`,
                        );
                        setContentEdit({
                          editPath: null,
                        });
                      } catch (error) {
                        // TODO toast error
                        console.error(error);
                      } finally {
                        setIsSavingSignature(false);
                      }
                    }
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

const getContentType = (
  content: any,
  contentPathToEdit: any,
  isSignedIn: boolean,
) => {
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
          isSignedIn={isSignedIn}
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
