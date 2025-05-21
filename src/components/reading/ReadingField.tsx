
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

interface ReadingFieldProps {
  form: any;
  requiresReading: boolean;
  lastReading: number | null;
  unit?: string;
}

export const ReadingField = ({ 
  form, 
  requiresReading, 
  lastReading, 
  unit 
}: ReadingFieldProps) => {
  const { t } = useLanguage();

  return (
    <FormField
      control={form.control}
      name="reading"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('addReading.reading')}</FormLabel>
          <FormControl>
            <div className="flex items-center">
              <Input 
                placeholder={lastReading !== null ? `Previous: ${lastReading}` : "e.g. 120"} 
                {...field}
                disabled={!requiresReading}
              />
              {unit && <span className="ml-2">{unit}</span>}
            </div>
          </FormControl>
          <FormDescription>
            {requiresReading 
              ? t('addReading.readingDesc')
              : "This utility type doesn't require meter readings"
            }
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
