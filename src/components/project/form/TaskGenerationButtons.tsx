
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, Zap } from 'lucide-react';
import { ProjectFormValues } from '@/components/ProjectForm';
import { toast } from 'sonner';
import { generateTasksFromAnalysis, generateStructuredTasksFromAnalysis } from '@/services/aiService';
import { AITask } from '@/lib/supabase';

const TaskGenerationButtons: React.FC = () => {
  const { watch, setValue } = useFormContext<ProjectFormValues>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingStructured, setIsGeneratingStructured] = useState(false);
  const analysisText = watch('analysisText');
  const tasks = watch('tasks') || [];
  
  const generateTasks = async () => {
    if (!analysisText?.trim()) {
      toast.error('Please enter analysis text first');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const existingTasks: AITask[] = tasks.map(task => ({
        id: task.id || '',
        title: task.title || '',
        description: task.description,
        priority: task.priority || 'medium',
        completed: task.completed || false,
        dueDate: task.dueDate,
        category: task.category,
      }));
      
      const generatedTasks = await generateTasksFromAnalysis(analysisText, existingTasks);
      setValue('tasks', generatedTasks);
      toast.success('Basic tasks generated and added!');
    } catch (error) {
      console.error('Failed to generate tasks:', error);
      toast.error('Failed to generate tasks. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateStructuredTasks = async () => {
    if (!analysisText?.trim()) {
      toast.error('Please enter analysis text first');
      return;
    }
    
    setIsGeneratingStructured(true);
    
    try {
      const existingTasks: AITask[] = tasks.map(task => ({
        id: task.id || '',
        title: task.title || '',
        description: task.description,
        priority: task.priority || 'medium',
        completed: task.completed || false,
        dueDate: task.dueDate,
        category: task.category,
      }));
      
      const structuredTasks = await generateStructuredTasksFromAnalysis(analysisText, existingTasks);
      setValue('tasks', structuredTasks);
      toast.success('Structured tasks generated and added!');
    } catch (error) {
      console.error('Failed to generate structured tasks:', error);
      toast.error('Failed to generate structured tasks. Please try again.');
    } finally {
      setIsGeneratingStructured(false);
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button 
        type="button"
        onClick={generateTasks}
        disabled={isGenerating || isGeneratingStructured || !analysisText?.trim()}
        className="flex items-center gap-2"
        variant="outline"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="h-4 w-4" />
        )}
        {isGenerating ? 'Adding...' : 'Add Basic Tasks'}
      </Button>
      
      <Button 
        type="button"
        onClick={generateStructuredTasks}
        disabled={isGenerating || isGeneratingStructured || !analysisText?.trim()}
        className="flex items-center gap-2"
      >
        {isGeneratingStructured ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Zap className="h-4 w-4" />
        )}
        {isGeneratingStructured ? 'Adding...' : 'Add Structured Tasks'}
      </Button>
    </div>
  );
};

export default TaskGenerationButtons;
