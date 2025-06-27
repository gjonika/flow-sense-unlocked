
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportChartAsPNG, exportDataAsCSV } from '@/utils/chartStyles';

interface ChartExportButtonsProps {
  chartId: string;
  data: any[];
  filename: string;
  className?: string;
}

const ChartExportButtons: React.FC<ChartExportButtonsProps> = ({
  chartId,
  data,
  filename,
  className = ''
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportChartAsPNG(chartId, filename)}
        className="flex items-center gap-1"
      >
        <Download className="h-3 w-3" />
        PNG
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportDataAsCSV(data, filename)}
        className="flex items-center gap-1"
      >
        <Download className="h-3 w-3" />
        CSV
      </Button>
    </div>
  );
};

export default ChartExportButtons;
