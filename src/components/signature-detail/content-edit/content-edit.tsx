/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { ContentType, TEMP_SIGNATURE } from '@/src/const/content';
import { Button } from '@/src/components/ui/button';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { ImageEditContent } from './image-edit-content';
import Modal from '@/src/components/ui/modal';
import { Typography } from '@/src/components/ui/typography';
import Slider from '@/src/components/ui/slider';
import { CollapsibleSection } from '@/src/components/ui/collapsible-section';
import { getTemplateBySlug } from '@/src/templates';
import { EditColor } from '@/src/components/ui/edit-color';
import { Hr } from '../../ui/hr';
import { useToast } from '@/src/components/ui/toast';
import { Loading } from '../../ui/loading';
import PreviewActionPanel from '../preview-action-panel';
import { GenericEditContent } from './text-edit-content';
import { LayoutType } from '@/src/components/ui/rich-text-editor/rich-text-editor';
import useValidate from '@/src/hooks/useValidate';
import { validateEmail } from '@/src/hooks/validations';

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
  const { validate, errors } = useValidate();

  const { rows, setContent, deleteRow, saveSignatureContentRow, colors } =
    useSignatureStore();

  const columnPath = contentPathToEdit.substring(
    0,
    contentPathToEdit.lastIndexOf('.rows['),
  );
  const columnColor = get(rows, `${columnPath}.style.backgroundColor`);

  const [iniContent, setIniContent] = useState<any>(null);
  const [isSavingSignature, setIsSavingSignature] = useState(false);

  const { setContentEdit, contentEdit } = useContentEditStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [paddingTop, setPaddingTop] = useState(0);
  const [paddingRight, setPaddingRight] = useState(0);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [paddingLeft, setPaddingLeft] = useState(0);
  const [borderRadius, setBorderRadius] = useState(0);

  const [borderWidths, setBorderWidths] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const [borderColors, setBorderColors] = useState({
    top: 'rgb(0, 0, 0)',
    right: 'rgb(0, 0, 0)',
    bottom: 'rgb(0, 0, 0)',
    left: 'rgb(0, 0, 0)',
  });

  const path = `${contentPathToEdit}.content`;
  const content = useMemo(() => get(rows, path), [rows, path]);

  useEffect(() => {
    if (content?.components[0].padding) {
      const paddingValues = content.components[0].padding
        .split(' ')
        .map((val: string) => parseInt(val.replace('px', ''), 10) || 0);

      setPaddingTop(paddingValues[0]);
      setPaddingRight(paddingValues[1]);
      setPaddingBottom(paddingValues[2]);
      setPaddingLeft(paddingValues[3]);
    } else {
      setPaddingTop(0);
      setPaddingRight(0);
      setPaddingBottom(0);
      setPaddingLeft(0);
    }

    if (content?.components[0].borderRadius) {
      setBorderRadius(
        parseInt(content.components[0].borderRadius.replace('px', ''), 10) || 0,
      );
    } else {
      setBorderRadius(0);
    }

    // Initialize border widths
    setBorderWidths({
      top:
        parseInt(
          (content?.components[0].borderTopWidth || '0px').replace('px', ''),
          10,
        ) || 0,
      right:
        parseInt(
          (content?.components[0].borderRightWidth || '0px').replace('px', ''),
          10,
        ) || 0,
      bottom:
        parseInt(
          (content?.components[0].borderBottomWidth || '0px').replace('px', ''),
          10,
        ) || 0,
      left:
        parseInt(
          (content?.components[0].borderLeftWidth || '0px').replace('px', ''),
          10,
        ) || 0,
    });

    // Initialize border colors
    setBorderColors({
      top: content?.components[0].borderTopColor || 'rgb(0, 0, 0)',
      right: content?.components[0].borderRightColor || 'rgb(0, 0, 0)',
      bottom: content?.components[0].borderBottomColor || 'rgb(0, 0, 0)',
      left: content?.components[0].borderLeftColor || 'rgb(0, 0, 0)',
    });

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
    const borderRadiusPx = `${borderRadius}px`;

    if (currentStyle.borderRadius !== borderRadiusPx) {
      setContent(stylePath, {
        ...currentStyle,
        borderRadius: borderRadiusPx,
      });
    }
  };

  const updateBorders = () => {
    const stylePath = `${path}.components[0]`;
    const currentStyle = content?.components[0] || {};

    setContent(stylePath, {
      ...currentStyle,
      borderTopWidth: `${borderWidths.top}px`,
      borderTopColor: borderColors.top,
      borderTopStyle: borderWidths.top === 0 ? 'none' : 'solid',

      borderRightWidth: `${borderWidths.right}px`,
      borderRightColor: borderColors.right,
      borderRightStyle: borderWidths.right === 0 ? 'none' : 'solid',

      borderBottomWidth: `${borderWidths.bottom}px`,
      borderBottomColor: borderColors.bottom,
      borderBottomStyle: borderWidths.bottom === 0 ? 'none' : 'solid',

      borderLeftWidth: `${borderWidths.left}px`,
      borderLeftColor: borderColors.left,
      borderLeftStyle: borderWidths.left === 0 ? 'none' : 'solid',
    });
  };

  useEffect(() => {
    // Check if all values are numbers before updating
    if (
      typeof paddingTop === 'number' &&
      typeof paddingRight === 'number' &&
      typeof paddingBottom === 'number' &&
      typeof paddingLeft === 'number'
    ) {
      updatePadding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paddingTop, paddingRight, paddingBottom, paddingLeft]);

  useEffect(() => {
    if (typeof borderRadius === 'number') {
      updateBorderRadius();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borderRadius]);

  useEffect(() => {
    updateBorders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borderWidths, borderColors]);

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
          duration: 0,
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
              {content &&
                getContentType(
                  content,
                  path,
                  isSignedIn,
                  columnColor,
                  validate,
                  errors,
                  setContent,
                )}

              {content.type !== ContentType.IMAGE && (
                <div className="mt-0">
                  <CollapsibleSection title="Background">
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
                    <div className="mb-4">
                      <Typography variant="labelBase" className="mb-2">
                        Border radius : {borderRadius}px
                      </Typography>
                      <Slider
                        min={0}
                        max={20}
                        value={borderRadius}
                        onChange={(value: number) => {
                          setBorderRadius(value);
                        }}
                      />
                    </div>
                  </CollapsibleSection>
                  <CollapsibleSection title="Inner space">
                    <div className="px-0">
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <Typography variant="labelBase" className="mb-2">
                            Top inner space: {paddingTop}px
                          </Typography>
                          <Slider
                            min={0}
                            max={50}
                            value={paddingTop}
                            onChange={(value: number) => {
                              setPaddingTop(value);
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
                            value={paddingRight}
                            onChange={(value: number) => {
                              setPaddingRight(value);
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
                            value={paddingBottom}
                            onChange={(value: number) => {
                              setPaddingBottom(value);
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
                            value={paddingLeft}
                            onChange={(value: number) => {
                              setPaddingLeft(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CollapsibleSection>
                  <CollapsibleSection title="Borders">
                    <div className="mb-4">
                      <Typography variant="labelBase" className="mb-2">
                        Top border width : {borderWidths.top}px
                      </Typography>
                      <Slider
                        min={0}
                        max={10}
                        value={borderWidths.top}
                        onChange={(value: number) => {
                          setBorderWidths((prev) => ({
                            ...prev,
                            top: value,
                          }));
                        }}
                      />
                    </div>

                    {borderWidths.top !== 0 && (
                      <EditColor
                        initColor={borderColors.top}
                        label="Top border color"
                        onChange={(color) => {
                          if (color) {
                            setBorderColors((prev) => ({
                              ...prev,
                              top: color,
                            }));
                          }
                        }}
                      />
                    )}

                    <div className="mt-4">
                      <Typography variant="labelBase" className="mb-2">
                        Right border width : {borderWidths.right}px
                      </Typography>
                      <Slider
                        min={0}
                        max={10}
                        value={borderWidths.right}
                        onChange={(value: number) => {
                          setBorderWidths((prev) => ({
                            ...prev,
                            right: value,
                          }));
                        }}
                      />
                    </div>

                    {borderWidths.right !== 0 && (
                      <EditColor
                        initColor={borderColors.right}
                        label="Right border color"
                        onChange={(color) => {
                          if (color) {
                            setBorderColors((prev) => ({
                              ...prev,
                              right: color,
                            }));
                          }
                        }}
                      />
                    )}

                    <div className="mt-4">
                      <Typography variant="labelBase" className="mb-2">
                        Bottom border width : {borderWidths.bottom}px
                      </Typography>
                      <Slider
                        min={0}
                        max={10}
                        value={borderWidths.bottom}
                        onChange={(value: number) => {
                          setBorderWidths((prev) => ({
                            ...prev,
                            bottom: value,
                          }));
                        }}
                      />
                    </div>

                    {borderWidths.bottom !== 0 && (
                      <EditColor
                        initColor={borderColors.bottom}
                        label="Bottom border color"
                        onChange={(color) => {
                          if (color) {
                            setBorderColors((prev) => ({
                              ...prev,
                              bottom: color,
                            }));
                          }
                        }}
                      />
                    )}

                    <div className="mt-4">
                      <Typography variant="labelBase" className="mb-2">
                        Left border width : {borderWidths.left}px
                      </Typography>
                      <Slider
                        min={0}
                        max={10}
                        value={borderWidths.left}
                        onChange={(value: number) => {
                          setBorderWidths((prev) => ({
                            ...prev,
                            left: value,
                          }));
                        }}
                      />
                    </div>

                    {borderWidths.left !== 0 && (
                      <EditColor
                        initColor={borderColors.left}
                        label="Left border color"
                        onChange={(color) => {
                          if (color) {
                            setBorderColors((prev) => ({
                              ...prev,
                              left: color,
                            }));
                          }
                        }}
                      />
                    )}
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
                    Delete {getContentTypeName(content.type)}
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
  columnColor: string,
  validate: (validationData: {
    text: string;
    componentId: string;
    validation: (value: string) => { message: string };
  }) => void,
  errors: Record<string, string | null>,
  setContent: (path: string, value: any) => void,
) => {
  const type: ContentType = content?.type;
  const components = content?.components;

  const commonProps = {
    components,
    contentPathToEdit,
    columnColor,
    contentType: type,
    errors,
  };

  switch (type) {
    case ContentType.TEXT:
      return (
        <GenericEditContent
          {...commonProps}
          reverseComponents={false}
          useComponentBackgroundColor={true}
          getLabel={() => ''}
          getLayoutType={() => LayoutType.TEXT}
          getTitle={() => 'Text and color'}
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

    case ContentType.EMAIL: {
      const getLabel = (component: any) => {
        if (component.type === ContentType.TEXT) return 'Prefix';
        if (component.type === ContentType.EMAIL_LINK) return 'Email';
        return '';
      };
      const getLayoutType = (component: any) => {
        if (component.type === ContentType.TEXT) return LayoutType.PREFIX;
        return LayoutType.TEXT;
      };
      const onValueChange = (
        editContent: any,
        component: any,
        path: string,
      ) => {
        if (component.type === ContentType.EMAIL_LINK && editContent.text) {
          validate({
            text: editContent.text,
            componentId: component.id,
            validation: validateEmail,
          });
        }
        setContent(path, editContent);
      };

      return (
        <GenericEditContent
          {...commonProps}
          getLabel={getLabel}
          getLayoutType={getLayoutType}
          getTitle={(labelText: string) => `${labelText} text and color`}
          onValueChange={onValueChange}
        />
      );
    }

    case ContentType.PHONE: {
      const getLabel = (component: any) => {
        if (component.type === ContentType.TEXT) return 'Prefix';
        if (component.type === ContentType.PHONE_LINK) return 'Phone';
        return '';
      };
      const getLayoutType = (component: any) => {
        if (component.type === ContentType.TEXT) return LayoutType.PREFIX;
        return LayoutType.TEXT;
      };
      return (
        <GenericEditContent
          {...commonProps}
          getLabel={getLabel}
          getLayoutType={getLayoutType}
          getTitle={(labelText: string) => `${labelText} text and color`}
        />
      );
    }

    case ContentType.WEBSITE: {
      const getLabel = (component: any) => {
        if (component.type === ContentType.TEXT) return 'Prefix';
        if (component.type === ContentType.WEBSITE_LINK) return 'Website';
        return '';
      };
      const getLayoutType = (component: any) => {
        if (component.type === ContentType.TEXT) return LayoutType.PREFIX;
        return LayoutType.TEXT;
      };
      return (
        <GenericEditContent
          {...commonProps}
          getLabel={getLabel}
          getLayoutType={getLayoutType}
          getTitle={(labelText: string) => `${labelText} text and color`}
        />
      );
    }

    case ContentType.CUSTOM_VALUE: {
      const getLabel = (
        component: any,
        index: number,
        originalIndex: number,
      ) => {
        if (component.type === ContentType.TEXT) {
          return originalIndex === 1 ? 'Prefix' : 'Value';
        }
        return '';
      };
      const getLayoutType = (
        component: any,
        index: number,
        originalIndex: number,
      ) => {
        if (component.type === ContentType.TEXT && originalIndex === 1) {
          return LayoutType.PREFIX;
        }
        return LayoutType.TEXT;
      };
      return (
        <GenericEditContent
          {...commonProps}
          getLabel={getLabel}
          getLayoutType={getLayoutType}
          getTitle={(labelText: string) => `Text and color ${labelText}`}
        />
      );
    }

    default:
      return null;
  }
};
