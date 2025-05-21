
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

interface CostFieldProps {
  form: any;
}

export const CostField = ({ form }: CostFieldProps) => {
  const { t } = useLanguage();

  return (
    <FormField
      control={form.control}
      name="cost"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('addReading.cost')}</FormLabel>
          <FormControl>
            <Input placeholder="e.g. 65.50" {...field} />
          </FormControl>
          <FormDescription>
            {t('addReading.costDesc')}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
