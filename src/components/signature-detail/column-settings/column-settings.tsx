/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { Typography } from '@/src/components/ui/typography';
import Slider from '@/src/components/ui/slider';
import SelectBase from '@/src/components/ui/select-base';
import { EditColor } from '../../ui/edit-color';
import { Hr } from '../../ui/hr';
import { useToast } from '@/src/components/ui/toast';
import { CollapsibleSection } from '@/src/components/ui/collapsible-section';
import PreviewActionPanel from '../preview-action-panel';
import { LoadingInfo } from '../content-edit/content-edit';

export const ColumnSettings = (props: any) => {
  const { columnPathToEdit, signatureId, isSignedIn } = props;
  const { toast } = useToast();

  const { rows, setContent, saveSignatureContentRow } = useSignatureStore();
  const { setContentEdit, contentEdit } = useContentEditStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [initContent, setInitContent] = useState<any>(null);
  const [isSavingSignature, setIsSavingSignature] = useState(false);

  const [paddingTop, setPaddingTop] = useState('0');
  const [paddingRight, setPaddingRight] = useState('0');
  const [paddingBottom, setPaddingBottom] = useState('0');
  const [paddingLeft, setPaddingLeft] = useState('0');
  const [verticalAlign, setVerticalAlign] = useState('middle');

  const [topBorderWidth, setTopBorderWidth] = useState('0');
  const [topBorderColor, setTopBorderColor] = useState('rgb(0, 0, 0)');
  const [rightBorderWidth, setRightBorderWidth] = useState('0');
  const [rightBorderColor, setRightBorderColor] = useState('rgb(0, 0, 0)');
  const [bottomBorderWidth, setBottomBorderWidth] = useState('0');
  const [bottomBorderColor, setBottomBorderColor] = useState('rgb(0, 0, 0)');
  const [leftBorderWidth, setLeftBorderWidth] = useState('0');
  const [leftBorderColor, setLeftBorderColor] = useState('rgb(0, 0, 0)');

  const [borderRadius, setBorderRadius] = useState('0');

  const path = `${columnPathToEdit}.style`;
  const originalStyle = useMemo(() => get(rows, path) || {}, [rows, path]);

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

    if (originalStyle.borderTopWidth) {
      setTopBorderWidth(originalStyle.borderTopWidth.replace('px', ''));
    }

    if (originalStyle.borderTopColor) {
      setTopBorderColor(originalStyle.borderTopColor);
    }

    if (originalStyle.borderRightWidth) {
      setRightBorderWidth(originalStyle.borderRightWidth.replace('px', ''));
    }

    if (originalStyle.borderRightColor) {
      setRightBorderColor(originalStyle.borderRightColor);
    }

    if (originalStyle.borderBottomWidth) {
      setBottomBorderWidth(originalStyle.borderBottomWidth.replace('px', ''));
    }

    if (originalStyle.borderBottomColor) {
      setBottomBorderColor(originalStyle.borderBottomColor);
    }

    if (originalStyle.borderLeftWidth) {
      setLeftBorderWidth(originalStyle.borderLeftWidth.replace('px', ''));
    }

    if (originalStyle.borderLeftColor) {
      setLeftBorderColor(originalStyle.borderLeftColor);
    }

    if (originalStyle.borderRadius) {
      setBorderRadius(originalStyle.borderRadius.replace('px', ''));
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
      borderTopWidth: `${topBorderWidth}px`,
      borderTopColor: topBorderColor,
      borderTopStyle: topBorderWidth === '0' ? 'none' : 'solid',

      borderRightWidth: `${rightBorderWidth}px`,
      borderRightColor: rightBorderColor,
      borderRightStyle: rightBorderWidth === '0' ? 'none' : 'solid',

      borderBottomWidth: `${bottomBorderWidth}px`,
      borderBottomColor: bottomBorderColor,
      borderBottomStyle: bottomBorderWidth === '0' ? 'none' : 'solid',

      borderLeftWidth: `${leftBorderWidth}px`,
      borderLeftColor: leftBorderColor,
      borderLeftStyle: leftBorderWidth === '0' ? 'none' : 'solid',
    });
  };

  const updateBorderRadius = () => {
    const currentStyle = get(rows, path) || {};

    setContent(path, {
      ...currentStyle,
      borderRadius: `${borderRadius}px`,
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
  }, [
    topBorderWidth,
    topBorderColor,
    rightBorderWidth,
    rightBorderColor,
    bottomBorderWidth,
    bottomBorderColor,
    leftBorderWidth,
    leftBorderColor,
  ]);

  useEffect(() => {
    updateBorderRadius();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borderRadius]);

  const saveChanges = () => {
    const paddingValue = `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`;

    // Create the style object explicitly
    const newStyle = {
      ...originalStyle,
      padding: paddingValue,
      verticalAlign: verticalAlign,

      borderTopWidth: topBorderWidth,
      borderTopColor: topBorderColor,
      borderTopStyle: topBorderWidth === '0' ? 'none' : 'solid',

      borderRightWidth: rightBorderWidth,
      borderRightColor: rightBorderColor,
      borderRightStyle: rightBorderWidth === '0' ? 'none' : 'solid',

      borderBottomWidth: bottomBorderWidth,
      borderBottomColor: bottomBorderColor,
      borderBottomStyle: bottomBorderWidth === '0' ? 'none' : 'solid',

      borderLeftWidth: leftBorderWidth,
      borderLeftColor: leftBorderColor,
      borderLeftStyle: leftBorderWidth === '0' ? 'none' : 'solid',

      borderRadius: borderRadius,
    };

    setContent(path, newStyle);
  };

  const closeSettings = () => {
    setContent(path, initContent);
    setContentEdit({
      columnPath: null,
    });
  };

  const handleSave = async () => {
    saveChanges();

    if (!isSignedIn) {
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
          duration: 5000,
        });
      } finally {
        setIsSavingSignature(false);
      }
    }
  };

  return (
    <div key={`settings-${columnPathToEdit}`} className="mt-6 pb-24">
      <div ref={wrapperRef}>
        {!isSavingSignature && (
          <div className="pb-2">
            <CollapsibleSection>
              <div className="grid grid-cols-1 gap-6">
                <div className="pb-4">
                  <Typography variant="labelBase" className="mb-2">
                    Vertical alignment
                  </Typography>
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
              </div>
            </CollapsibleSection>

            <Hr />

            <CollapsibleSection>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Typography variant="labelBase" className="mb-2">
                    Top padding : {paddingTop}px
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
                    Right padding : {paddingRight}px
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
                    Bottom padding : {paddingBottom}px
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

                <div className="pb-4">
                  <Typography variant="labelBase" className="mb-2">
                    Left padding : {paddingLeft}px
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
            </CollapsibleSection>

            <Hr />

            <CollapsibleSection>
              <div>
                <Typography variant="labelBase" className="mb-2">
                  Top border width : {topBorderWidth}px
                </Typography>
                <Slider
                  min={0}
                  max={10}
                  value={Number(topBorderWidth)}
                  onChange={(value: number) => {
                    setTopBorderWidth(value.toString());
                  }}
                />
              </div>

              {topBorderWidth !== '0' && (
                <EditColor
                  initColor={topBorderColor}
                  label="Top border color"
                  onChange={(color) => {
                    if (color) {
                      setTopBorderColor(color);
                    }
                  }}
                />
              )}

              <div className="mt-4">
                <Typography variant="labelBase" className="mb-2">
                  Right border width : {rightBorderWidth}px
                </Typography>
                <Slider
                  min={0}
                  max={10}
                  value={Number(rightBorderWidth)}
                  onChange={(value: number) => {
                    setRightBorderWidth(value.toString());
                  }}
                />
              </div>

              {rightBorderWidth !== '0' && (
                <EditColor
                  initColor={rightBorderColor}
                  label="Right border color"
                  onChange={(color) => {
                    if (color) {
                      setRightBorderColor(color);
                    }
                  }}
                />
              )}

              <div className="mt-4">
                <Typography variant="labelBase" className="mb-2">
                  Bottom border width : {bottomBorderWidth}px
                </Typography>
                <Slider
                  min={0}
                  max={10}
                  value={Number(bottomBorderWidth)}
                  onChange={(value: number) => {
                    setBottomBorderWidth(value.toString());
                  }}
                />
              </div>

              {bottomBorderWidth !== '0' && (
                <EditColor
                  initColor={bottomBorderColor}
                  label="Bottom border color"
                  onChange={(color) => {
                    if (color) {
                      setBottomBorderColor(color);
                    }
                  }}
                />
              )}

              <div className="mt-4">
                <Typography variant="labelBase" className="mb-2">
                  Left border width : {leftBorderWidth}px
                </Typography>
                <Slider
                  min={0}
                  max={10}
                  value={Number(leftBorderWidth)}
                  onChange={(value: number) => {
                    setLeftBorderWidth(value.toString());
                  }}
                />
              </div>

              {leftBorderWidth !== '0' && (
                <EditColor
                  initColor={leftBorderColor}
                  label="Left border color"
                  onChange={(color) => {
                    if (color) {
                      setLeftBorderColor(color);
                    }
                  }}
                />
              )}

              <Hr className="mt-4 mb-4" />

              <div className="pb-4">
                <Typography variant="labelBase" className="mb-2">
                  Border radius : {borderRadius}px
                </Typography>
                <Slider
                  min={0}
                  max={20}
                  value={Number(borderRadius)}
                  onChange={(value: number) => {
                    setBorderRadius(value.toString());
                  }}
                />
              </div>
            </CollapsibleSection>

            <Hr />

            <CollapsibleSection>
              <EditColor
                initColor={originalStyle.backgroundColor}
                label="Background color"
                isResetToTransparent
                onChange={(color) => {
                  setContent(path, {
                    ...originalStyle,
                    backgroundColor: color,
                  });
                }}
              />
            </CollapsibleSection>
          </div>
        )}
      </div>

      {isSavingSignature && <LoadingInfo />}

      <PreviewActionPanel
        visible={!isSavingSignature}
        onClose={closeSettings}
        onSave={handleSave}
        isSignedIn={isSignedIn}
        isVisibleOnlyPreview={Boolean(contentEdit.subEdit)}
      />
    </div>
  );
};
