
import { createClient } from '@supabase/supabase-js';

// Use the client from the integrations directory instead
import { supabase } from '@/integrations/supabase/client';

export type ProjectStatus = 'Idea' | 'Planning' | 'In Progress' | 'Build' | 'Launch' | 'Completed' | 'Abandoned';
export type ProjectType = 'Personal' | 'Professional' | 'Education' | 'Market' | 'For Sale' | 'Open Source' | 'Other';

export interface ActivityLog {
  text: string;
  date: string;
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
  activityLogs?: ActivityLog[];
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
