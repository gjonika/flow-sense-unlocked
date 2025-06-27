
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel,
  FormControl,
  FormMessage 
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { ProjectFormValues } from '@/components/ProjectForm';

const ProgressSlider: React.FC = () => {
  const { control } = useFormContext<ProjectFormValues>();

  return (
    <FormField
      control={control}
      name="progress"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <div className="flex justify-between">
            <FormLabel htmlFor="progress">Progress ({field.value}%)</FormLabel>
            <span className="text-sm text-muted-foreground">{
              field.value < 25 ? "Just started" :
              field.value < 50 ? "Making progress" :
              field.value < 75 ? "Good progress" :
              field.value < 100 ? "Almost there" :
              "Complete"
            }</span>
          </div>
          <FormControl>
            <Slider
              id="progress"
              value={[field.value]}
              max={100}
              step={5}
              onValueChange={(values) => field.onChange(values[0])}
              className="cursor-pointer"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProgressSlider;
