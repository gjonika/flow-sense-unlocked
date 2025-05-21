
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplier } from "@/utils/supplierData";

interface SupplierFieldProps {
  form: any;
  suppliers: Supplier[];
  selectedType: string;
}

export const SupplierField = ({ form, suppliers, selectedType }: SupplierFieldProps) => {
  const { t } = useLanguage();

  return (
    <FormField
      control={form.control}
      name="supplier"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('addReading.supplier')}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={!selectedType}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t('addReading.supplierDesc')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {suppliers.map(supplier => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            {t('addReading.supplierDesc')}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
