
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Project } from '@/lib/supabase';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Types for API response
interface AIResponse {
  summary: string;
  suggestions: string;
  trends: string;
}

interface AISupportProps {
  projects: Project[];
}

const AISupport: React.FC<AISupportProps> = ({ projects }) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);

  // Function to generate placeholder response when API fails
  const generatePlaceholderResponse = (): AIResponse => {
    const projectCount = projects.length;
    let progressCount = 0;
    let completedCount = 0;
    let ideasCount = 0;
    
    projects.forEach(project => {
      if (project.progress >= 100) completedCount++;
      if (project.progress > 0) progressCount++;
      if (project.status === 'Idea') ideasCount++;
    });
    
    return {
      summary: `You have ${projectCount} projects tracked in your dashboard. ${completedCount} projects are completed, ${progressCount} are in progress, and ${ideasCount} are in the idea phase.`,
      suggestions: `Consider focusing on projects with high usefulness ratings first. For each project, make sure to add regular activity updates to track your progress more effectively.`,
      trends: `Your portfolio seems to be ${projectCount > 3 ? 'diverse' : 'focused on a few key projects'}. Keep adding detailed information to each project to get more personalized insights.`
    };
  };

  const generateInsights = async () => {
    setLoading(true);

    if (projects.length === 0) {
      setResponse({
        summary: "You don't have any projects yet. Add your first project to get insights.",
        suggestions: "Start by creating a new project and tracking its progress.",
        trends: "Once you have multiple projects, you'll see trends and patterns here."
      });
      setLoading(false);
      return;
    }

    // Prepare data for the API
    const projectData = projects.map(project => {
      // Get activity logs if they exist
      const activityLogs = project.activityLogs 
        ? project.activityLogs.slice(0, 3).map((log: any) => log.text)
        : [];

      return {
        name: project.name,
        progress: project.progress,
        status: project.status,
        type: project.type,
        usefulness: project.usefulness,
        tags: project.tags,
        nextAction: project.nextAction || '',
        activityLog: activityLogs
      };
    });

    try {
      // Use a timeout to ensure we don't wait too long for the API
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 10000)
      );
      
      // Call the edge function
      const responsePromise = fetch('/api/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projects: projectData }),
      });
      
      // Race the fetch against a timeout
      const response = await Promise.race([responsePromise, timeoutPromise]) as Response;

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights. Using local analysis instead.');
      
      // Create a placeholder response when the API fails
      setResponse(generatePlaceholderResponse());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projects.length > 0) {
      generateInsights();
    }
  }, []);

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">
            Add some projects to get AI insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">AI Generated Insights</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateInsights} 
          disabled={loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="py-10 flex justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-olive" />
            <p className="text-muted-foreground">Analyzing your projects...</p>
          </div>
        </div>
      ) : response ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-base">Project Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm whitespace-pre-line">
                {response.summary}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-base">Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm whitespace-pre-line">
                {response.suggestions}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-base">Trends & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm whitespace-pre-line">
                {response.trends}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-6">
          Failed to load insights. Please try refreshing.
        </p>
      )}
    </div>
  );
};

export default AISupport;
