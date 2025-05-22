
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Project } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AISupportProps {
  projects: Project[];
}

// Mock AI support feature - this would need a backend implementation to be fully functional
const AISupport: React.FC<AISupportProps> = ({ projects }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a question or prompt');
      return;
    }
    
    setLoading(true);
    
    // Mock AI response with project data
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock response
      const projectNames = projects.map(p => p.name).join(', ');
      const projectTypeCounts = projects.reduce((acc, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mockResponse = `Based on your ${projects.length} projects (${projectNames}), I see you're working on ${Object.entries(projectTypeCounts)
        .map(([type, count]) => `${count} ${type} projects`)
        .join(', ')}. 
        
        Regarding your question "${prompt}":
        
        I recommend focusing on your highest usefulness rating projects first, and consider allocating more time to the ones with monetization potential. 
        
        For more specific guidance, please provide details about your goals and challenges.`;
      
      setResponse(mockResponse);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('Failed to generate AI insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Project AI Assistant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Ask for insights or recommendations about your projects.
        </p>
        
        <div className="space-y-4">
          <Textarea
            placeholder="E.g., Which project should I focus on next? Or, how can I improve my project portfolio?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
          
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !prompt.trim()} 
            className="bg-olive hover:bg-olive-dark w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating insights...
              </>
            ) : (
              'Get AI Insights'
            )}
          </Button>
          
          {response && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">AI Response:</h3>
              <div className="whitespace-pre-line text-sm">
                {response}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AISupport;
