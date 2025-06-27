
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ErrorState: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">AI-Powered Priorities</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="p-4 bg-muted/50 rounded-md">
          <p className="text-sm text-muted-foreground">
            Priorities could not be generated at the moment. Please try again later.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
