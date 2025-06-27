
import { AITask } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface GenerateTasksResponse {
  tasks: AITask[];
}

export interface StructuredTask {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export const generateTasksFromAnalysis = async (analysisText: string, existingTasks: AITask[] = []): Promise<AITask[]> => {
  if (!analysisText?.trim()) {
    throw new Error('Analysis text is required');
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-tasks', {
      body: {
        analysisText: analysisText.trim(),
      },
    });

    if (error) {
      throw new Error(`Failed to generate tasks: ${error.message}`);
    }

    if (!data || !data.tasks) {
      throw new Error('Invalid response from task generation service');
    }
    
    // Transform the response into our AITask format
    const newTasks: AITask[] = data.tasks.map((task: any) => ({
      id: uuidv4(),
      title: task.title || task.name || 'Untitled Task',
      description: task.description || undefined,
      priority: task.priority || 'medium' as const,
      completed: false,
      category: task.category || 'General',
    }));

    // Append new tasks to existing ones instead of replacing
    return [...existingTasks, ...newTasks];
  } catch (error) {
    console.error('Error generating tasks from analysis:', error);
    throw error;
  }
};

export const generateStructuredTasksFromAnalysis = async (analysisText: string, existingTasks: AITask[] = []): Promise<AITask[]> => {
  if (!analysisText?.trim()) {
    throw new Error('Analysis text is required');
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-structured-tasks', {
      body: {
        analysisText: analysisText.trim(),
      },
    });

    if (error) {
      throw new Error(`Failed to generate structured tasks: ${error.message}`);
    }

    if (!data || !data.tasks) {
      throw new Error('Invalid response from structured task generation service');
    }
    
    // Transform the response into our AITask format
    const newTasks: AITask[] = data.tasks.map((task: any) => ({
      id: uuidv4(),
      title: task.title || 'Untitled Task',
      description: task.description || undefined,
      priority: (task.priority === 'high' ? 'high' : 
                task.priority === 'low' ? 'low' : 'medium') as 'low' | 'medium' | 'high',
      completed: false,
      category: task.category || 'General',
    }));

    // Append new tasks to existing ones instead of replacing
    return [...existingTasks, ...newTasks];
  } catch (error) {
    console.error('Error generating structured tasks from analysis:', error);
    throw error;
  }
};
