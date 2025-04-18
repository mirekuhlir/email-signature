/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { Typography } from '@/src/components/ui/typography';
import Slider from '@/src/components/ui/slider';
import SelectBase from '@/src/components/ui/select-base';
import { EditColor } from '../../ui/edit-color';
import { useToast } from '@/src/components/ui/toast';
import { CollapsibleSection } from '@/src/components/ui/collapsible-section';
import PreviewActionPanel from '../preview-action-panel';
import { LoadingInfo } from '../content-edit/content-edit';

export const ColumnSettings = (props: any) => {
  const { columnPathToEdit, signatureId, isSignedIn } = props;
  const { toast } = useToast();

  const { rows, setContent, saveSignatureContentRow } = useSignatureStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [initContent, setInitContent] = useState<any>(null);
  const [isSavingSignature, setIsSavingSignature] = useState(false);

  const [paddingTop, setPaddingTop] = useState('0');
  const [paddingRight, setPaddingRight] = useState('0');
  const [paddingBottom, setPaddingBottom] = useState('0');
  const [paddingLeft, setPaddingLeft] = useState('0');
  const [verticalAlign, setVerticalAlign] = useState('top');

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

    if (originalStyle.borderRadius) {
      setBorderRadius(originalStyle.borderRadius);
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

  const updateBorderRadius = () => {
    const currentStyle = get(rows, path) || {};

    setContent(path, {
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
    updateBorderRadius();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borderRadius]);

  const closeSettings = () => {
    setContent(path, initContent);
    setContentEdit({
      columnPath: null,
    });
  };

  const handleSave = async () => {
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
            <CollapsibleSection title="Alignment and background">
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
              <div>
                <div className="pb-4">
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
                </div>

                <div className="pb-4">
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
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Inner space">
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

                <div className="pb-4">
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
            </CollapsibleSection>

            <CollapsibleSection title="Borders">
              <div>
                <Typography variant="labelBase" className="mb-2">
                  Top border width : {borderWidths.top}px
                </Typography>
                <Slider
                  min={0}
                  max={10}
                  value={Number(borderWidths.top)}
                  onChange={(value: number) => {
                    setBorderWidths((prev) => ({
                      ...prev,
                      top: value.toString(),
                    }));
                  }}
                />
              </div>

              {borderWidths.top !== '0' && (
                <EditColor
                  initColor={borderColors.top}
                  label="Top border color"
                  onChange={(color) => {
                    if (color) {
                      setBorderColors((prev) => ({ ...prev, top: color }));
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
                  value={Number(borderWidths.right)}
                  onChange={(value: number) => {
                    setBorderWidths((prev) => ({
                      ...prev,
                      right: value.toString(),
                    }));
                  }}
                />
              </div>

              {borderWidths.right !== '0' && (
                <EditColor
                  initColor={borderColors.right}
                  label="Right border color"
                  onChange={(color) => {
                    if (color) {
                      setBorderColors((prev) => ({ ...prev, right: color }));
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
                  value={Number(borderWidths.bottom)}
                  onChange={(value: number) => {
                    setBorderWidths((prev) => ({
                      ...prev,
                      bottom: value.toString(),
                    }));
                  }}
                />
              </div>

              {borderWidths.bottom !== '0' && (
                <EditColor
                  initColor={borderColors.bottom}
                  label="Bottom border color"
                  onChange={(color) => {
                    if (color) {
                      setBorderColors((prev) => ({ ...prev, bottom: color }));
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
                  value={Number(borderWidths.left)}
                  onChange={(value: number) => {
                    setBorderWidths((prev) => ({
                      ...prev,
                      left: value.toString(),
                    }));
                  }}
                />
              </div>

              {borderWidths.left !== '0' && (
                <EditColor
                  initColor={borderColors.left}
                  label="Left border color"
                  onChange={(color) => {
                    if (color) {
                      setBorderColors((prev) => ({ ...prev, left: color }));
                    }
                  }}
                />
              )}
            </CollapsibleSection>
          </div>
        )}
      </div>

      {isSavingSignature && <LoadingInfo />}

      <PreviewActionPanel
        visible={!isSavingSignature}
        onClose={closeSettings}
        onSave={handleSave}
      />
    </div>
  );
};
