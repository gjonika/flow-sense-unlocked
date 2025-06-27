
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskWithProject } from '@/hooks/useTaskManagement';
import { format } from 'date-fns';

interface TaskDetailsModalProps {
  selectedTask: TaskWithProject | null;
  onClose: () => void;
  onToggleTask: (task: TaskWithProject) => void;
  onGoToProject: (projectId: string) => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  selectedTask,
  onClose,
  onToggleTask,
  onGoToProject,
}) => {
  if (!selectedTask) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                {selectedTask.title}
                <Badge className={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Project: {selectedTask.projectName}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedTask.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">Category</h4>
              <p className="text-sm text-muted-foreground">{selectedTask.category || 'None'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Status</h4>
              <p className="text-sm text-muted-foreground">
                {selectedTask.completed ? 'Completed' : 'Pending'}
              </p>
            </div>
            {selectedTask.dueDate && (
              <div>
                <h4 className="font-medium mb-1">Due Date</h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedTask.dueDate), 'MMMM d, yyyy')}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => {
                onToggleTask(selectedTask);
                onClose();
              }}
              variant={selectedTask.completed ? 'outline' : 'default'}
            >
              {selectedTask.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onGoToProject(selectedTask.projectId);
                onClose();
              }}
            >
              View Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetailsModal;
