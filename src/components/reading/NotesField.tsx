
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface NotesFieldProps {
  form: any;
  useTextarea?: boolean;
}

export const NotesField = ({ form, useTextarea = false }: NotesFieldProps) => {
  const { t } = useLanguage();

  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('addReading.notes')}</FormLabel>
          <FormControl>
            {useTextarea ? (
              <Textarea
                placeholder="Add notes about this reading (optional)"
                className="min-h-[80px]"
                {...field}
              />
            ) : (
              <Input
                placeholder="Add notes about this reading (optional)"
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
