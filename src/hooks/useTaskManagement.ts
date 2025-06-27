
import { useMemo } from 'react';
import { useProjects } from '@/contexts/ProjectContext';
import { AITask, Project } from '@/lib/supabase';
import { toast } from 'sonner';

interface TaskWithProject extends AITask {
  projectName: string;
  projectId: string;
  projectStatus: string;
}

export const useTaskManagement = () => {
  const { projects, editProject } = useProjects();

  // Aggregate all tasks from all projects
  const allTasks = useMemo(() => {
    const tasks: TaskWithProject[] = [];
    projects.forEach(project => {
      if (project.tasks && project.tasks.length > 0) {
        project.tasks.forEach(task => {
          tasks.push({
            ...task,
            projectName: project.name,
            projectId: project.id,
            projectStatus: project.status,
          });
        });
      }
    });
    return tasks;
  }, [projects]);

  // Task completion handler
  const handleToggleTask = async (task: TaskWithProject) => {
    const project = projects.find(p => p.id === task.projectId);
    if (!project) return;

    const updatedTasks = project.tasks?.map(t => 
      t.id === task.id ? { ...t, completed: !t.completed } : t
    ) || [];

    try {
      await editProject(project.id, { tasks: updatedTasks });
      toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed!');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  // Update task due date
  const handleSaveTaskDueDate = async (task: TaskWithProject, selectedDate?: Date) => {
    const project = projects.find(p => p.id === task.projectId);
    if (!project) return;

    const dueDateString = selectedDate ? selectedDate.toISOString().split('T')[0] : undefined;
    const updatedTasks = project.tasks?.map(t => 
      t.id === task.id ? { ...t, dueDate: dueDateString } : t
    ) || [];

    try {
      await editProject(project.id, { tasks: updatedTasks });
      toast.success('Task due date updated');
    } catch (error) {
      toast.error('Failed to update due date');
    }
  };

  // Edit task details
  const handleEditTask = async (task: TaskWithProject, updatedData: Partial<AITask>) => {
    const project = projects.find(p => p.id === task.projectId);
    if (!project) return;

    const updatedTasks = project.tasks?.map(t => 
      t.id === task.id ? { ...t, ...updatedData } : t
    ) || [];

    try {
      await editProject(project.id, { tasks: updatedTasks });
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  // Get unique categories and projects for filters
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(allTasks.map(task => task.category).filter(Boolean)));
  }, [allTasks]);

  const activeProjects = useMemo(() => {
    return projects.filter(p => allTasks.some(t => t.projectId === p.id));
  }, [projects, allTasks]);

  // Task statistics
  const taskStats = useMemo(() => {
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.completed).length;
    const highPriority = allTasks.filter(t => t.priority === 'high' && !t.completed).length;
    const pending = total - completed;
    
    return { total, completed, pending, highPriority };
  }, [allTasks]);

  return {
    allTasks,
    uniqueCategories,
    activeProjects,
    taskStats,
    handleToggleTask,
    handleSaveTaskDueDate,
    handleEditTask,
  };
};

export type { TaskWithProject };
