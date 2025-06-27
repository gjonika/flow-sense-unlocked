
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ProjectStatus, ProjectType } from '@/lib/supabase';
import { useProjects } from '@/contexts/ProjectContext';
import { X } from 'lucide-react';

const PROJECT_STATUSES: Array<ProjectStatus | 'All Status'> = ['All Status', 'Idea', 'Planning', 'In Progress', 'Build', 'Launch', 'Completed', 'Abandoned'];
const PROJECT_TYPES: Array<ProjectType | 'All Types'> = ['All Types', 'Personal', 'Professional', 'Education', 'Market', 'For Sale', 'Open Source', 'Other'];
const USEFULNESS_RATINGS = ['All Ratings', '1', '2', '3', '4', '5'];

const ProjectFilters: React.FC = () => {
  const { filters, setFilters, setSortBy } = useProjects();
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, searchQuery });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilters({ ...filters, searchQuery: '' });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ 
      ...filters, 
      status: value as ProjectStatus | 'All Status'
    });
  };

  const handleTypeChange = (value: string) => {
    setFilters({ 
      ...filters, 
      type: value as ProjectType | 'All Types'
    });
  };

  const handleRatingChange = (value: string) => {
    setFilters({ 
      ...filters, 
      usefulness: value === 'All Ratings' ? 'All Ratings' : parseInt(value, 10)
    });
  };

  const handleMonetizedChange = (checked: boolean) => {
    setFilters({ 
      ...filters, 
      monetizedOnly: checked 
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-baltic-fog border-baltic-sea/30 focus-visible:ring-baltic-sea/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" className="bg-baltic-pine hover:bg-baltic-deep text-baltic-fog">Search</Button>
      </form>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select 
          value={filters.status || 'All Status'} 
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full border-baltic-sea/30">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {PROJECT_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={filters.type || 'All Types'} 
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-full border-baltic-sea/30">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {PROJECT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="monetized" 
          checked={filters.monetizedOnly || false}
          onCheckedChange={handleMonetizedChange}
          className="border-baltic-sea/50 text-baltic-pine"
        />
        <Label htmlFor="monetized" className="cursor-pointer">Show monetized only</Label>
      </div>
    </div>
  );
};

export default ProjectFilters;
