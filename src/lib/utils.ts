
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Baltic Sea color palette
const BALTIC_COLORS = [
  '#4B6C64', // Pine
  '#5C8A87', // Sea
  '#DAD8C4', // Sand
  '#F1F3F2', // Fog
  '#3A4F52'  // Deep
];

// Get a color from the Baltic palette by index (with wrap-around)
export function getBalticColor(index: number): string {
  return BALTIC_COLORS[index % BALTIC_COLORS.length];
}
