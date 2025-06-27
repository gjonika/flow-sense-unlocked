
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Circle, Eye, ExternalLink, CalendarIcon, Plus, X, Edit } from 'lucide-react';
import { TaskWithProject } from '@/hooks/useTaskManagement';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskListProps {
  filteredAndSortedTasks: TaskWithProject[];
  allTasksLength: number;
  onToggleTask: (task: TaskWithProject) => void;
  onViewTaskDetails: (task: TaskWithProject) => void;
  onGoToProject: (projectId: string) => void;
  onSaveTaskDueDate: (task: TaskWithProject, selectedDate?: Date) => void;
  onEditTask: (task: TaskWithProject) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  filteredAndSortedTasks,
  allTasksLength,
  onToggleTask,
  onViewTaskDetails,
  onGoToProject,
  onSaveTaskDueDate,
  onEditTask,
}) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleEditTaskDueDate = (taskId: string, currentDueDate?: string) => {
    setEditingTaskId(taskId);
    setSelectedDate(currentDueDate ? new Date(currentDueDate) : undefined);
  };

  const handleSaveTaskDueDate = async (task: TaskWithProject) => {
    await onSaveTaskDueDate(task, selectedDate);
    setEditingTaskId(null);
    setSelectedDate(undefined);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Tasks ({filteredAndSortedTasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <Circle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground">
              {allTasksLength === 0 
                ? "No AI-generated tasks available. Create some tasks in your projects first."
                : "Try adjusting your filters to see more tasks."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedTasks.map((task) => (
              <div
                key={`${task.projectId}-${task.id}`}
                className={cn(
                  "flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-all duration-300",
                  task.completed && "opacity-60 animate-[slideDown_0.3s_ease-out] order-last"
                )}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggleTask(task)}
                  className="mt-1"
                />
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h3>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    {task.category && (
                      <Badge variant="outline" className="text-xs">
                        {task.category}
                      </Badge>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className={`text-sm text-muted-foreground ${task.completed ? 'line-through' : ''}`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="font-medium">Project: {task.projectName}</span>
                    
                    {/* Due Date Section with Calendar */}
                    {editingTaskId === task.id ? (
                      <div className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                "h-6 text-xs justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-3 w-3" />
                              {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Pick date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <Button
                          size="sm"
                          onClick={() => handleSaveTaskDueDate(task)}
                          className="h-6 px-2 text-xs"
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTaskId(null)}
                          className="h-6 px-2 text-xs"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTaskDueDate(task.id, task.dueDate)}
                        className="h-6 px-2 text-xs flex items-center gap-1"
                      >
                        {task.dueDate ? (
                          <>
                            <CalendarIcon className="h-3 w-3" />
                            Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3" />
                            Add due date
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditTask(task)}
                    className="shrink-0"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewTaskDetails(task)}
                    className="shrink-0"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onGoToProject(task.projectId)}
                    className="shrink-0"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Project
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
