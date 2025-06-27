
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/supabase';
import EnhancedProgressChart from '../advanced-analytics/EnhancedProgressChart';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ChartExportButtons from '../charts/ChartExportButtons';

interface AnalyticsProgressTabProps {
  projects: Project[];
}

const AnalyticsProgressTab: React.FC<AnalyticsProgressTabProps> = ({ projects }) => {
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  
  const filteredProjects = showActiveOnly 
    ? projects.filter(p => p.status !== 'Completed')
    : projects;

  return (
    <div className="space-y-6">
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">Project Progress Over Time</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active-only"
                  checked={showActiveOnly}
                  onCheckedChange={setShowActiveOnly}
                />
                <Label htmlFor="active-only" className="text-sm">
                  Show Only Active Projects
                </Label>
              </div>
              <ChartExportButtons
                chartId="progress-chart"
                data={filteredProjects}
                filename="project-progress"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div id="progress-chart">
            <EnhancedProgressChart projects={filteredProjects} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsProgressTab;
