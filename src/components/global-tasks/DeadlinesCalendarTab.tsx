
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

const DeadlinesCalendarTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deadlines Calendar View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Deadlines Calendar View</h3>
          <p className="text-muted-foreground">
            Calendar view for deadlines will be implemented here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeadlinesCalendarTab;
