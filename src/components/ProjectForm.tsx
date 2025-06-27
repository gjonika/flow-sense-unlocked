
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Project } from '@/lib/supabase';
import ProjectFormHeader from './project/ProjectFormHeader';
import ProjectFormFields from './project/ProjectFormFields';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/lib/validations/project';
import { z } from 'zod';

// Define the form data type based on the schema
export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  initialData?: Project;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}) => {
  // Initialize the form with react-hook-form
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'Personal',
      status: 'Idea',
      usefulness: 3,
      isMonetized: false,
      progress: 0,
      tags: [],
      githubUrl: '',
      websiteUrl: '',
      nextAction: '',
      milestones: [],
      accountUsed: '',
      chatLinks: [],
      analysisText: '',
      tasks: [],
    },
  });

  // Reset form when modal opens/closes or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          description: initialData.description || '',
          type: initialData.type,
          status: initialData.status,
          usefulness: initialData.usefulness,
          isMonetized: initialData.isMonetized,
          progress: initialData.progress,
          tags: initialData.tags || [],
          githubUrl: initialData.githubUrl || '',
          websiteUrl: initialData.websiteUrl || '',
          nextAction: initialData.nextAction || '',
          milestones: initialData.milestones || [],
          accountUsed: initialData.accountUsed || '',
          chatLinks: initialData.chatLinks || [],
          analysisText: initialData.analysisText || '',
          tasks: initialData.tasks || [],
        });
      } else {
        // Reset form for new project
        form.reset({
          name: '',
          description: '',
          type: 'Personal',
          status: 'Idea',
          usefulness: 3,
          isMonetized: false,
          progress: 0,
          tags: [],
          githubUrl: '',
          websiteUrl: '',
          nextAction: '',
          milestones: [],
          accountUsed: '',
          chatLinks: [],
          analysisText: '',
          tasks: [],
        });
      }
    }
  }, [initialData, isOpen, form]);

  // Handle closing the dialog
  const handleClose = () => {
    console.log('ProjectForm: handleClose called');
    onClose();
  };

  // Handle dialog open change (when clicking outside or pressing escape)
  const handleOpenChange = (open: boolean) => {
    console.log('ProjectForm: handleOpenChange called with:', open);
    if (!open) {
      handleClose();
    }
  };

  // Fix: Use proper type handling for form submission
  const handleSubmit = (data: ProjectFormValues) => {
    if (!data.name.trim()) {
      toast.error('Project name is required');
      return;
    }
    
    // Filter and properly type milestones to ensure all required properties are present
    const validMilestones = data.milestones
      .filter(milestone => 
        milestone.title && milestone.title.trim() && 
        milestone.dueDate && 
        milestone.status
      )
      .map(milestone => ({
        title: milestone.title as string, // We know it exists due to the filter
        dueDate: milestone.dueDate as string, // We know it exists due to the filter
        status: milestone.status as 'completed' | 'in-progress' | 'pending' // We know it exists due to the filter
      }));
    
    // Ensure all tasks have required properties
    const validTasks = data.tasks.map(task => ({
      id: task.id || crypto.randomUUID(), // Generate ID if missing
      title: task.title || '',
      description: task.description || undefined,
      priority: task.priority || 'medium' as const,
      completed: task.completed || false,
      dueDate: task.dueDate || undefined,
      category: task.category || undefined,
    }));
    
    // Convert the form data to match the expected Project type
    // Ensure all required properties have values
    const projectData: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'> = {
      name: data.name,
      description: data.description || null,
      type: data.type,
      status: data.status,
      usefulness: data.usefulness,
      isMonetized: data.isMonetized,
      progress: data.progress,
      tags: data.tags,
      githubUrl: data.githubUrl || null,
      websiteUrl: data.websiteUrl || null,
      nextAction: data.nextAction || null,
      milestones: validMilestones,
      category: null, // Always set to null since we removed category functionality
      accountUsed: data.accountUsed || null,
      chatLinks: data.chatLinks || [],
      analysisText: data.analysisText || null,
      tasks: validTasks,
    };
    
    onSave(projectData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="flex flex-col h-full">
          <ProjectFormHeader 
            initialData={initialData} 
            onClose={handleClose} 
            onSave={form.handleSubmit(handleSubmit)} 
          />
          
          <FormProvider {...form}>
            <form className="p-6 overflow-y-auto" onSubmit={form.handleSubmit(handleSubmit)}>
              <ProjectFormFields />
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
