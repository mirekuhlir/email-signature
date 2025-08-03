import { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import AdvancedColorPicker from './advanced-color-picker';
import { Typography } from './typography';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { useSignatureStore } from '@/src/store/content-edit-add-store';

const DEFAULT_COLOR = 'rgb(255,255,255)';

interface Props {
  initColor: string;
  onChange: (color: string | undefined) => void;
  label: string;
  sectionId: string;
  isResetToTransparent?: boolean;
}

export const EditColor = (props: Props) => {
  const { initColor, onChange, label, sectionId, isResetToTransparent } = props;
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>(
    initColor || DEFAULT_COLOR,
  );
  const { setContentEdit, addEditingSectionId, removeEditingSectionId } =
    useContentEditStore();
  const { addColor, colors } = useSignatureStore();

  const [localInitColor, setLocalInitColor] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!localInitColor) {
      setLocalInitColor(initColor || 'transparent');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initColor]);

  const usedColors = colors;

  return (
    <div>
      <Typography variant="labelBase">{label}</Typography>

      {!isColorPickerOpen && (
        <div className="flex gap-2 items-end">
          <div
            className="shadow-md w-10 h-10 rounded-md border border-gray-300"
            style={{
              backgroundColor: currentColor,
            }}
          />
          <Button
            onClick={() => {
              setContentEdit({
                subEdit: 'edit-color',
              });
              addEditingSectionId(sectionId);
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

          <div className="p-3">
            {isResetToTransparent && (
              <div className="mb-6 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setContentEdit({
                      subEdit: null,
                    });
                    removeEditingSectionId(sectionId);
                    setCurrentColor('transparent');
                    onChange('transparent');
                    setIsColorPickerOpen(false);
                  }}
                >
                  Reset to transparent
                </Button>
              </div>
            )}

            <div className="flex justify-between px-3">
              <div className="flex">
                <Button
                  variant="outline"
                  onClick={() => {
                    setContentEdit({
                      subEdit: null,
                    });
                    removeEditingSectionId(sectionId);

                    if (localInitColor) {
                      setCurrentColor(localInitColor);
                      onChange(localInitColor);
                    }

                    setIsColorPickerOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
              <Button
                variant="blue"
                onClick={() => {
                  setContentEdit({
                    subEdit: null,
                  });
                  removeEditingSectionId(sectionId);

                  if (currentColor && currentColor !== 'transparent') {
                    addColor(currentColor);
                  }

                  setIsColorPickerOpen(false);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
