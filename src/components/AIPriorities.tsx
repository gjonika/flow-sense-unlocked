
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/supabase';
import LoadingState from './ai-priorities/LoadingState';
import ErrorState from './ai-priorities/ErrorState';
import EmptyState from './ai-priorities/EmptyState';
import PrioritySection from './ai-priorities/PrioritySection';
import { usePriorities } from './ai-priorities/usePriorities';

interface AIPrioritiesProps {
  projects: Project[];
  onSelectProject?: (projectId: string) => void;
}

const AIPriorities: React.FC<AIPrioritiesProps> = ({ projects, onSelectProject }) => {
  const {
    highPriorityProjects,
    neglectedProjects,
    loading,
    error,
    activeProjects
  } = usePriorities(projects);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (activeProjects.length === 0) {
    return <EmptyState />;
  }

  return (
    <Card className="shadow-lg border-olive/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">AI-Powered Priorities</CardTitle>
          <span className="text-xs text-muted-foreground">For in-progress projects only</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-5">
        {/* High Priority Projects */}
        <PrioritySection
          title="Closest to Launch"
          icon="🚀"
          description="No high priority projects identified"
          items={highPriorityProjects}
          itemType="priority"
          onSelectProject={onSelectProject}
        />

        {/* Neglected Projects */}
        <PrioritySection
          title="Needs Attention"
          icon="⏱️"
          description="No neglected projects identified"
          items={neglectedProjects}
          itemType="neglected"
          onSelectProject={onSelectProject}
        />
      </CardContent>
    </Card>
  );
};

export default AIPriorities;
