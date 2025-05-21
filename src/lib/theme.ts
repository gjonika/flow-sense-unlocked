
import { create } from 'zustand';

interface ThemeState {
  colors: {
    [supplierId: string]: string;
  };
  setColor: (supplierId: string, color: string) => void;
  getColor: (supplierId: string) => string;
  defaultColor: string;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  colors: {},
  defaultColor: '#3b82f6', // Default blue
  setColor: (supplierId, color) => set((state) => ({
    colors: {
      ...state.colors,
      [supplierId]: color
    }
  })),
  getColor: (supplierId) => {
    const state = get();
    return state.colors[supplierId] || state.defaultColor;
  }
}));

// Utility function to apply color to CSS variable
export const applyThemeColor = (color: string) => {
  document.documentElement.style.setProperty('--theme-color', color);
  document.documentElement.style.setProperty('--theme-color-light', `${color}20`);
};
