
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ProjectFormValues } from '@/components/ProjectForm';

const ProjectStatusType: React.FC = () => {
  const { control } = useFormContext<ProjectFormValues>();
  
  const projectStatusOptions = [
    'Idea', 'Planning', 'In Progress', 'Build', 'Launch', 'Completed', 'Abandoned'
  ];

  const projectTypeOptions = [
    'Personal', 'Professional', 'Education', 'Market', 'For Sale', 'Open Source', 'Other'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Project Status */}
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="status">Project Status <span className="text-destructive">*</span></FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {projectStatusOptions.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>{statusOption}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Project Type */}
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="type">Project Type <span className="text-destructive">*</span></FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {projectTypeOptions.map((typeOption) => (
                  <SelectItem key={typeOption} value={typeOption}>{typeOption}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProjectStatusType;
