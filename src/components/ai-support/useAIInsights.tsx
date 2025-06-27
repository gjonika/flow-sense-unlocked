
import { useState, useEffect } from 'react';
import { Project } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProjectInsight } from './ProjectInsight';

interface UseAIInsightsProps {
  projects: Project[];
  shouldRefresh?: boolean;
}

export const useAIInsights = ({ projects, shouldRefresh = false }: UseAIInsightsProps) => {
  const [insights, setInsights] = useState<ProjectInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const { toast } = useToast();

  // Filter out completed projects
  const activeProjects = projects.filter(p => p.status !== 'Completed');

  const generateInsights = async (force = false) => {
    if (activeProjects.length === 0) {
      toast({
        title: "No active projects available",
        description: "Add some in-progress projects to get AI insights.",
        variant: "default",
      });
      return;
    }

    // Don't regenerate insights if we already have them and force is false
    if (insights.length > 0 && !force && !shouldRefresh) {
      return;
    }

    setLoading(true);
    setError(null);
    setErrorDetails(null);

    try {
      // Use only the top 5 active projects to avoid overwhelming the API
      const projectsToAnalyze = activeProjects.slice(0, 5);
      console.log(`Generating insights for ${projectsToAnalyze.length} projects`);
      
      const { data, error: apiError } = await supabase.functions.invoke('generate-ai-insights', {
        body: { projects: projectsToAnalyze },
      });

      if (apiError) {
        console.error('Supabase function error:', apiError);
        throw new Error(apiError.message || "Failed to call AI service");
      }

      if (!data) {
        throw new Error('No data returned from AI service');
      }

      console.log('API response:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data && data.insights) {
        // Map the insights to projects
        const projectInsights = data.insights.map((insight: any, index: number) => ({
          ...insight,
          projectId: projectsToAnalyze[index]?.id || 'unknown',
          projectName: projectsToAnalyze[index]?.name || 'Unknown Project'
        }));

        setInsights(projectInsights);
        setLastFetchTime(Date.now());
        
        // Successful insight generation notification
        toast({
          title: "AI Insights Generated",
          description: `Successfully generated insights for ${projectInsights.length} projects.`,
          variant: "default",
        });
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error generating insights:', err);
      
      // Set a user-friendly error message
      setError(`AI insights could not be generated at the moment. Please try again later.`);
      
      // Store technical details for debugging (shown only when expanded)
      if (err instanceof Error && err.stack) {
        setErrorDetails(err.stack);
      }
      
      toast({
        title: "AI Insights Error",
        description: "Failed to generate AI insights. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    insights,
    loading,
    error,
    errorDetails,
    generateInsights,
    lastFetchTime
  };
};
