
import React from 'react';
import { useProjects } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UpcomingDeadlines from '@/components/advanced-analytics/UpcomingDeadlines';

const Deadlines: React.FC = () => {
  const { projects } = useProjects();
  const navigate = useNavigate();

  const handleSelectProject = (projectId: string) => {
    navigate('/', { state: { expandProjectId: projectId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-subtle to-background">
      <div className="container py-6 px-4 md:py-10 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Header with Back Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Project Deadlines</h1>
              <p className="text-muted-foreground mt-2">
                Track upcoming milestones and deadlines across all projects
              </p>
            </div>
          </div>
        </div>

        {/* Deadlines Content */}
        <div className="space-y-6">
          <UpcomingDeadlines projects={projects} onSelectProject={handleSelectProject} />
        </div>
      </div>
    </div>
  );
};

export default Deadlines;
