
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Project, ProjectStatus, ProjectType } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

interface ProjectFormFieldsProps {
  formData: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>;
  handleChange: (field: string, value: string | number | boolean | string[]) => void;
}

const PROJECT_STATUSES: ProjectStatus[] = ['Idea', 'Planning', 'In Progress', 'Build', 'Launch', 'Completed', 'Abandoned'];
const PROJECT_TYPES: ProjectType[] = ['Personal', 'Professional', 'Education', 'Market', 'For Sale', 'Open Source', 'Other'];

const ProjectFormFields: React.FC<ProjectFormFieldsProps> = ({ formData, handleChange }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleChange('tags', formData.tags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name*</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Project name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Project description"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value as ProjectType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange('status', value as ProjectStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="usefulness">Usefulness Rating ({formData.usefulness})</Label>
        </div>
        <Slider
          id="usefulness"
          min={1}
          max={5}
          step={1}
          value={[formData.usefulness]}
          onValueChange={([value]) => handleChange('usefulness', value)}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="progress">Progress ({formData.progress}%)</Label>
        </div>
        <Slider
          id="progress"
          min={0}
          max={100}
          step={5}
          value={[formData.progress]}
          onValueChange={([value]) => handleChange('progress', value)}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="monetized"
          checked={formData.isMonetized}
          onCheckedChange={(checked) => handleChange('isMonetized', checked)}
        />
        <Label htmlFor="monetized" className="cursor-pointer">Monetized</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="newTag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            className="flex-1"
          />
          <Button type="button" onClick={handleAddTag} className="flex-shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map((tag, index) => (
            <div 
              key={index} 
              className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
            >
              {tag}
              <button 
                type="button" 
                onClick={() => handleRemoveTag(tag)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {formData.tags.length === 0 && (
            <span className="text-sm text-muted-foreground italic">No tags</span>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="githubUrl">GitHub URL</Label>
        <Input
          id="githubUrl"
          value={formData.githubUrl}
          onChange={(e) => handleChange('githubUrl', e.target.value)}
          placeholder="https://github.com/username/repo"
          type="url"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Website URL</Label>
        <Input
          id="websiteUrl"
          value={formData.websiteUrl}
          onChange={(e) => handleChange('websiteUrl', e.target.value)}
          placeholder="https://example.com"
          type="url"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nextAction">Next Action</Label>
        <Input
          id="nextAction"
          value={formData.nextAction}
          onChange={(e) => handleChange('nextAction', e.target.value)}
          placeholder="What's the next step?"
        />
      </div>
    </div>
  );
};

export default ProjectFormFields;
