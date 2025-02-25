import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AdvancedColorPicker from "./advanced-color-picker";
import { Typography } from "./typography";
import { useContentEditStore } from "../signature-detail/store/content-edit-add-path-store";

interface Props {
  initColor: string;
  onChange: (color: string) => void;
}

export const EditColor = (props: Props) => {
  const { initColor, onChange } = props;
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(initColor);
  const { setContentEdit } = useContentEditStore();

  const [localInitColor, setLocalInitColor] = useState<string | null>(null);

  useEffect(() => {
    if (!localInitColor) {
      setLocalInitColor(initColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initColor]);

  console.warn("initColor", initColor);

  return (
    <div>
      <Typography variant="labelBase">Text color</Typography>

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
                subEdit: "edit-color",
              });
              setIsColorPickerOpen(true);
            }}
          >
            Edit color
          </Button>
        </div>
      )}

      {isColorPickerOpen && (
        <div className="bg-white rounded-lg shadow-lg mx-auto">
          <AdvancedColorPicker
            initColor={initColor}
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
