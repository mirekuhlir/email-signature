import { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import AdvancedColorPicker from './advanced-color-picker';
import { Typography } from './typography';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { useSignatureStore } from '@/src/store/content-edit-add-store';

const DEFAULT_COLOR = 'rgb(128,128,128)';

interface Props {
  initColor: string;
  onChange: (color: string | undefined) => void;
  label: string;
  isResetToTransparent?: boolean;
}

export const EditColor = (props: Props) => {
  const { initColor, onChange, label, isResetToTransparent } = props;
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>(
    initColor || DEFAULT_COLOR,
  );
  const { setContentEdit } = useContentEditStore();
  const { getColors, addColor } = useSignatureStore();

  const [localInitColor, setLocalInitColor] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!localInitColor) {
      setLocalInitColor(initColor || 'transparent');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initColor]);

  const usedColors = getColors();

  return (
    <div>
      <Typography variant="labelBase">{label}</Typography>

      {!isColorPickerOpen && (
        <div className="flex gap-2 items-end">
          <div
            className="shadow-md w-10 h-10 rounded-md"
            style={{
              backgroundColor: currentColor,
            }}
          />
          <Button
            onClick={() => {
              setContentEdit({
                subEdit: 'edit-color',
              });
              setIsColorPickerOpen(true);
            }}
          >
            Edit color
          </Button>
        </div>
      )}

      {isColorPickerOpen && currentColor && (
        <div className="bg-white rounded-lg shadow-lg mx-auto">
          <AdvancedColorPicker
            initColor={currentColor}
            onChange={(color) => {
              onChange(color);
              setCurrentColor(color);
            }}
            usedColors={usedColors}
          />

          <div className="p-6">
            <div className="mb-6">
              {isResetToTransparent && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setContentEdit({
                      subEdit: null,
                    });
                    setCurrentColor('transparent');
                    onChange('transparent');
                    setIsColorPickerOpen(false);
                  }}
                >
                  Reset to transparent
                </Button>
              )}
            </div>
            <div className="flex justify-between">
              <div className="flex">
                <Button
                  variant="outline"
                  onClick={() => {
                    setContentEdit({
                      subEdit: null,
                    });

                    if (localInitColor) {
                      setCurrentColor(localInitColor);
                      onChange(localInitColor);
                    }

                    setIsColorPickerOpen(false);
                  }}
                >
                  Close
                </Button>
              </div>
              <Button
                variant="blue"
                onClick={() => {
                  setContentEdit({
                    subEdit: null,
                  });

                  if (currentColor && currentColor !== 'transparent') {
                    addColor(currentColor);
                  }

                  setIsColorPickerOpen(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
