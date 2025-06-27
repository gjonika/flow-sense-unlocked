
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingInsights: React.FC = () => {
  return (
    <div className="space-y-4" data-testid="loading-insights">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
};

export default LoadingInsights;
