
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

interface UtilityTypeFieldProps {
  form: any;
}

export const UtilityTypeField = ({ form }: UtilityTypeFieldProps) => {
  const { t } = useLanguage();

  return (
    <FormField
      control={form.control}
      name="utilityType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('addReading.utilityType')}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t('addReading.utilityTypeDesc')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="electricity">{t('utility.electricity')}</SelectItem>
              <SelectItem value="gas">{t('utility.gas')}</SelectItem>
              <SelectItem value="hotWater">{t('utility.hotWater')}</SelectItem>
              <SelectItem value="water">{t('utility.water')}</SelectItem>
              <SelectItem value="housing">{t('utility.housing')}</SelectItem>
              <SelectItem value="internet">{t('utility.internet')}</SelectItem>
              <SelectItem value="phone">{t('utility.phone')}</SelectItem>
              <SelectItem value="renovation">{t('utility.renovation')}</SelectItem>
              <SelectItem value="loan">{t('utility.loan')}</SelectItem>
              <SelectItem value="interest">{t('utility.interest')}</SelectItem>
              <SelectItem value="insurance">{t('utility.insurance')}</SelectItem>
              <SelectItem value="waste">{t('utility.waste')}</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            {t('addReading.utilityTypeDesc')}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
