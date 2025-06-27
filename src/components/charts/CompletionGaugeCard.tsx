
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/supabase';
import GaugeChart from './GaugeChart';

interface CompletionGaugeCardProps {
  projects: Project[];
}

const CompletionGaugeCard: React.FC<CompletionGaugeCardProps> = ({ projects }) => {
  const completionRate = React.useMemo(() => {
    if (projects.length === 0) return 0;
    const totalProgress = projects.reduce((sum, project) => sum + project.progress, 0);
    return Math.round(totalProgress / projects.length);
  }, [projects]);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Average Completion</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center justify-center">
          <GaugeChart value={completionRate} label="Overall Progress" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionGaugeCard;
