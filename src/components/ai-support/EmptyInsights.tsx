
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const EmptyInsights: React.FC = () => {
  return (
    <Card className="p-6 text-center bg-muted/30">
      <CardContent className="pt-6">
        <p className="text-muted-foreground">
          No AI insights available. Click 'Refresh Insights' to generate personalized recommendations for your projects.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyInsights;
