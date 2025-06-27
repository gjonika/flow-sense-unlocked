
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          AI-Powered Priorities
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex justify-center items-center h-32">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-olive animate-spin mb-2" />
          <p className="text-sm text-muted-foreground">Analyzing your projects...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
