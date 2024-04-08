import React from "react";

interface ColorPickerProps {
  position: { x: number; y: number };
  onColorChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  position,
  onColorChange,
}) => {
  return (
    <input
      type="color"
      onChange={onColorChange}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
};
