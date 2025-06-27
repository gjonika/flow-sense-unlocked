
import React from 'react';
import { Project } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsOverviewTab from './analytics/AnalyticsOverviewTab';
import AnalyticsProgressTab from './analytics/AnalyticsProgressTab';
import AnalyticsAdvancedTab from './analytics/AnalyticsAdvancedTab';
import AnalyticsVisualCompareTab from './analytics/AnalyticsVisualCompareTab';

interface ProjectAnalyticsProps {
  projects: Project[];
}

const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({ projects = [] }) => {
  // Ensure projects is always an array
  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="visualcompare">Visual Compare</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <AnalyticsOverviewTab projects={safeProjects} />
        </TabsContent>

        <TabsContent value="progress">
          <AnalyticsProgressTab projects={safeProjects} />
        </TabsContent>

        <TabsContent value="advanced">
          <AnalyticsAdvancedTab projects={safeProjects} />
        </TabsContent>

        <TabsContent value="visualcompare">
          <AnalyticsVisualCompareTab projects={safeProjects} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectAnalytics;
