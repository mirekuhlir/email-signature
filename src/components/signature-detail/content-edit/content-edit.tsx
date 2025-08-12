/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { ContentType } from '@/src/const/content';
import { Button } from '@/src/components/ui/button';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { ImageEditContent } from './image-edit-content';
import { Typography } from '@/src/components/ui/typography';
import { DeleteConfirmationModal } from '@/src/components/ui/delete-confirmation-modal';
import { CollapsibleSection } from '@/src/components/ui/collapsible-section';
import { EditColor } from '@/src/components/ui/edit-color';
import { useToast } from '@/src/components/ui/toast';
import { Loading } from '../../ui/loading';
import PreviewActionPanel from '../preview-action-panel';
import { GenericEditContent } from './text-edit-content';
import { LayoutType } from '@/src/components/ui/rich-text-editor/rich-text-editor';
import useValidate from '@/src/hooks/useValidate';
import { validateEmail } from '@/src/hooks/validations';
import {
  MAX_BORDER_WIDTH,
  MAX_BORDER_RADIUS,
  MAX_PADDING,
  MAX_WIDTH_OR_HEIGHT,
} from '@/supabase/functions/_shared/const';
import { LinkComponent } from './add-link';
import { VerticalAlign } from '../column-settings/column-settings';
import { EEditType, SliderDimensions } from '../../ui/slider-dimensions';
import { saveTempSignature } from './utils';
import {
  image,
  text,
  twoPartText,
  email,
  phone,
  website,
} from '../content-add/const';

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
          <Typography className="text-gray-600" variant="large">
            {text}
          </Typography>
        </div>
      </div>
    </div>
  );
};

// TODO

const getContentTypeName = (type: ContentType): string => {
  switch (type) {
    case ContentType.TEXT:
      return text;
    case ContentType.IMAGE:
      return image;
    case ContentType.EMAIL:
      return email;
    case ContentType.PHONE:
      return phone;
    case ContentType.WEBSITE:
      return website;
    case ContentType.TWO_PART_TEXT:
      return twoPartText;
    default:
      return 'element';
  }
};

export const ContentEdit = (props: any) => {
  const {
    contentPathToEdit,
    signatureId,
    isSignedIn,
    templateSlug,
    tempSignatureCreatedAt,
  } = props;
  const { toast } = useToast();
  const { validate, errors } = useValidate();

  const {
    rows,
    setContent,
    deleteRow,
    saveSignatureContentRow,
    colors,
    dimensions,
  } = useSignatureStore();

  const columnPath = contentPathToEdit.substring(
    0,
    contentPathToEdit.lastIndexOf('.rows['),
  );
  const columnColor = get(rows, `${columnPath}.style.backgroundColor`);

  const [iniContent, setIniContent] = useState<any>(null);
  const [iniColumnStyle, setIniColumnStyle] = useState<any>(null);
  const [isSavingSignature, setIsSavingSignature] = useState(false);

  const {
    setContentEdit,
    contentEdit,
    editingSectionIds,
    addEditingSectionId,
    removeEditingSectionId,
  } = useContentEditStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [paddingTop, setPaddingTop] = useState(0);
  const [paddingRight, setPaddingRight] = useState(0);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [paddingLeft, setPaddingLeft] = useState(0);
  const [borderRadiusCorners, setBorderRadiusCorners] = useState({
    topLeft: '0',
    topRight: '0',
    bottomRight: '0',
    bottomLeft: '0',
  });

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

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [verticalAlign, setVerticalAlign] = useState('top');

  const path = `${contentPathToEdit}.content`;
  const content = useMemo(() => get(rows, path), [rows, path]);
  const columnStylePath = `${columnPath}.style`;
  const columnStyle = useMemo(
    () => get(rows, columnStylePath) || {},
    [rows, columnStylePath],
  );

  // Initialize verticalAlign from existing column style data
  useEffect(() => {
    const currentVerticalAlign = columnStyle.verticalAlign || 'top';
    setVerticalAlign(currentVerticalAlign);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const radiusValues = content.components[0].borderRadius
        .split(' ')
        .map((val: string) => val.replace('px', ''));
      if (radiusValues.length === 1) {
        setBorderRadiusCorners({
          topLeft: radiusValues[0],
          topRight: radiusValues[0],
          bottomRight: radiusValues[0],
          bottomLeft: radiusValues[0],
        });
      } else if (radiusValues.length === 4) {
        setBorderRadiusCorners({
          topLeft: radiusValues[0],
          topRight: radiusValues[1],
          bottomRight: radiusValues[2],
          bottomLeft: radiusValues[3],
        });
      } else {
        // Handle other cases or set a default if needed
        setBorderRadiusCorners({
          topLeft: '0',
          topRight: '0',
          bottomRight: '0',
          bottomLeft: '0',
        });
      }
    } else {
      setBorderRadiusCorners({
        topLeft: '0',
        topRight: '0',
        bottomRight: '0',
        bottomLeft: '0',
      });
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

    setWidth(
      parseInt((content?.components[0].width || '0px').replace('px', ''), 10) ||
        0,
    );
    setHeight(
      parseInt(
        (content?.components[0].height || '0px').replace('px', ''),
        10,
      ) || 0,
    );

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

  const updateBorderRadiusCorners = () => {
    const stylePath = `${path}.components[0]`;
    const currentStyle = content?.components[0] || {};
    const { topLeft, topRight, bottomRight, bottomLeft } = borderRadiusCorners;
    const borderRadiusValue = `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;

    if (currentStyle.borderRadius !== borderRadiusValue) {
      setContent(stylePath, {
        ...currentStyle,
        borderRadius: borderRadiusValue,
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

  const updateDimensions = () => {
    const stylePath = `${path}.components[0]`;
    const currentStyle = content?.components[0] || {};
    setContent(stylePath, {
      ...currentStyle,
      width: `${width}px`,
      height: `${height}px`,
    });
  };

  const updateVerticalAlign = useCallback(
    (value: string) => {
      const currentStyle = get(rows, columnStylePath) || {};
      setContent(columnStylePath, {
        ...currentStyle,
        verticalAlign: value,
      });
    },
    [columnStylePath, setContent, rows],
  );

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
    updateBorderRadiusCorners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borderRadiusCorners]);

  useEffect(() => {
    updateBorders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borderWidths, borderColors]);

  useEffect(() => {
    // Check if all values are numbers before updating
    if (typeof width === 'number' && typeof height === 'number') {
      updateDimensions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  // Apply vertical align changes immediately
  useEffect(() => {
    if (verticalAlign) {
      updateVerticalAlign(verticalAlign);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verticalAlign]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteRow = useCallback(async () => {
    setIsSavingSignature(true);

    try {
      await deleteRow(contentPathToEdit, signatureId, isSignedIn);
      setContentEdit({ editPath: null });
    } catch (error) {
      toast({
        description: 'Failed to delete row. Please try again.',
        variant: 'error',
        duration: 5000,
      });
      console.error(error);
    } finally {
      setIsSavingSignature(false);
      setIsDeleteModalOpen(false);
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
    if (!iniColumnStyle) {
      setIniColumnStyle(columnStyle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, columnStyle]);

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
      // Restore both content and column style
      setContent(path, iniContent);
      if (iniColumnStyle) {
        setContent(columnStylePath, iniColumnStyle);
      }
      setContentEdit({
        editPath: null,
      });
    }
  };

  const handleSave = async () => {
    if (!isSignedIn) {
      saveTempSignature({
        createdAt: tempSignatureCreatedAt,
        updatedAt: new Date().toISOString(),
        templateSlug,
        rows,
        colors,
        dimensions,
      });
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
      } finally {
        setIsSavingSignature(false);
      }
    }
  };

  const componentId = content?.components[0]?.id;

  const isVisibleOnlyPreview = editingSectionIds.length > 0;
  const isSlidersDisabled = editingSectionIds.length > 0;
  const isImageResizing = contentEdit.isImageResizing;

  return (
    <div key={path}>
      <div className="pb-24">
        {isSavingSignature && <LoadingInfo />}
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
                  addEditingSectionId,
                  removeEditingSectionId,
                  setContentEdit,
                )}
              <>
                <CollapsibleSection title="Spaces">
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <SliderDimensions
                        label={`Top space: ${paddingTop}px`}
                        min={0}
                        max={MAX_PADDING}
                        value={paddingTop}
                        onChange={(value: number) => {
                          setPaddingTop(value);
                        }}
                        isDisabled={isSlidersDisabled}
                        editType={EEditType.SPACE}
                      />
                    </div>

                    <div>
                      <SliderDimensions
                        label={`Right space: ${paddingRight}px`}
                        min={0}
                        max={MAX_PADDING}
                        value={paddingRight}
                        onChange={(value: number) => {
                          setPaddingRight(value);
                        }}
                        isDisabled={isSlidersDisabled}
                        editType={EEditType.SPACE}
                      />
                    </div>

                    <div>
                      <SliderDimensions
                        label={`Bottom space: ${paddingBottom}px`}
                        min={0}
                        max={MAX_PADDING}
                        value={paddingBottom}
                        onChange={(value: number) => {
                          setPaddingBottom(value);
                        }}
                        isDisabled={isSlidersDisabled}
                        editType={EEditType.SPACE}
                      />
                    </div>

                    <div>
                      <SliderDimensions
                        label={`Left space: ${paddingLeft}px`}
                        min={0}
                        max={MAX_PADDING}
                        value={paddingLeft}
                        onChange={(value: number) => {
                          setPaddingLeft(value);
                        }}
                        isDisabled={isSlidersDisabled}
                        editType={EEditType.SPACE}
                      />
                    </div>
                  </div>
                </CollapsibleSection>
                <CollapsibleSection title="Borders">
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <div>
                        <SliderDimensions
                          label={`Top border width : ${borderWidths.top}px`}
                          min={0}
                          max={MAX_BORDER_WIDTH}
                          value={borderWidths.top}
                          onChange={(value: number) => {
                            setBorderWidths((prev) => ({
                              ...prev,
                              top: value,
                            }));
                          }}
                          isDisabled={isSlidersDisabled}
                          editType={EEditType.BORDER}
                        />
                      </div>

                      {borderWidths.top !== 0 && (
                        <div className="mb-2">
                          <EditColor
                            initColor={borderColors.top}
                            label="Top border color"
                            sectionId={componentId}
                            onChange={(color) => {
                              if (color) {
                                setBorderColors((prev) => ({
                                  ...prev,
                                  top: color,
                                }));
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <div>
                        <SliderDimensions
                          label={`Right border width : ${borderWidths.right}px`}
                          min={0}
                          max={MAX_BORDER_WIDTH}
                          value={borderWidths.right}
                          onChange={(value: number) => {
                            setBorderWidths((prev) => ({
                              ...prev,
                              right: value,
                            }));
                          }}
                          isDisabled={isSlidersDisabled}
                          editType={EEditType.BORDER}
                        />
                      </div>

                      {borderWidths.right !== 0 && (
                        <div className="mb-2">
                          <EditColor
                            initColor={borderColors.right}
                            label="Right border color"
                            sectionId={componentId}
                            onChange={(color) => {
                              if (color) {
                                setBorderColors((prev) => ({
                                  ...prev,
                                  right: color,
                                }));
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <div>
                        <SliderDimensions
                          label={`Bottom border width : ${borderWidths.bottom}px`}
                          min={0}
                          max={MAX_BORDER_WIDTH}
                          value={borderWidths.bottom}
                          onChange={(value: number) => {
                            setBorderWidths((prev) => ({
                              ...prev,
                              bottom: value,
                            }));
                          }}
                          isDisabled={isSlidersDisabled}
                          editType={EEditType.BORDER}
                        />
                      </div>

                      {borderWidths.bottom !== 0 && (
                        <div className="mb-2">
                          <EditColor
                            initColor={borderColors.bottom}
                            label="Bottom border color"
                            sectionId={componentId}
                            onChange={(color) => {
                              if (color) {
                                setBorderColors((prev) => ({
                                  ...prev,
                                  bottom: color,
                                }));
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <div>
                        <SliderDimensions
                          label={`Left border width : ${borderWidths.left}px`}
                          min={0}
                          max={MAX_BORDER_WIDTH}
                          value={borderWidths.left}
                          onChange={(value: number) => {
                            setBorderWidths((prev) => ({
                              ...prev,
                              left: value,
                            }));
                          }}
                          isDisabled={isSlidersDisabled}
                          editType={EEditType.BORDER}
                        />
                      </div>

                      {borderWidths.left !== 0 && (
                        <div className="mb-2">
                          <EditColor
                            initColor={borderColors.left}
                            label="Left border color"
                            sectionId={componentId}
                            onChange={(color) => {
                              if (color) {
                                setBorderColors((prev) => ({
                                  ...prev,
                                  left: color,
                                }));
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleSection>
                <CollapsibleSection title="Background and rounded corners">
                  <div className="mb-4">
                    <EditColor
                      initColor={content?.components[0]?.backgroundColor}
                      label="Background color"
                      sectionId={componentId}
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
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <SliderDimensions
                        label={`Top-left rounded corner: ${borderRadiusCorners.topLeft}px`}
                        min={0}
                        max={MAX_BORDER_RADIUS}
                        value={Number(borderRadiusCorners.topLeft)}
                        onChange={(value: number) => {
                          setBorderRadiusCorners((prev) => ({
                            ...prev,
                            topLeft: value.toString(),
                          }));
                        }}
                        isDisabled={isSlidersDisabled}
                        editType={EEditType.CORNER}
                      />
                    </div>
                    <div>
                      <SliderDimensions
                        label={`Top-right rounded corner: ${borderRadiusCorners.topRight}px`}
                        min={0}
                        max={MAX_BORDER_RADIUS}
                        value={Number(borderRadiusCorners.topRight)}
                        onChange={(value: number) => {
                          setBorderRadiusCorners((prev) => ({
                            ...prev,
                            topRight: value.toString(),
                          }));
                        }}
                        isDisabled={isSlidersDisabled}
                        editType={EEditType.CORNER}
                      />
                    </div>
                    <div>
                      <SliderDimensions
                        label={`Bottom-left rounded corner: ${borderRadiusCorners.bottomLeft}px`}
                        min={0}
                        max={MAX_BORDER_RADIUS}
                        value={Number(borderRadiusCorners.bottomLeft)}
                        onChange={(value: number) => {
                          setBorderRadiusCorners((prev) => ({
                            ...prev,
                            bottomLeft: value.toString(),
                          }));
                        }}
                        isDisabled={isSlidersDisabled}
                        editType={EEditType.CORNER}
                      />
                    </div>
                    <div>
                      <SliderDimensions
                        label={`Bottom-right rounded corner: ${borderRadiusCorners.bottomRight}px`}
                        min={0}
                        max={MAX_BORDER_RADIUS}
                        value={Number(borderRadiusCorners.bottomRight)}
                        onChange={(value: number) => {
                          setBorderRadiusCorners((prev) => ({
                            ...prev,
                            bottomRight: value.toString(),
                          }));
                        }}
                        isDisabled={isSlidersDisabled}
                        editType={EEditType.CORNER}
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                {content.type !== ContentType.IMAGE && (
                  <CollapsibleSection title="Alignment">
                    <VerticalAlign
                      verticalAlign={verticalAlign}
                      setVerticalAlign={setVerticalAlign}
                    />
                  </CollapsibleSection>
                )}

                <CollapsibleSection title="Width and height">
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <SliderDimensions
                        label={`Width: ${width === 0 ? 'auto' : `${width}px`}`}
                        min={0}
                        max={MAX_WIDTH_OR_HEIGHT}
                        value={width}
                        onChange={(value: number) => {
                          setWidth(value);
                        }}
                        isDisabled={isSlidersDisabled}
                        editType={EEditType.LENGTH}
                      />
                    </div>
                    <div>
                      <SliderDimensions
                        label={`Height: ${height === 0 ? 'auto' : `${height}px`}`}
                        min={0}
                        max={MAX_WIDTH_OR_HEIGHT}
                        value={height}
                        onChange={(value: number) => {
                          setHeight(value);
                        }}
                        isDisabled={isSlidersDisabled}
                        editType={EEditType.LENGTH}
                      />
                    </div>
                  </div>
                </CollapsibleSection>
              </>
            </>
          )}
        </div>

        {!isSavingSignature &&
          !contentEdit.subEdit &&
          !contentEdit.isImageLoading && (
            <>
              {canDisplayDeleteButton && (
                <CollapsibleSection title="Delete">
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
                </CollapsibleSection>
              )}

              <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteRow}
                title={`Delete ${getContentTypeName(content.type)}`}
                message={`Are you sure you want to delete this ${getContentTypeName(content.type)}?`}
                isLoading={isSavingSignature}
              />
            </>
          )}
        <PreviewActionPanel
          visible={!isSavingSignature}
          onClose={closeContent}
          onSave={handleSave}
          isVisibleOnlyClose={isVisibleOnlyClose}
          isVisibleOnlyPreview={isVisibleOnlyPreview}
          isSaveDisabled={Boolean(isImageResizing)}
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
  addEditingSectionId: (sectionId: string) => void,
  removeEditingSectionId: (sectionId: string) => void,
  setContentEdit: (edit: any) => void,
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
          getTitle={() => 'Text'}
          isLabelHidden={true}
        />
      );

    case ContentType.IMAGE:
      return (
        <ImageEditContent
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
        if (component.type === ContentType.EMAIL_LINK) return LayoutType.EMAIL;
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
          getTitle={(labelText: string) => `${labelText} text`}
          onValueChange={onValueChange}
          isLabelHidden={true}
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
        if (component.type === ContentType.PHONE_LINK) return LayoutType.PHONE;
        return LayoutType.TEXT;
      };

      return (
        <GenericEditContent
          {...commonProps}
          getLabel={getLabel}
          getLayoutType={getLayoutType}
          getTitle={(labelText: string) => `${labelText} text`}
          isLabelHidden={true}
        />
      );
    }

    case ContentType.WEBSITE: {
      const getLabel = (component: any) => {
        if (component.type === ContentType.TEXT) return 'Prefix';
        if (component.type === ContentType.WEBSITE_LINK) return 'Website';
        return '';
      };
      // TODO
      const getLayoutType = (component: any) => {
        if (component.type === ContentType.TEXT) return LayoutType.PREFIX;
        if (component.type === ContentType.WEBSITE_LINK)
          return LayoutType.WEBSITE;
        return LayoutType.TEXT;
      };
      return (
        <GenericEditContent
          {...commonProps}
          getLabel={getLabel}
          getLayoutType={getLayoutType}
          getTitle={(labelText: string) => `${labelText} text`}
          linkComponent={
            <LinkComponent
              component={components[1]}
              contentPathToEdit={`${contentPathToEdit}.components[1].link`}
              setContent={setContent}
              setContentEdit={setContentEdit}
              addEditingSectionId={addEditingSectionId}
              removeEditingSectionId={removeEditingSectionId}
              title="Add link to text"
            />
          }
          isLabelHidden={true}
        />
      );
    }

    case ContentType.TWO_PART_TEXT: {
      const getLabel = (component: any, originalIndex: number) => {
        if (component.type === ContentType.TWO_PART_TEXT && originalIndex === 0)
          return 'The first';
        if (component.type === ContentType.TWO_PART_TEXT && originalIndex === 1)
          return 'The second';
        return '';
      };
      const getLayoutType = (component: any, _: number) => {
        if (component.type === ContentType.TWO_PART_TEXT)
          return LayoutType.CUSTOM_VALUE;
        return LayoutType.TEXT;
      };
      return (
        <GenericEditContent
          {...commonProps}
          reverseComponents={false}
          getLabel={getLabel}
          getLayoutType={getLayoutType}
          getTitle={(labelText: string) => `${labelText} text`}
          isLabelHidden={true}
        />
      );
    }

    default:
      return null;
  }
};
