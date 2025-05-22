
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Project } from '@/lib/supabase';
import ProjectFormHeader from './project/ProjectFormHeader';
import ProjectFormFields from './project/ProjectFormFields';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  initialData?: Project;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>>({
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
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
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
      });
    } else {
      // Reset form for new project
      setFormData({
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
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.name.trim()) {
      alert('Project name is required');
      return;
    }
    
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <div className="flex flex-col h-full">
          <ProjectFormHeader 
            initialData={initialData} 
            onClose={onClose} 
            onSave={handleSubmit} 
          />
          
          <form className="p-6 overflow-y-auto">
            <ProjectFormFields 
              formData={formData} 
              handleChange={handleChange} 
            />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
