
import { useState, useEffect } from 'react';
import { Project } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIInsightItem } from './AIInsightItem';

export const usePriorities = (projects: Project[]) => {
  const [highPriorityProjects, setHighPriorityProjects] = useState<AIInsightItem[]>([]);
  const [neglectedProjects, setNeglectedProjects] = useState<AIInsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  // Filter out completed projects
  const activeProjects = projects.filter(p => p.status !== 'Completed');

  useEffect(() => {
    const fetchPriorities = async () => {
      if (activeProjects.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Format the project data for the edge function
        const projectData = activeProjects.map(project => ({
          id: project.id,
          name: project.name,
          progress: project.progress,
          nextAction: project.nextAction || "No next action specified",
          lastUpdated: project.lastUpdated,
          status: project.status,
          tags: project.tags || [],
          milestones: project.milestones || []
        }));

        // Call the edge function
        const { data, error } = await supabase.functions.invoke('generate-ai-priorities', {
          body: { projects: projectData }
        });

        if (error) {
          throw error;
        }

        if (data && data.priorities) {
          // Add projectId to each item
          const highPriority = data.priorities.highPriority || [];
          const neglected = data.priorities.neglected || [];
          
          // Map project names to IDs for reference
          const projectMap = new Map(activeProjects.map(p => [p.name, p.id]));
          
          // Add project IDs to each priority item
          const highPriorityWithIds = highPriority.map((item: AIInsightItem) => ({
            ...item,
            projectId: projectMap.get(item.name)
          }));
          
          const neglectedWithIds = neglected.map((item: AIInsightItem) => ({
            ...item,
            projectId: projectMap.get(item.name)
          }));
          
          setHighPriorityProjects(highPriorityWithIds);
          setNeglectedProjects(neglectedWithIds);
          setLastFetchTime(Date.now());
        } else {
          throw new Error('Invalid response from AI');
        }
      } catch (err: any) {
        console.error('Failed to fetch AI priorities:', err);
        setError(err.message || 'Failed to fetch AI priorities');
        toast.error('Could not generate AI priorities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we haven't already or if it's been more than 30 minutes
    if (!lastFetchTime || (Date.now() - lastFetchTime > 30 * 60 * 1000)) {
      fetchPriorities();
    }
  }, [activeProjects, lastFetchTime]);

  return {
    highPriorityProjects,
    neglectedProjects,
    loading,
    error,
    activeProjects,
    lastFetchTime
  };
};
