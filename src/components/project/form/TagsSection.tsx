
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import EnhancedTagsInput from '@/components/project/EnhancedTagsInput';
import { ProjectFormValues } from '@/components/ProjectForm';
import FormFieldIcon from '@/components/ui/form-field-icon';

const TagsSection: React.FC = () => {
  const { control } = useFormContext<ProjectFormValues>();
  
  return (
    <FormField
      control={control}
      name="tags"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel htmlFor="tags" className="flex items-center gap-2">
            <FormFieldIcon type="tag" />
            Tags
          </FormLabel>
          <FormControl>
            <div className="group">
              <EnhancedTagsInput
                id="tags"
                value={field.value}
                onChange={field.onChange}
                className="transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20"
                maxTags={8}
              />
            </div>
          </FormControl>
          <FormDescription className="flex items-center gap-2 text-xs">
            <FormFieldIcon type="tag" className="h-3 w-3" />
            Add descriptive tags to organize and find your projects easily. Press Enter, comma, or select from suggestions.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TagsSection;
