
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/supabase';
import ProgressDistribution from '../advanced-analytics/ProgressDistribution';
import ChartExportButtons from '../charts/ChartExportButtons';
import ProjectStatusChart from '../charts/ProjectStatusChart';
import ProjectTypeChart from '../charts/ProjectTypeChart';
import CompletionGaugeCard from '../charts/CompletionGaugeCard';
import MonetizedProjectsCard from '../charts/MonetizedProjectsCard';

interface AnalyticsOverviewTabProps {
  projects: Project[];
}

const AnalyticsOverviewTab: React.FC<AnalyticsOverviewTabProps> = ({ projects }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectStatusChart projects={projects} />
        <ProjectTypeChart projects={projects} />
        <CompletionGaugeCard projects={projects} />
        <MonetizedProjectsCard projects={projects} />

        <Card className="transition-shadow hover:shadow-md md:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Progress Distribution</CardTitle>
            <ChartExportButtons
              chartId="progress-distribution"
              data={[]} // Will be handled by ProgressDistribution component
              filename="progress-distribution"
            />
          </CardHeader>
          <CardContent className="pt-0">
            <div id="progress-distribution">
              <ProgressDistribution projects={projects} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsOverviewTab;
