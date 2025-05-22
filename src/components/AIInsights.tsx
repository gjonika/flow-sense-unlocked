
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Project } from '@/lib/supabase';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AIInsightsProps {
  projects: Project[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ projects }) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<{
    summary: string;
    suggestions: string;
    trends: string;
  } | null>(null);

  const generateInsights = async () => {
    if (projects.length === 0) {
      toast.error('No projects available to analyze');
      return;
    }

    setLoading(true);

    try {
      // Prepare project data for the API
      const projectsData = projects.map(project => ({
        name: project.name,
        type: project.type,
        status: project.status,
        progress: project.progress,
        tags: project.tags,
        usefulness: project.usefulness,
        isMonetized: project.isMonetized,
        nextAction: project.nextAction,
        activityLogs: project.activityLogs || []
      }));

      // Call the edge function with project data
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projects: projectsData }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      
      setInsights({
        summary: data.summary || 'No summary available',
        suggestions: data.suggestions || 'No suggestions available',
        trends: data.trends || 'No trends available',
      });
      
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate AI insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Generate insights when component mounts or projects change
  useEffect(() => {
    if (projects.length > 0) {
      generateInsights();
    }
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">AI Project Insights</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateInsights} 
            disabled={loading}
            className="flex items-center gap-1"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-olive mb-2" />
            <p className="text-muted-foreground">Generating AI insights...</p>
          </div>
        ) : insights ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">📄 Project Summary</h3>
              <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted p-3 rounded-md">
                {insights.summary}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">🧠 Suggestions</h3>
              <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted p-3 rounded-md">
                {insights.suggestions}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">📈 Trends/Insights</h3>
              <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted p-3 rounded-md">
                {insights.trends}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No insights available yet.</p>
            <p className="text-sm mt-1">Click refresh to generate insights for your projects.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;
