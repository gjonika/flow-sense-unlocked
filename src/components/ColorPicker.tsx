
import { useEffect, useState } from "react";
import { useThemeStore, applyThemeColor } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings } from "lucide-react";

interface ColorPickerProps {
  supplierId?: string;
}

export function ColorPicker({ supplierId = "default" }: ColorPickerProps) {
  const { getColor, setColor } = useThemeStore();
  const [currentColor, setCurrentColor] = useState<string>(getColor(supplierId));

  // Apply theme color on component mount and when changed
  useEffect(() => {
    setCurrentColor(getColor(supplierId));
    applyThemeColor(getColor(supplierId));
  }, [supplierId, getColor]);

  // Handle color change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    setColor(supplierId, newColor);
    applyThemeColor(newColor);
  };

  // Define some preset colors
  const presetColors = [
    "#3b82f6", // blue
    "#32c887", // green
    "#ef4444", // red
    "#8b5cf6", // purple
    "#0ea5e9", // sky blue
    "#f97316", // orange
    "#ec4899" // pink
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full border-2 hover:opacity-90"
          style={{ backgroundColor: currentColor, borderColor: currentColor }}
          title="Customize Theme Color"
        >
          <Settings className="h-4 w-4 text-white" />
          <span className="sr-only">Pick a theme color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="color">Theme Color</Label>
            <Input
              id="color"
              type="color"
              value={currentColor}
              onChange={handleColorChange}
              className="h-10 cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <Label>Presets</Label>
            <div className="flex flex-wrap gap-2">
              {presetColors.map((color) => (
                <Button
                  key={color}
                  style={{ backgroundColor: color }}
                  className="h-8 w-8 rounded-full p-0"
                  onClick={() => {
                    setCurrentColor(color);
                    setColor(supplierId, color);
                    applyThemeColor(color);
                  }}
                >
                  <span className="sr-only">{color}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
