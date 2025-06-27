
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Circle, CheckCircle2 } from 'lucide-react';

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
}

interface TaskStatsCardsProps {
  taskStats: TaskStats;
}

const TaskStatsCards: React.FC<TaskStatsCardsProps> = ({ taskStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Circle className="h-4 w-4 text-blue-600" />
            <div className="ml-2">
              <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold">{taskStats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <div className="ml-2">
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{taskStats.completed}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Circle className="h-4 w-4 text-orange-600" />
            <div className="ml-2">
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{taskStats.pending}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Circle className="h-4 w-4 text-red-600" />
            <div className="ml-2">
              <p className="text-sm font-medium text-muted-foreground">High Priority</p>
              <p className="text-2xl font-bold">{taskStats.highPriority}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStatsCards;
