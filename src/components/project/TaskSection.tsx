
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Circle, ChevronDownIcon, ChevronUpIcon, ChevronRight, Wand2, Loader2, Zap, Calendar, Plus, X } from 'lucide-react';
import { Project, AITask } from '@/lib/supabase';
import { generateTasksFromAnalysis, generateStructuredTasksFromAnalysis } from '@/services/aiService';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface TaskSectionProps {
  project: Project;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
}

const TaskSection: React.FC<TaskSectionProps> = ({ project, onUpdateProject }) => {
  const [showTasks, setShowTasks] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [isGeneratingStructured, setIsGeneratingStructured] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [taskDueDate, setTaskDueDate] = useState('');

  const hasTasks = project.tasks && project.tasks.length > 0;

  const handleToggleTask = async (taskId: string) => {
    if (!project.tasks) return;
    
    const updatedTasks = project.tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    try {
      await onUpdateProject(project.id, { tasks: updatedTasks });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleUpdateTaskDueDate = async (taskId: string, dueDate: string) => {
    if (!project.tasks) return;
    
    const updatedTasks = project.tasks.map(task => 
      task.id === taskId ? { ...task, dueDate: dueDate || undefined } : task
    );
    
    try {
      await onUpdateProject(project.id, { tasks: updatedTasks });
      setEditingTask(null);
      setTaskDueDate('');
      toast.success('Task due date updated');
    } catch (error) {
      console.error('Error updating task due date:', error);
      toast.error('Failed to update due date');
    }
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

  const startEditingDueDate = (taskId: string, currentDueDate?: string) => {
    setEditingTask(taskId);
    setTaskDueDate(currentDueDate ? format(new Date(currentDueDate), 'yyyy-MM-dd') : '');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateTasks = async () => {
    if (!project.analysisText?.trim()) {
      toast.error('No analysis text available');
      return;
    }
    
    setIsGeneratingTasks(true);
    
    try {
      const generatedTasks = await generateTasksFromAnalysis(project.analysisText, project.tasks || []);
      await onUpdateProject(project.id, { tasks: generatedTasks });
      toast.success('Basic tasks generated and added!');
    } catch (error) {
      console.error('Error generating tasks:', error);
      toast.error('Failed to generate tasks. Please try again.');
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const handleGenerateStructuredTasks = async () => {
    if (!project.analysisText?.trim()) {
      toast.error('No analysis text available');
      return;
    }
    
    setIsGeneratingStructured(true);
    
    try {
      const structuredTasks = await generateStructuredTasksFromAnalysis(project.analysisText, project.tasks || []);
      await onUpdateProject(project.id, { tasks: structuredTasks });
      toast.success('Structured tasks generated and added!');
    } catch (error) {
      console.error('Error generating structured tasks:', error);
      toast.error('Failed to generate structured tasks. Please try again.');
    } finally {
      setIsGeneratingStructured(false);
    }
  };

  return (
    <>
      {/* Analysis text and generate tasks buttons */}
      {project.analysisText && (
        <div className="mt-4 border-t border-baltic-sand/50 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Project Analysis</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateTasks}
                disabled={isGeneratingTasks || isGeneratingStructured}
                className="flex items-center gap-1"
              >
                {isGeneratingTasks ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Wand2 className="h-3 w-3" />
                )}
                {isGeneratingTasks ? 'Adding...' : 'Add Basic'}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleGenerateStructuredTasks}
                disabled={isGeneratingTasks || isGeneratingStructured}
                className="flex items-center gap-1"
              >
                {isGeneratingStructured ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Zap className="h-3 w-3" />
                )}
                {isGeneratingStructured ? 'Adding...' : 'Add Structured'}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground bg-baltic-fog/20 p-2 rounded border max-h-20 overflow-y-auto">
            {project.analysisText}
          </p>
        </div>
      )}
      
      {/* Tasks section */}
      {hasTasks && (
        <div className="mt-4 border-t border-baltic-sand/50 pt-3">
          <button 
            onClick={() => setShowTasks(!showTasks)}
            className="flex items-center justify-between w-full text-sm text-left text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-medium">Tasks ({project.tasks!.filter(t => t.completed).length}/{project.tasks!.length})</span>
            {showTasks ? 
              <ChevronUpIcon size={16} /> : 
              <ChevronDownIcon size={16} />
            }
          </button>
          
          {showTasks && (
            <div className="mt-2 space-y-2">
              {project.tasks!.map((task) => (
                <div key={task.id} className="flex items-start gap-2 p-2 bg-baltic-fog/20 rounded border">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="mt-0.5"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </span>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      {task.category && (
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                      )}
                      {task.dueDate && (
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(task.dueDate), 'MMM d')}
                        </Badge>
                      )}
                      {task.description && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTaskExpansion(task.id)}
                          className="h-5 w-5 p-0"
                        >
                          {expandedTasks.has(task.id) ? (
                            <ChevronDownIcon className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                    
                    {/* Due Date Editor */}
                    {editingTask === task.id ? (
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          type="date"
                          value={taskDueDate}
                          onChange={(e) => setTaskDueDate(e.target.value)}
                          className="h-7 text-xs"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTaskDueDate(task.id, taskDueDate)}
                          className="h-7 px-2 text-xs"
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTask(null)}
                          className="h-7 px-2 text-xs"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingDueDate(task.id, task.dueDate)}
                          className="h-6 px-2 text-xs flex items-center gap-1"
                        >
                          {task.dueDate ? (
                            <>
                              <Calendar className="h-3 w-3" />
                              Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3" />
                              Add due date
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                    
                    {task.description && expandedTasks.has(task.id) && (
                      <p className={`text-xs text-muted-foreground ${task.completed ? 'line-through' : ''} bg-muted/50 p-2 rounded mt-1`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TaskSection;
