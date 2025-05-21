
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { Supplier } from "@/utils/supplierData";

interface SupplierReadingCardProps {
  supplier: Supplier;
  form: any;
  readingIndex: number;
  lastReading: number | null;
}

export const SupplierReadingCard = ({
  supplier,
  form,
  readingIndex,
  lastReading,
}: SupplierReadingCardProps) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-md">
      {/* Supplier Name */}
      <div>
        <FormLabel>{supplier.name}</FormLabel>
        {supplier.requiresReading && supplier.unit && (
          <p className="text-xs text-muted-foreground mt-1">
            {t('addMonthly.unit')}: {supplier.unit}
          </p>
        )}
      </div>
      
      {/* Reading Field (if required) */}
      <div>
        {supplier.requiresReading ? (
          <FormField
            control={form.control}
            name={`readings.${readingIndex}.reading`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addReading.reading')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={lastReading !== null ? `Previous: ${lastReading}` : t('addReading.enterReading')}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ) : (
          <p className="text-xs mt-6 text-muted-foreground">
            {t('addMonthly.noReading')}
          </p>
        )}
      </div>
      
      {/* Cost Field */}
      <FormField
        control={form.control}
        name={`readings.${readingIndex}.cost`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('addReading.cost')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. 65.50" />
            </FormControl>
          </FormItem>
        )}
      />
      
      {/* Notes Field */}
      <div className="col-span-1 md:col-span-3">
        <FormField
          control={form.control}
          name={`readings.${readingIndex}.notes`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('addReading.notes')}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={t('addReading.notesPlaceholder')}
                  className="min-h-[60px]"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
