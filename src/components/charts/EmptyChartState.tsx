
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface EmptyChartStateProps {
  message?: string;
  height?: string;
}

const EmptyChartState: React.FC<EmptyChartStateProps> = ({
  message = "Not enough data to visualize yet",
  height = "h-[250px]"
}) => {
  return (
    <div className={`${height} flex items-center justify-center`}>
      <div className="text-center text-muted-foreground">
        <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default EmptyChartState;
