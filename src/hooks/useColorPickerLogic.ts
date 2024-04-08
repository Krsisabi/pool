import { useState, useCallback } from "react";

interface ColorPickerLogicParams {
  initialPosition: { x: number; y: number };
  onSelectColor: (color: string) => void;
}

export const useColorPickerLogic = ({
  initialPosition,
  onSelectColor,
}: ColorPickerLogicParams) => {
  const [pickerPosition] = useState<{
    x: number;
    y: number;
  }>(initialPosition);

  const handleColorChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedColor = event.target.value;
      onSelectColor(selectedColor);
    },
    [onSelectColor]
  );

  return {
    handleColorChange,
    pickerPosition,
  };
};
