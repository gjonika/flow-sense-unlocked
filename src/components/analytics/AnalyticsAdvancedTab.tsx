
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/supabase';
import TagEffectiveness from '../advanced-analytics/TagEffectiveness';
import EngagementStats from '../advanced-analytics/EngagementStats';

interface AnalyticsAdvancedTabProps {
  projects: Project[];
}

const AnalyticsAdvancedTab: React.FC<AnalyticsAdvancedTabProps> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tag Effectiveness</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <TagEffectiveness projects={projects} />
        </CardContent>
      </Card>
      
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Engagement Statistics</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <EngagementStats projects={projects} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsAdvancedTab;
