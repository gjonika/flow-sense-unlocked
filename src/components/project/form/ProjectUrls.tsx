
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProjectFormValues } from '@/components/ProjectForm';
import FormFieldIcon from '@/components/ui/form-field-icon';

const ProjectUrls: React.FC = () => {
  const { control } = useFormContext<ProjectFormValues>();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* GitHub URL */}
      <FormField
        control={control}
        name="githubUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="githubUrl" className="flex items-center gap-2">
              <FormFieldIcon type="github" />
              GitHub URL
            </FormLabel>
            <FormControl>
              <div className="group relative">
                <Input 
                  id="githubUrl"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  {...field}
                  value={field.value || ''}
                  className="pl-10 transition-all duration-200 focus:pl-10"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FormFieldIcon type="github" className="h-4 w-4" />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Website URL */}
      <FormField
        control={control}
        name="websiteUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="websiteUrl" className="flex items-center gap-2">
              <FormFieldIcon type="website" />
              Website URL
            </FormLabel>
            <FormControl>
              <div className="group relative">
                <Input 
                  id="websiteUrl"
                  type="url"
                  placeholder="https://yourproject.com"
                  {...field}
                  value={field.value || ''}
                  className="pl-10 transition-all duration-200 focus:pl-10"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FormFieldIcon type="website" className="h-4 w-4" />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProjectUrls;
