
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
import TagsInput from '@/components/project/TagsInput';
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
              <TagsInput
                id="tags"
                value={field.value}
                onChange={field.onChange}
                className="transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20"
              />
            </div>
          </FormControl>
          <FormDescription className="flex items-center gap-2 text-xs">
            <FormFieldIcon type="tag" className="h-3 w-3" />
            Press Enter or comma to add a tag. Click the × to remove.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TagsSection;
