
import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, Target, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/lib/supabase';
import { useAIInsights } from './useAIInsights';
import ProjectInsight from './ProjectInsight';
import ErrorDisplay from './ErrorDisplay';
import LoadingInsights from './LoadingInsights';
import EmptyInsights from './EmptyInsights';
import { 
  suggestNextSteps, 
  generateWeeklySprintSuggestions, 
  suggestTaskTriage,
  generateMotivationBlurb,
  type WeeklySprintSuggestion 
} from '@/utils/ai';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AISupportProps {
  projects: Project[];
  onSelectProject?: (projectId: string) => void;
}

const AISupport: React.FC<AISupportProps> = ({ projects, onSelectProject }) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const [showWeeklySprint, setShowWeeklySprint] = useState(false);
  const [weeklySprintSuggestions, setWeeklySprintSuggestions] = useState<WeeklySprintSuggestion[]>([]);
  
  const {
    insights,
    loading,
    error,
    errorDetails,
    generateInsights,
    lastFetchTime
  } = useAIInsights({ projects });

  // Filter out abandoned projects for AI analysis
  const activeProjects = projects.filter(p => p.status !== 'Abandoned');

  // Initial load of insights when component mounts
  useEffect(() => {
    if (initialLoad && activeProjects.length > 0) {
      generateInsights();
      setInitialLoad(false);
    }
  }, [initialLoad, activeProjects.length]);

  // Generate weekly sprint suggestions
  useEffect(() => {
    if (activeProjects.length > 0) {
      const suggestions = generateWeeklySprintSuggestions(activeProjects);
      setWeeklySprintSuggestions(suggestions);
    }
  }, [activeProjects]);

  const handleRefreshInsights = () => {
    generateInsights(true); // Force refresh
  };

  const getEffortBadgeColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-muted/50 p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">AI Strategic Insights</h2>
          <p className="text-xs text-muted-foreground">
            Smart suggestions for your top {Math.min(activeProjects.length, 5)} active projects
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshInsights}
          disabled={loading}
          className="gap-1 hover:bg-muted transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Insights
        </Button>
      </div>

      {/* Weekly Sprint Suggestions */}
      {weeklySprintSuggestions.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Collapsible open={showWeeklySprint} onOpenChange={setShowWeeklySprint}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Weekly Sprint Suggestions</span>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                  {weeklySprintSuggestions.length} projects
                </span>
              </div>
              {showWeeklySprint ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="space-y-3">
                {weeklySprintSuggestions.map((suggestion) => (
                  <div key={suggestion.projectId} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{suggestion.projectName}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectProject?.(suggestion.projectId)}
                        className="text-xs h-6"
                      >
                        View Project
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{suggestion.rationale}</p>
                    <div className="space-y-1">
                      {suggestion.tasks.map((task, index) => (
                        <div key={index} className="text-xs flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      {error && <ErrorDisplay error={error} errorDetails={errorDetails} />}

      {loading ? (
        <LoadingInsights />
      ) : (
        <div className="space-y-4">
          {/* AI-generated insights */}
          {insights.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
              {insights.map((insight) => (
                <ProjectInsight 
                  key={insight.projectId} 
                  insight={insight} 
                  projects={projects}
                  onSelectProject={onSelectProject} 
                />
              ))}
            </div>
          )}

          {/* Local AI suggestions for each project */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Smart Next Steps
            </h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {activeProjects.slice(0, 6).map((project) => {
                const nextStep = suggestNextSteps(project);
                const triage = suggestTaskTriage(project);
                const motivation = generateMotivationBlurb(project);

                return (
                  <div 
                    key={project.id}
                    className="p-3 bg-card rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onSelectProject?.(project.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm line-clamp-1">{project.name}</h4>
                      <div className="flex gap-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getEffortBadgeColor(nextStep.effort)}`}>
                          {nextStep.effort}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getRiskBadgeColor(nextStep.risk)}`}>
                          {nextStep.risk}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">NEXT STEP</p>
                        <p className="text-xs">{nextStep.step}</p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">MOTIVATION</p>
                        <p className="text-xs italic text-blue-700">{motivation}</p>
                      </div>

                      {triage && (
                        <div className="pt-2 border-t border-muted">
                          <div className="flex items-center gap-1 mb-1">
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                            <p className="text-xs font-medium text-orange-700">TRIAGE SUGGESTED</p>
                          </div>
                          <p className="text-xs text-orange-600">
                            <span className="font-medium capitalize">{triage.action}:</span> {triage.reason}
                          </p>
                          {triage.timeline && (
                            <p className="text-xs text-muted-foreground mt-1">{triage.timeline}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {insights.length === 0 && activeProjects.length === 0 && !loading && !error && (
        <EmptyInsights />
      )}
    </div>
  );
};

export default AISupport;
