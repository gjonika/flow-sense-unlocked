
import { createClient } from '@supabase/supabase-js';

// Use the client from the integrations directory instead
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export type ProjectStatus = 'Idea' | 'Planning' | 'In Progress' | 'Build' | 'Launch' | 'Completed' | 'Abandoned';
export type ProjectType = 'Personal' | 'Professional' | 'Education' | 'Market' | 'For Sale' | 'Open Source' | 'Other';
export type ProjectGroupBy = 'status' | 'type';

export interface ActivityLogEntry {
  text: string;
  date: string; // Store as ISO string for consistency
}

export interface Milestone {
  title: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface AITask {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: string;
  category?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  status: ProjectStatus;
  usefulness: number;
  isMonetized: boolean;
  progress: number;
  tags: string[];
  githubUrl?: string;
  websiteUrl?: string;
  nextAction?: string;
  lastUpdated: string;
  createdAt: string;
  user_id?: string;
  milestones?: Milestone[];
  category?: string;
  activityLogs?: ActivityLogEntry[];
  pinned?: boolean;
  accountUsed?: string;
  chatLinks?: string[];
  analysisText?: string;
  tasks?: AITask[];
}

export interface ProjectFilter {
  status?: ProjectStatus | 'All Status';
  type?: ProjectType | 'All Types';
  usefulness?: number | 'All Ratings';
  monetizedOnly?: boolean;
  tags?: string[];
  searchQuery?: string;
}

// Export the supabase client from integrations for backward compatibility
export { supabase };
