
import { z } from 'zod';
import { ProjectStatus, ProjectType } from '@/lib/supabase';

// Define the milestone schema for validation
const milestoneSchema = z.object({
  title: z.string().min(1, "Milestone title is required"),
  dueDate: z.string(),
  status: z.enum(['completed', 'in-progress', 'pending'])
});

// Define the task schema for AI-generated tasks
const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  completed: z.boolean().default(false),
  dueDate: z.string().optional(),
  category: z.string().optional(),
});

// Create a schema for project validation
export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional().nullable(),
  type: z.enum([
    'Personal', 'Professional', 'Education', 
    'Market', 'For Sale', 'Open Source', 'Other'
  ] as const).default('Personal') as z.ZodType<ProjectType>,
  status: z.enum([
    'Idea', 'Planning', 'In Progress', 'Build', 
    'Launch', 'Completed', 'Abandoned'
  ] as const).default('Idea') as z.ZodType<ProjectStatus>,
  usefulness: z.number().min(1).max(5).default(3),
  isMonetized: z.boolean().default(false),
  progress: z.number().min(0).max(100).default(0),
  tags: z.array(z.string()).default([]),
  githubUrl: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  nextAction: z.string().optional().nullable(),
  milestones: z.array(milestoneSchema).default([]),
  accountUsed: z.string().optional().nullable(),
  chatLinks: z.array(z.string()).default([]),
  analysisText: z.string().optional().nullable(),
  tasks: z.array(taskSchema).default([]),
});

export type AITask = z.infer<typeof taskSchema>;
