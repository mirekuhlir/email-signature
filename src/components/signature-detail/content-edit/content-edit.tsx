/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { ContentType } from '@/src/const/content';
import { Button } from '@/src/components/ui/button';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { RichTextEditor } from '@/src/components/ui/rich-text-editor/rich-text-editor';
import { EmailEditContent } from './email-edit-content';
import { PhoneEditContent } from './phone-edit-content';
import { ImageEditContent } from './image-edit-content';
import { WebsiteEditContent } from './website-edit-content';
import { CustomValueEditContent } from './custom-value-edit-content';
import Modal from '@/src/components/ui/modal';
import { Typography } from '@/src/components/ui/typography';
import Slider from '@/src/components/ui/slider';

export const SavingInfo = () => {
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

  const [paddingTop, setPaddingTop] = useState('0');
  const [paddingRight, setPaddingRight] = useState('0');
  const [paddingBottom, setPaddingBottom] = useState('0');
  const [paddingLeft, setPaddingLeft] = useState('0');

  const path = `${contentPathToEdit}.content`;
  const content = useMemo(() => get(rows, path), [rows, path]);

  useEffect(() => {
    if (content?.components[0].padding) {
      const paddingValues = content.components[0].padding
        .split(' ')
        .map((val: string) => val.replace('px', ''));

      setPaddingTop(paddingValues[0]);
      setPaddingRight(paddingValues[1]);
      setPaddingBottom(paddingValues[2]);
      setPaddingLeft(paddingValues[3]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePadding = () => {
    const paddingValue = `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`;
    const stylePath = `${path}.components[0]`;
    const currentStyle = content?.components[0] || {};

    if (currentStyle.padding !== paddingValue) {
      setContent(stylePath, {
        ...currentStyle,
        padding: paddingValue,
      });
    }
  };

  useEffect(() => {
    if (paddingTop && paddingRight && paddingBottom && paddingLeft) {
      updatePadding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paddingTop, paddingRight, paddingBottom, paddingLeft]);

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
    ? Boolean(content?.components[0]?.cropImagePreview)
    : true;

  const canDisplayDeleteButton = isImage
    ? content?.components[0]?.cropImagePreview
    : true;

  const closeContent = () => {
    const closeEdit = () => {
      console.warn('iniContent', iniContent);
      setContent(path, iniContent);
      setContentEdit({
        editPath: null,
      });
    };

    // image was not loaded from client so we can delete row
    const image = content?.components[0];
    if (
      content.type === ContentType.IMAGE &&
      !image.src &&
      !image.cropImagePreview
    ) {
      removeRow(contentPathToEdit, signatureId, isSignedIn);
      setContentEdit({ editPath: null });
    } else {
      closeEdit();
    }
  };

  return (
    <div key={path}>
      <div ref={wrapperRef}>
        {!isSavingSignature && (
          <>
            <div className="pb-8">
              {getContentType(content, path, isSignedIn)}
            </div>

            <div className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Typography variant="labelBase" className="mb-2">
                    Top padding : {paddingTop}px
                  </Typography>
                  <Slider
                    min={0}
                    max={50}
                    step={1}
                    value={Number(paddingTop)}
                    onChange={(value: number) => {
                      setPaddingTop(value.toString());
                    }}
                  />
                </div>

                <div>
                  <Typography variant="labelBase" className="mb-2">
                    Right padding : {paddingRight}px
                  </Typography>
                  <Slider
                    min={0}
                    max={50}
                    step={1}
                    value={Number(paddingRight)}
                    onChange={(value: number) => {
                      setPaddingRight(value.toString());
                    }}
                  />
                </div>

                <div>
                  <Typography variant="labelBase" className="mb-2">
                    Bottom padding : {paddingBottom}px
                  </Typography>
                  <Slider
                    min={0}
                    max={50}
                    step={1}
                    value={Number(paddingBottom)}
                    onChange={(value: number) => {
                      setPaddingBottom(value.toString());
                    }}
                  />
                </div>

                <div>
                  <Typography variant="labelBase" className="mb-2">
                    Left padding : {paddingLeft}px
                  </Typography>
                  <Slider
                    min={0}
                    max={50}
                    step={1}
                    value={Number(paddingLeft)}
                    onChange={(value: number) => {
                      setPaddingLeft(value.toString());
                    }}
                  />
                </div>
              </div>
            </div>
          </>
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

    case ContentType.PHONE:
      return (
        <PhoneEditContent
          contentType={type}
          components={components}
          contentPathToEdit={contentPathToEdit}
        />
      );

    case ContentType.WEBSITE:
      return (
        <WebsiteEditContent
          contentType={type}
          components={components}
          contentPathToEdit={contentPathToEdit}
        />
      );

    case ContentType.CUSTOM_VALUE:
      return (
        <CustomValueEditContent
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
