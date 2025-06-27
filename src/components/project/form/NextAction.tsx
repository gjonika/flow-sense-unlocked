
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

const NextAction: React.FC = () => {
  const { control } = useFormContext<ProjectFormValues>();
  
  return (
    <FormField
      control={control}
      name="nextAction"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="nextAction">Next Action</FormLabel>
          <FormControl>
            <Input 
              id="nextAction"
              placeholder="What's the next task to move this project forward?"
              {...field}
              value={field.value || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NextAction;
