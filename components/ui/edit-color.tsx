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
  const [currentColor, setCurrentColor] = useState(initColor);

  return (
    <div>
      <Typography variant="labelBase">Text color</Typography>

      {!isColorPickerOpen && (
        <div className="flex gap-2">
          <div
            style={{
              backgroundColor: currentColor,
              width: "50px",
              height: "50px",
              border: "1px solid black",
            }}
          />
          <Button onClick={() => setIsColorPickerOpen(true)}>Edit color</Button>
        </div>
      )}

      <div>
        {isColorPickerOpen && (
          <div>
            <AdvancedColorPicker
              initColor={initColor}
              onChange={(color) => {
                onChange(color);
                setCurrentColor(color);
              }}
            />
            <Button onClick={() => setIsColorPickerOpen(false)}>Close</Button>
          </div>
        )}
      </div>
    </div>
  );
};
