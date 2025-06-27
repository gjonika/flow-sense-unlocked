
// Shared chart styling and export utilities
import { toPng } from 'html-to-image';
import Papa from 'papaparse';

// Consistent color palette based on Tailwind theme
export const chartColors = {
  // Project status colors
  idea: '#DAD8C4', // baltic-sand
  'in-progress': '#4B6C64', // baltic-pine
  'in-review': '#5C8A87', // baltic-sea
  completed: '#3A4F52', // baltic-deep
  paused: '#F1F3F2', // baltic-fog
  
  // Additional colors for variety
  primary: '#4B6C64',
  secondary: '#5C8A87',
  accent: '#DAD8C4',
  muted: '#F1F3F2',
  warning: '#eab308',
  success: '#22c55e',
  error: '#ef4444',
  
  // Gradient colors for charts
  gradients: [
    '#4B6C64', '#5C8A87', '#DAD8C4', '#3A4F52', '#F1F3F2',
    '#22c55e', '#eab308', '#ef4444', '#60a5fa', '#a78bfa'
  ]
};

// Export chart as PNG
export const exportChartAsPNG = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Chart element not found');
    }
    
    const dataUrl = await toPng(element, {
      quality: 1.0,
      backgroundColor: '#ffffff',
      pixelRatio: 2,
    });
    
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting chart:', error);
  }
};

// Export data as CSV
export const exportDataAsCSV = (data: any[], filename: string) => {
  try {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting CSV:', error);
  }
};

// Common chart props
export const commonChartProps = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
};

// Responsive breakpoints
export const chartBreakpoints = {
  mobile: 768,
  tablet: 1024,
};

// Get color by index with fallback
export const getChartColor = (index: number, type: 'gradient' | 'status' = 'gradient') => {
  if (type === 'gradient') {
    return chartColors.gradients[index % chartColors.gradients.length];
  }
  return chartColors.primary;
};

// Custom label formatters
export const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
export const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
export const formatNumber = (value: number) => value.toLocaleString();
