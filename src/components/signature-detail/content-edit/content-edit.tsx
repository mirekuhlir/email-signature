/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { ContentType, TEMP_SIGNATURE } from '@/src/const/content';
import { Button } from '@/src/components/ui/button';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { EmailEditContent } from './email-edit-content';
import { PhoneEditContent } from './phone-edit-content';
import { ImageEditContent } from './image-edit-content';
import { WebsiteEditContent } from './website-edit-content';
import { CustomValueEditContent } from './custom-value-edit-content';
import Modal from '@/src/components/ui/modal';
import { Typography } from '@/src/components/ui/typography';
import Slider from '@/src/components/ui/slider';
import { CollapsibleSection } from '@/src/components/ui/collapsible-section';
import { TextEditContent } from './text-edit-content';
import { getTemplateBySlug } from '@/src/templates';
import { EditColor } from '@/src/components/ui/edit-color';
import { Hr } from '../../ui/hr';
import { useToast } from '@/src/components/ui/toast';
import { Loading } from '../../ui/loading';
import PreviewActionPanel from '../preview-action-panel';

export const LoadingInfo = ({
  text = 'Saving. Please wait...',
  size = 'lg',
}: {
  text?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  return (
    <div className="flex  w-full pb-6 pt-6 justify-center">
      <div className="flex flex-col items-center">
        <div className="mb-2">
          <Loading size={size} />
        </div>
        <div className="mt-2">
          <Typography className="text-gray-600" variant="body">
            {text}
          </Typography>
        </div>
      </div>
    </div>
  );
};

const getContentTypeName = (type: ContentType): string => {
  switch (type) {
    case ContentType.TEXT:
      return 'text';
    case ContentType.IMAGE:
      return 'image';
    case ContentType.EMAIL:
      return 'email';
    case ContentType.PHONE:
      return 'phone';
    case ContentType.WEBSITE:
      return 'website';
    case ContentType.CUSTOM_VALUE:
      return 'custom element';
    default:
      return 'element';
  }
};

export const ContentEdit = (props: any) => {
  const { contentPathToEdit, signatureId, isSignedIn, templateSlug } = props;
  const { toast } = useToast();

  const [iniContent, setIniContent] = useState<any>(null);
  const [isSavingSignature, setIsSavingSignature] = useState(false);

  const { rows, setContent, deleteRow, saveSignatureContentRow, colors } =
    useSignatureStore();

  const { setContentEdit, contentEdit } = useContentEditStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [paddingTop, setPaddingTop] = useState('0');
  const [paddingRight, setPaddingRight] = useState('0');
  const [paddingBottom, setPaddingBottom] = useState('0');
  const [paddingLeft, setPaddingLeft] = useState('0');
  const [borderRadius, setBorderRadius] = useState('0');

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

    if (content?.components[0].borderRadius) {
      setBorderRadius(content.components[0].borderRadius);
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

  const updateBorderRadius = () => {
    const stylePath = `${path}.components[0]`;
    const currentStyle = content?.components[0] || {};

    setContent(stylePath, {
      ...currentStyle,
      borderRadius: borderRadius,
    });
  };

  useEffect(() => {
    if (paddingTop && paddingRight && paddingBottom && paddingLeft) {
      updatePadding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paddingTop, paddingRight, paddingBottom, paddingLeft]);

  useEffect(() => {
    updateBorderRadius();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borderRadius]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteRow = useCallback(async () => {
    setIsDeleteModalOpen(false);
    setIsSavingSignature(true);

    try {
      await deleteRow(contentPathToEdit, signatureId, isSignedIn);
    } catch (error) {
      toast({
        description: 'Failed to delete row. Please try again.',
        variant: 'error',
        duration: 5000,
      });
      console.error(error);
    } finally {
      setIsSavingSignature(false);
      setContentEdit({ editPath: null });
    }
  }, [
    contentPathToEdit,
    isSignedIn,
    deleteRow,
    setContentEdit,
    signatureId,
    toast,
  ]);

  useEffect(() => {
    if (!iniContent) {
      setIniContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const isImage = content?.type === ContentType.IMAGE;

  const canDisplayDeleteButton = isImage
    ? content?.components[0]?.cropImagePreview
    : true;

  const isVisibleOnlyClose =
    isImage &&
    !content?.components[0]?.cropImagePreview &&
    !content?.components[0]?.originalSrc &&
    !content?.components[0]?.imageSettings;

  const closeContent = () => {
    // image was not loaded from client so we can delete row
    const image = content?.components[0];
    if (
      content.type === ContentType.IMAGE &&
      !image.src &&
      !image.cropImagePreview
    ) {
      deleteRow(contentPathToEdit, signatureId, isSignedIn);
      setContentEdit({ editPath: null });
    } else {
      setContent(path, iniContent);
      setContentEdit({
        editPath: null,
      });
    }
  };

  const handleSave = async () => {
    if (!isSignedIn) {
      localStorage.setItem(
        TEMP_SIGNATURE,
        JSON.stringify({
          rows,
          colors,
          createdAt: new Date().toISOString(),
          info: getTemplateBySlug(templateSlug)?.info,
        }),
      );
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
        toast({
          title: 'Error',
          description: 'Failed to save content. Please try again.',
          variant: 'error',
          duration: 5000,
        });
        console.error(error);
      } finally {
        setIsSavingSignature(false);
      }
    }
  };

  return (
    <div key={path}>
      <div className="pb-24">
        <div ref={wrapperRef}>
          {!isSavingSignature && (
            <>
              {getContentType(content, path, isSignedIn)}

              {content.type !== ContentType.IMAGE && (
                <div className="mt-0">
                  <CollapsibleSection>
                    <div className="px-0">
                      <div className="mb-4">
                        <EditColor
                          initColor={content?.components[0]?.backgroundColor}
                          label="Background color"
                          isResetToTransparent
                          onChange={(color) => {
                            const stylePath = `${path}.components[0]`;
                            const currentStyle = content?.components[0] || {};
                            setContent(stylePath, {
                              ...currentStyle,
                              backgroundColor: color,
                            });
                          }}
                        />
                      </div>
                      <Hr className="mt-4 mb-4" />
                      <div className="mb-4">
                        <Typography variant="labelBase" className="mb-2">
                          Border radius : {borderRadius}
                        </Typography>
                        <Slider
                          min={0}
                          max={20}
                          value={Number(borderRadius.replace('px', ''))}
                          onChange={(value: number) => {
                            setBorderRadius(`${value}px`);
                          }}
                        />
                      </div>
                      <Hr className="mt-4 mb-4" />
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <Typography variant="labelBase" className="mb-2">
                            Top inner space: {paddingTop}px
                          </Typography>
                          <Slider
                            min={0}
                            max={50}
                            value={Number(paddingTop)}
                            onChange={(value: number) => {
                              setPaddingTop(value.toString());
                            }}
                          />
                        </div>

                        <div>
                          <Typography variant="labelBase" className="mb-2">
                            Right inner space: {paddingRight}px
                          </Typography>
                          <Slider
                            min={0}
                            max={50}
                            value={Number(paddingRight)}
                            onChange={(value: number) => {
                              setPaddingRight(value.toString());
                            }}
                          />
                        </div>

                        <div>
                          <Typography variant="labelBase" className="mb-2">
                            Bottom inner space: {paddingBottom}px
                          </Typography>
                          <Slider
                            min={0}
                            max={50}
                            value={Number(paddingBottom)}
                            onChange={(value: number) => {
                              setPaddingBottom(value.toString());
                            }}
                          />
                        </div>

                        <div>
                          <Typography variant="labelBase" className="mb-2">
                            Left inner space: {paddingLeft}px
                          </Typography>
                          <Slider
                            min={0}
                            max={50}
                            value={Number(paddingLeft)}
                            onChange={(value: number) => {
                              setPaddingLeft(value.toString());
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CollapsibleSection>
                </div>
              )}
            </>
          )}
        </div>

        {isSavingSignature && <LoadingInfo />}

        {!isSavingSignature &&
          !contentEdit.subEdit &&
          !contentEdit.isImageLoading && (
            <>
              {canDisplayDeleteButton && (
                <>
                  <Hr className="mb-4 mt-4" />

                  <Typography variant="labelBase" className="mb-2">
                    Delete {getContentTypeName(content.type)} from signature
                  </Typography>

                  <Button
                    variant="red"
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </>
              )}

              <Modal size="small" isOpen={isDeleteModalOpen}>
                <div className="p-2">
                  <Typography variant="h3">
                    Delete {getContentTypeName(content.type)}
                  </Typography>
                  <Typography variant="body">
                    Are you sure you want to delete this{' '}
                    {getContentTypeName(content.type)}?
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
                      variant="red"
                      onClick={async () => handleDeleteRow()}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Modal>
            </>
          )}
        <PreviewActionPanel
          visible={!isSavingSignature}
          onClose={closeContent}
          onSave={handleSave}
          isVisibleOnlyPreview={Boolean(contentEdit.subEdit)}
          isVisibleOnlyClose={isVisibleOnlyClose}
        />
      </div>
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
