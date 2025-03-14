/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { Button } from '@/src/components/ui/button';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { Typography } from '@/src/components/ui/typography';
import Slider from '@/src/components/ui/slider';
import { SavingInfo } from '../content-edit/content-edit';
import { EditColor } from '../../ui/edit-color';

export const ColumnSettings = (props: any) => {
  const { columnPathToEdit, signatureId, isSignedIn, templateSlug } = props;

  const { rows, setContent, saveSignatureContentRow } = useSignatureStore();
  const { setContentEdit, contentEdit } = useContentEditStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [initContent, setInitContent] = useState<any>(null);
  const [isSavingSignature, setIsSavingSignature] = useState(false);

  const [paddingTop, setPaddingTop] = useState('10');
  const [paddingRight, setPaddingRight] = useState('10');
  const [paddingBottom, setPaddingBottom] = useState('10');
  const [paddingLeft, setPaddingLeft] = useState('10');
  const [rightBorderWidth, setRightBorderWidth] = useState('0');
  const [rightBorderColor, setRightBorderColor] = useState('rgb(0, 0, 0)');

  const path = `${columnPathToEdit}.style`;
  const originalStyle = useMemo(() => get(rows, path) || {}, [rows, path]);

  useEffect(() => {
    if (originalStyle.padding) {
      const paddingValues = originalStyle.padding
        .split(' ')
        .map((val: string) => val.replace('px', ''));

      setPaddingTop(paddingValues[0]);
      setPaddingRight(paddingValues[1]);
      setPaddingBottom(paddingValues[2]);
      setPaddingLeft(paddingValues[3]);

      if (!initContent) {
        setInitContent(originalStyle);
      }
    }

    if (originalStyle.borderRightWidth) {
      setRightBorderWidth(originalStyle.borderRightWidth.replace('px', ''));
    }

    if (originalStyle.borderRightColor) {
      setRightBorderColor(originalStyle.borderRightColor);
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

  const updateBorder = () => {
    const currentStyle = get(rows, path) || {};

    setContent(path, {
      ...currentStyle,
      borderRightWidth: `${rightBorderWidth}px`,
      borderRightColor: rightBorderColor,
      borderRightStyle: rightBorderWidth === '0' ? 'none' : 'solid',
    });
  };

  useEffect(() => {
    if (paddingTop && paddingRight && paddingBottom && paddingLeft) {
      updatePadding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paddingTop, paddingRight, paddingBottom, paddingLeft]);

  useEffect(() => {
    updateBorder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightBorderWidth, rightBorderColor]);

  const saveChanges = () => {
    const paddingValue = `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`;

    setContent(path, {
      ...originalStyle,
      padding: paddingValue,
      borderRightWidth: `${rightBorderWidth}px`,
      borderRightColor: rightBorderColor,
      borderRightStyle: rightBorderWidth === '0' ? 'none' : 'solid',
    });
  };

  const closeSettings = () => {
    setContent(path, initContent);
    setContentEdit({
      columnPath: null,
    });
  };

  return (
    <div key={`settings-${columnPathToEdit}`} className="mt-6">
      <div ref={wrapperRef}>
        {!isSavingSignature && (
          <div className="pb-2">
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

            <hr className="border-t border-gray-400 mt-6 mb-6" />

            <div>
              <Typography variant="labelBase" className="mb-2">
                Right border width : {rightBorderWidth}px
              </Typography>
              <Slider
                min={0}
                max={10}
                step={1}
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

            <hr className="border-t border-gray-400 mt-6 mb-6" />

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
        )}
      </div>

      {isSavingSignature && <SavingInfo />}

      {!isSavingSignature && contentEdit.subEdit !== 'edit-color' && (
        <div className="flex flex-row w-full pb-6 pt-8 pt-2 justify-between">
          <Button variant="outline" onClick={closeSettings}>
            Cancel
          </Button>

          <Button
            variant="blue"
            size="md"
            onClick={async () => {
              saveChanges();

              if (!isSignedIn) {
                localStorage.setItem(templateSlug, JSON.stringify(rows));
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
                } finally {
                  setIsSavingSignature(false);
                }
              }
            }}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};
