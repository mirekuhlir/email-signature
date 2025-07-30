/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { Typography } from '@/src/components/ui/typography';
import SelectBase from '@/src/components/ui/select-base';
import { EditColor } from '../../ui/edit-color';
import { useToast } from '@/src/components/ui/toast';
import { CollapsibleSection } from '@/src/components/ui/collapsible-section';
import PreviewActionPanel from '../preview-action-panel';
import { LoadingInfo } from '../content-edit/content-edit';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import {
  MAX_PADDING,
  MAX_BORDER_RADIUS,
  MAX_BORDER_WIDTH,
  MAX_WIDTH_OR_HEIGHT,
} from '@/supabase/functions/_shared/const';
import { EEditType, SliderDimensions } from '../../ui/slider-dimensions';
import { saveTempSignature } from '../content-edit/utils';

export const VerticalAlign = (props: any) => {
  const { verticalAlign, setVerticalAlign } = props;
  return (
    <div className="w-full">
      <Typography variant="labelBase">Vertical alignment</Typography>
      <SelectBase
        options={[
          { value: 'top', label: 'Top' },
          { value: 'middle', label: 'Middle' },
          { value: 'bottom', label: 'Bottom' },
        ]}
        value={verticalAlign}
        onChange={(value: string) => {
          setVerticalAlign(value);
        }}
      />
    </div>
  );
};

export const ColumnSettings = (props: any) => {
  const {
    columnPathToEdit,
    signatureId,
    isSignedIn,
    templateSlug,
    tempSignatureCreatedAt,
  } = props;
  const { toast } = useToast();

  const { rows, setContent, saveSignatureContentRow, colors, dimensions } =
    useSignatureStore();
  const { editingSectionIds } = useContentEditStore();
  const { setContentEdit } = useContentEditStore();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [initContent, setInitContent] = useState<any>(null);
  const [isSavingSignature, setIsSavingSignature] = useState(false);

  const [paddingTop, setPaddingTop] = useState('0');
  const [paddingRight, setPaddingRight] = useState('0');
  const [paddingBottom, setPaddingBottom] = useState('0');
  const [paddingLeft, setPaddingLeft] = useState('0');
  const [verticalAlign, setVerticalAlign] = useState('top');

  const [columnWidth, setColumnWidth] = useState(0);
  const [columnHeight, setColumnHeight] = useState(0);

  const [borderWidths, setBorderWidths] = useState({
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  });
  const [borderColors, setBorderColors] = useState({
    top: 'rgb(0, 0, 0)',
    right: 'rgb(0, 0, 0)',
    bottom: 'rgb(0, 0, 0)',
    left: 'rgb(0, 0, 0)',
  });

  const [borderRadiusCorners, setBorderRadiusCorners] = useState({
    topLeft: '0',
    topRight: '0',
    bottomRight: '0',
    bottomLeft: '0',
  });

  const path = `${columnPathToEdit}.style`;
  const originalStyle = useMemo(() => get(rows, path) || {}, [rows, path]);

  useEffect(() => {
    // Scroll to top when column settings is opened
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (!initContent) {
      setInitContent(originalStyle);
    }

    if (originalStyle.padding) {
      const paddingValues = originalStyle.padding
        .split(' ')
        .map((val: string) => val.replace('px', ''));

      setPaddingTop(paddingValues[0]);
      setPaddingRight(paddingValues[1]);
      setPaddingBottom(paddingValues[2]);
      setPaddingLeft(paddingValues[3]);
    }

    if (originalStyle.verticalAlign) {
      setVerticalAlign(originalStyle.verticalAlign);
    }

    setColumnWidth(
      parseInt((originalStyle.width || '0px').replace('px', ''), 10) || 0,
    );
    setColumnHeight(
      parseInt((originalStyle.height || '0px').replace('px', ''), 10) || 0,
    );

    // Initialize border widths
    setBorderWidths({
      top: (originalStyle.borderTopWidth || '0px').replace('px', ''),
      right: (originalStyle.borderRightWidth || '0px').replace('px', ''),
      bottom: (originalStyle.borderBottomWidth || '0px').replace('px', ''),
      left: (originalStyle.borderLeftWidth || '0px').replace('px', ''),
    });

    // Initialize border colors
    setBorderColors({
      top: originalStyle.borderTopColor || 'rgb(0, 0, 0)',
      right: originalStyle.borderRightColor || 'rgb(0, 0, 0)',
      bottom: originalStyle.borderBottomColor || 'rgb(0, 0, 0)',
      left: originalStyle.borderLeftColor || 'rgb(0, 0, 0)',
    });

    // Initialize border radius for each corner
    if (originalStyle.borderRadius) {
      const radiusValues = originalStyle.borderRadius
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePadding = () => {
    const paddingValue = `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`;

    const currentStyle = get(rows, path) || {};

    if (currentStyle.padding !== paddingValue) {
      setContent(path, {
        ...currentStyle,
        padding: paddingValue,
      });
    }
  };

  const updateVerticalAlign = (value: string) => {
    const currentStyle = get(rows, path) || {};
    setContent(path, {
      ...currentStyle,
      verticalAlign: value,
    });
  };

  const updateBorders = () => {
    const currentStyle = get(rows, path) || {};

    setContent(path, {
      ...currentStyle,
      borderTopWidth: `${borderWidths.top}px`,
      borderTopColor: borderColors.top,
      borderTopStyle: borderWidths.top === '0' ? 'none' : 'solid',

      borderRightWidth: `${borderWidths.right}px`,
      borderRightColor: borderColors.right,
      borderRightStyle: borderWidths.right === '0' ? 'none' : 'solid',

      borderBottomWidth: `${borderWidths.bottom}px`,
      borderBottomColor: borderColors.bottom,
      borderBottomStyle: borderWidths.bottom === '0' ? 'none' : 'solid',

      borderLeftWidth: `${borderWidths.left}px`,
      borderLeftColor: borderColors.left,
      borderLeftStyle: borderWidths.left === '0' ? 'none' : 'solid',
    });
  };

  const updateBorderRadiusCorners = () => {
    const currentStyle = get(rows, path) || {};
    const { topLeft, topRight, bottomRight, bottomLeft } = borderRadiusCorners;
    const borderRadiusValue = `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;

    setContent(path, {
      ...currentStyle,
      borderRadius: borderRadiusValue,
    });
  };

  const updateColumnDimensions = () => {
    const currentStyle = get(rows, path) || {};
    setContent(path, {
      ...currentStyle,
      width: columnWidth === 0 ? 'auto' : `${columnWidth}px`,
      height: columnHeight === 0 ? 'auto' : `${columnHeight}px`,
    });
  };

  useEffect(() => {
    if (paddingTop && paddingRight && paddingBottom && paddingLeft) {
      updatePadding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paddingTop, paddingRight, paddingBottom, paddingLeft]);

  useEffect(() => {
    if (verticalAlign) {
      updateVerticalAlign(verticalAlign);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verticalAlign]);

  useEffect(() => {
    updateBorders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borderWidths, borderColors]);

  useEffect(() => {
    updateBorderRadiusCorners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borderRadiusCorners]);

  useEffect(() => {
    // Check if all values are numbers before updating
    if (typeof columnWidth === 'number' && typeof columnHeight === 'number') {
      updateColumnDimensions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnWidth, columnHeight]);

  const closeSettings = () => {
    setContent(path, initContent);
    setContentEdit({
      columnPath: null,
    });
  };

  // TODO: sjednotit s handleSave v content-edit
  const handleSave = async () => {
    if (!isSignedIn) {
      saveTempSignature({
        createdAt: tempSignatureCreatedAt,
        templateSlug: templateSlug,
        rows: rows,
        colors: colors,
        dimensions: dimensions,
      });
      setContentEdit({
        columnPath: null,
      });
    } else {
      setIsSavingSignature(true);

      try {
        await saveSignatureContentRow(signatureId, columnPathToEdit);
        setContentEdit({
          columnPath: null,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Failed to save column settings. Please try again.',
          variant: 'error',
          duration: 0,
        });
      } finally {
        setIsSavingSignature(false);
      }
    }
  };

  const componentId = get(rows, columnPathToEdit)?.id;

  const isVisibleOnlyPreview = editingSectionIds.length > 0;
  const isSlidersDisabled = editingSectionIds.length > 0;

  return (
    <div key={`settings-${columnPathToEdit}`} className="mt-6 pb-24">
      <div ref={wrapperRef}>
        {!isSavingSignature && (
          <div className="pb-2">
            <CollapsibleSection title="Inner space">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <SliderDimensions
                    label={`Top space: ${paddingTop}px`}
                    min={0}
                    max={MAX_PADDING}
                    value={Number(paddingTop)}
                    onChange={(value: number) => {
                      setPaddingTop(value.toString());
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
                    value={Number(paddingRight)}
                    onChange={(value: number) => {
                      setPaddingRight(value.toString());
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
                    value={Number(paddingBottom)}
                    onChange={(value: number) => {
                      setPaddingBottom(value.toString());
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
                    value={Number(paddingLeft)}
                    onChange={(value: number) => {
                      setPaddingLeft(value.toString());
                    }}
                    isDisabled={isSlidersDisabled}
                    editType={EEditType.SPACE}
                  />
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Borders">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="mb-2">
                  <div>
                    <SliderDimensions
                      label={`Top width : ${borderWidths.top}px`}
                      min={0}
                      max={MAX_BORDER_WIDTH}
                      value={Number(borderWidths.top)}
                      onChange={(value: number) => {
                        setBorderWidths((prev) => ({
                          ...prev,
                          top: value.toString(),
                        }));
                      }}
                      isDisabled={isSlidersDisabled}
                      editType={EEditType.BORDER}
                    />
                  </div>

                  {borderWidths.top !== '0' && (
                    <EditColor
                      initColor={borderColors.top}
                      label="Top width border color"
                      sectionId={componentId}
                      onChange={(color) => {
                        if (color) {
                          setBorderColors((prev) => ({ ...prev, top: color }));
                        }
                      }}
                    />
                  )}
                </div>

                <div className="mb-4">
                  <div>
                    <SliderDimensions
                      label={`Right width : ${borderWidths.right}px`}
                      min={0}
                      max={MAX_BORDER_WIDTH}
                      value={Number(borderWidths.right)}
                      onChange={(value: number) => {
                        setBorderWidths((prev) => ({
                          ...prev,
                          right: value.toString(),
                        }));
                      }}
                      isDisabled={isSlidersDisabled}
                      editType={EEditType.BORDER}
                    />
                  </div>

                  {borderWidths.right !== '0' && (
                    <EditColor
                      initColor={borderColors.right}
                      label="Right width border color"
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
                  )}
                </div>

                <div className="mb-4">
                  <div>
                    <SliderDimensions
                      label={`Bottom width : ${borderWidths.bottom}px`}
                      min={0}
                      max={MAX_BORDER_WIDTH}
                      value={Number(borderWidths.bottom)}
                      onChange={(value: number) => {
                        setBorderWidths((prev) => ({
                          ...prev,
                          bottom: value.toString(),
                        }));
                      }}
                      isDisabled={isSlidersDisabled}
                      editType={EEditType.BORDER}
                    />
                  </div>

                  {borderWidths.bottom !== '0' && (
                    <EditColor
                      initColor={borderColors.bottom}
                      label="Bottom width border color"
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
                  )}
                </div>

                <div className="mb-2">
                  <div>
                    <SliderDimensions
                      label={`Left width : ${borderWidths.left}px`}
                      min={0}
                      max={MAX_BORDER_WIDTH}
                      value={Number(borderWidths.left)}
                      onChange={(value: number) => {
                        setBorderWidths((prev) => ({
                          ...prev,
                          left: value.toString(),
                        }));
                      }}
                      isDisabled={isSlidersDisabled}
                      editType={EEditType.BORDER}
                    />
                  </div>

                  {borderWidths.left !== '0' && (
                    <EditColor
                      initColor={borderColors.left}
                      label="Left width border color"
                      sectionId={componentId}
                      onChange={(color) => {
                        if (color) {
                          setBorderColors((prev) => ({ ...prev, left: color }));
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </CollapsibleSection>
            <CollapsibleSection title="Background and rounded corners">
              <div className="grid grid-cols-1 gap-2">
                <div className="mb-4">
                  <EditColor
                    initColor={originalStyle.backgroundColor}
                    label="Background color"
                    sectionId={componentId}
                    isResetToTransparent
                    onChange={(color) => {
                      setContent(path, {
                        ...originalStyle,
                        backgroundColor: color,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <SliderDimensions
                    label={`Top-left rounded corner : ${borderRadiusCorners.topLeft}px`}
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
                    label={`Top-right rounded corner : ${borderRadiusCorners.topRight}px`}
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
                    label={`Bottom-left rounded corner : ${borderRadiusCorners.bottomLeft}px`}
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
                    label={`Bottom-right rounded corner : ${borderRadiusCorners.bottomRight}px`}
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
            <CollapsibleSection title="Alignment">
              <VerticalAlign
                verticalAlign={verticalAlign}
                setVerticalAlign={setVerticalAlign}
              />
            </CollapsibleSection>
            <CollapsibleSection title="Width and Height">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <SliderDimensions
                    label={`Width: ${columnWidth === 0 ? 'auto' : `${columnWidth}px`}`}
                    min={0}
                    max={MAX_WIDTH_OR_HEIGHT}
                    value={columnWidth}
                    onChange={(value: number) => {
                      setColumnWidth(value);
                    }}
                    isDisabled={isSlidersDisabled}
                    editType={EEditType.LENGTH}
                  />
                </div>
                <div>
                  <SliderDimensions
                    label={`Height: ${columnHeight === 0 ? 'auto' : `${columnHeight}px`}`}
                    min={0}
                    max={MAX_WIDTH_OR_HEIGHT}
                    value={columnHeight}
                    onChange={(value: number) => {
                      setColumnHeight(value);
                    }}
                    isDisabled={isSlidersDisabled}
                    editType={EEditType.LENGTH}
                  />
                </div>
              </div>
            </CollapsibleSection>
          </div>
        )}
      </div>

      {isSavingSignature && <LoadingInfo />}

      <PreviewActionPanel
        visible={!isSavingSignature}
        onClose={closeSettings}
        onSave={handleSave}
        isVisibleOnlyPreview={isVisibleOnlyPreview}
      />
    </div>
  );
};
