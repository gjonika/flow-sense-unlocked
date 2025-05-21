
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { SupplierReadingCard } from "./SupplierReadingCard";
import { Supplier } from "@/utils/supplierData";

interface UtilitySectionProps {
  type: string;
  suppliers: Supplier[];
  form: any;
  lastReadings: Record<string, number | null>;
}

export const UtilitySection = ({
  type,
  suppliers,
  form,
  lastReadings,
}: UtilitySectionProps) => {
  const { t } = useLanguage();
  
  return (
    <AccordionItem key={type} value={type}>
      <AccordionTrigger className="text-lg font-medium">
        {t(`utility.${type}`)}
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 py-2">
          {suppliers.map((supplier) => {
            const readingIndex = form.getValues("readings").findIndex(
              (r: any) => r.utilityType === type && r.supplier === supplier.id
            );
            
            const lastReading = lastReadings[`${type}-${supplier.id}`];
            
            return (
              <SupplierReadingCard
                key={supplier.id}
                supplier={supplier}
                form={form}
                readingIndex={readingIndex}
                lastReading={lastReading}
              />
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
