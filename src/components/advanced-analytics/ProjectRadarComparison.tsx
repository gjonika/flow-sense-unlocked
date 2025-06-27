
import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend,
  Tooltip
} from 'recharts';
import { Project } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { calculateProjectFreshness } from '@/lib/projectUtils';
import { getBalticColor } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectRadarComparisonProps {
  projects: Project[];
  selectedProjectIds: string[];
  onSelectProject: (projectId: string, isSelected: boolean) => void;
}

type SortOption = 'name' | 'progress' | 'usefulness' | 'recent';

const ProjectRadarComparison: React.FC<ProjectRadarComparisonProps> = ({ 
  projects = [], 
  selectedProjectIds = [],
  onSelectProject
}) => {
  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter projects based on selection
  const selectedProjects = useMemo(() => {
    if (!projects || !selectedProjectIds) return [];
    return projects.filter(project => selectedProjectIds.includes(project.id));
  }, [projects, selectedProjectIds]);
  
  // Transform data for radar chart
  const transformedData = useMemo(() => {
    if (!selectedProjects || selectedProjects.length === 0) return [];
    
    const metrics = [
      { name: 'Progress', fullMark: 100 },
      { name: 'Usefulness', fullMark: 100 },
      { name: 'Priority', fullMark: 100 },
      { name: 'Freshness', fullMark: 100 },
      { name: 'Monetized', fullMark: 100 }
    ];

    return metrics.map(metric => {
      const dataPoint: any = { name: metric.name };
      
      selectedProjects.forEach(project => {
        // Calculate values for each metric
        switch (metric.name) {
          case 'Progress':
            dataPoint[project.name] = project.progress;
            break;
          case 'Usefulness':
            dataPoint[project.name] = project.usefulness * 20; // Convert 1-5 to 0-100
            break;
          case 'Priority':
            // Use usefulness as a proxy for priority if no dedicated field
            dataPoint[project.name] = project.usefulness * 20;
            break;
          case 'Freshness':
            dataPoint[project.name] = calculateProjectFreshness(project.lastUpdated);
            break;
          case 'Monetized':
            dataPoint[project.name] = project.isMonetized ? 100 : 0;
            break;
        }
      });
      
      return dataPoint;
    });
  }, [selectedProjects]);

  // Get the list of available project types
  const projectTypes = useMemo(() => {
    const types = new Set<string>();
    projects.forEach(project => types.add(project.type));
    return Array.from(types).sort();
  }, [projects]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    
    let filtered = [...projects];
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.description && p.description.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
        case 'usefulness':
          comparison = a.usefulness - b.usefulness;
          break;
        case 'recent':
          comparison = new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [projects, filterType, searchQuery, sortBy, sortDirection]);

  // Toggle sort direction
  const handleToggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Project selector component
  const ProjectSelector = () => {
    if (!projects || projects.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-2">
          No projects available to select
        </div>
      );
    }

    return (
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Select Projects to Compare (2-5)</h3>
          <span className="text-xs text-muted-foreground">{selectedProjectIds.length}/5 selected</span>
        </div>
        
        <div className="flex flex-col gap-3 md:flex-row">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Type filter */}
          <Select 
            value={filterType} 
            onValueChange={setFilterType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {projectTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 h-10">
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                By Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('progress')}>
                By Progress {sortBy === 'progress' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('usefulness')}>
                By Usefulness {sortBy === 'usefulness' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('recent')}>
                By Recent {sortBy === 'recent' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleSortDirection}>
                {sortDirection === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <ScrollArea className="h-[180px] border rounded-md p-2">
          <div className="space-y-2">
            {filteredAndSortedProjects.map((project) => (
              <div key={project.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`project-${project.id}`}
                  checked={selectedProjectIds.includes(project.id)}
                  onCheckedChange={(checked) => {
                    onSelectProject(project.id, checked === true);
                  }}
                  disabled={!selectedProjectIds.includes(project.id) && selectedProjectIds.length >= 5}
                />
                <Label 
                  htmlFor={`project-${project.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {project.name}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };
  
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Project Comparison</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ProjectSelector />
        
        {selectedProjects.length >= 2 ? (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                outerRadius="70%" 
                data={transformedData}
                margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
              >
                <PolarGrid stroke="#DAD8C4" strokeOpacity={0.5} />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#3A4F52', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#3A4F52' }} />
                {selectedProjects.map((project, index) => (
                  <Radar
                    key={project.id}
                    name={project.name}
                    dataKey={project.name}
                    stroke={getBalticColor(index)}
                    fill={getBalticColor(index)}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                ))}
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            Select at least 2 projects to compare
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectRadarComparison;
