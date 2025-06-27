
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ProjectFormValues } from '@/components/ProjectForm';

const AnalysisTextInput: React.FC = () => {
  const { control } = useFormContext<ProjectFormValues>();
  
  return (
    <FormField
      control={control}
      name="analysisText"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project Analysis</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Paste your project analysis here. This could be from ChatGPT, research notes, production readiness reports, diagnostic analysis, or any detailed breakdown of your project..."
              rows={6}
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

export default AnalysisTextInput;
