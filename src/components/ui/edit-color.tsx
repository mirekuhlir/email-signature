import { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import AdvancedColorPicker from './advanced-color-picker';
import { Typography } from './typography';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';

const DEFAULT_COLOR = 'rgb(128,128,128)';

interface Props {
  initColor: string;
  onChange: (color: string | undefined) => void;
  label: string;
}

export const EditColor = (props: Props) => {
  const { initColor, onChange, label } = props;
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>(
    initColor || DEFAULT_COLOR,
  );
  const { setContentEdit } = useContentEditStore();

  const [localInitColor, setLocalInitColor] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!localInitColor) {
      setLocalInitColor(initColor || 'transparent');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initColor]);

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
          />

          <div className="flex justify-between p-6">
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
            <Button
              variant="blue"
              onClick={() => {
                setContentEdit({
                  subEdit: null,
                });

                setIsColorPickerOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
