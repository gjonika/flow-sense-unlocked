
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/supabase';

interface MonetizedProjectsCardProps {
  projects: Project[];
}

const MonetizedProjectsCard: React.FC<MonetizedProjectsCardProps> = ({ projects }) => {
  const monetizedCount = React.useMemo(() => {
    return projects.filter((project) => project.isMonetized).length;
  }, [projects]);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Monetized Projects</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center justify-center h-24 flex-col">
          <div className="text-4xl font-bold text-amber-500">{monetizedCount}</div>
          <div className="text-sm text-muted-foreground">of {projects.length} total</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonetizedProjectsCard;
