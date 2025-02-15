import { useState } from "react";
import { Button } from "@/components/ui/button";
import AdvancedColorPicker from "./advanced-color-picker";
import { Typography } from "./typography";

interface Props {
  initColor: string;
  onChange: (color: string) => void;
}

export const EditColor = (props: Props) => {
  const { initColor, onChange } = props;
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  // TODO
  const [currentColor, setCurrentColor] = useState(initColor);

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
          <Button onClick={() => setIsColorPickerOpen(true)}>Edit color</Button>
        </div>
      )}

      {isColorPickerOpen && (
        <div>
          <AdvancedColorPicker
            initColor={initColor}
            onChange={(color) => {
              onChange(color);
              setCurrentColor(color);
            }}
            onClose={() => setIsColorPickerOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
