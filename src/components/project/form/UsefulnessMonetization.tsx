
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ProjectFormValues } from '@/components/ProjectForm';

const UsefulnessMonetization: React.FC = () => {
  const { control } = useFormContext<ProjectFormValues>();
  const usefulnessOptions = [1, 2, 3, 4, 5];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Usefulness */}
      <FormField
        control={control}
        name="usefulness"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="usefulness">Usefulness Rating <span className="text-destructive">*</span></FormLabel>
            <Select
              onValueChange={(value) => field.onChange(parseInt(value))}
              value={field.value.toString()}
            >
              <FormControl>
                <SelectTrigger id="usefulness">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {usefulnessOptions.map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating} {rating === 1 ? 'Star' : 'Stars'} - {
                      rating === 1 ? "Not very useful" :
                      rating === 2 ? "Somewhat useful" :
                      rating === 3 ? "Useful" :
                      rating === 4 ? "Very useful" :
                      "Extremely useful"
                    }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Is Monetized */}
      <FormField
        control={control}
        name="isMonetized"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="block mb-4">Monetization</FormLabel>
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox 
                  id="isMonetized" 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <label 
                htmlFor="isMonetized" 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                This project generates revenue
              </label>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default UsefulnessMonetization;
