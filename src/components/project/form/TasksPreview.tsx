
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ProjectFormValues } from '@/components/ProjectForm';

const TasksPreview: React.FC = () => {
  const { watch, setValue } = useFormContext<ProjectFormValues>();
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const tasks = watch('tasks') || [];
  
  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setValue('tasks', updatedTasks);
  };

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (tasks.length === 0) return null;
  
  return (
    <>
      {/* Info text */}
      <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p><strong>Note:</strong> Generated tasks are automatically added to your project's main Tasks section. You can generate multiple times to add more tasks - existing ones won't be replaced.</p>
      </div>
      
      {/* Generated Tasks Preview */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Tasks Preview ({tasks.length})</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {tasks.slice(-5).map((task) => (
            <Card key={task.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h5>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      {task.category && (
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                      )}
                      {task.description && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTaskExpansion(task.id)}
                          className="h-6 w-6 p-0"
                        >
                          {expandedTasks.has(task.id) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                    {task.description && expandedTasks.has(task.id) && (
                      <p className={`text-xs text-muted-foreground ${task.completed ? 'line-through' : ''} bg-muted/50 p-2 rounded`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {tasks.length > 5 && (
            <p className="text-xs text-muted-foreground text-center">
              Showing last 5 tasks. All {tasks.length} tasks will be saved to your project.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default TasksPreview;
