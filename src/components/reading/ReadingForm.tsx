
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useReadingForm } from "@/hooks/useReadingForm";
import { UtilityTypeField } from "./UtilityTypeField";
import { SupplierField } from "./SupplierField";
import { DateField } from "./DateField";
import { CostField } from "./CostField";
import { ReadingField } from "./ReadingField";
import { NotesField } from "./NotesField";
import { format } from "date-fns";

export const ReadingForm = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const {
    form,
    isSubmitting,
    setIsSubmitting,
    selectedType,
    suppliers,
    requiresReading,
    lastReading,
    unit
  } = useReadingForm();

  // Form submission
  async function onSubmit(values: any) {
    setIsSubmitting(true);
    
    try {
      // Ensure we have the supplier_id
      if (!values.supplier) {
        throw new Error("Supplier is required");
      }
      
      // Prepare data for Supabase
      const entryData = {
        date: format(values.date, "yyyy-MM-dd"),
        supplier_id: values.supplier,
        reading_value: values.reading ? parseFloat(values.reading) : null,
        cost: parseFloat(values.cost),
        notes: values.notes || null
      };
      
      console.log("Submitting reading data:", entryData);
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('readings_utilities')
        .insert(entryData)
        .select();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Successfully saved reading:", data);
      
      toast({
        title: t('success.reading'),
        description: t('success.readingDesc'),
      });
      
      // Reset form
      form.reset({
        utilityType: "",
        supplier: "",
        reading: "",
        cost: "",
        date: new Date(),
        notes: "",
      });
      
    } catch (error: any) {
      console.error('Error saving reading:', error);
      toast({
        title: t('error.load'),
        description: error.message || String(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{t('addReading.formTitle')}</h2>
      <p className="text-muted-foreground mb-6">
        {t('addReading.formDescription')}
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UtilityTypeField form={form} />
            <SupplierField form={form} suppliers={suppliers} selectedType={selectedType} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateField form={form} />
            <CostField form={form} />
          </div>

          {(selectedType && form.watch("supplier")) && (
            <ReadingField 
              form={form} 
              requiresReading={requiresReading}
              lastReading={lastReading}
              unit={unit}
            />
          )}

          <NotesField form={form} />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('addReading.submitting') : t('addReading.submit')}
          </Button>
        </form>
      </Form>
    </div>
  );
};
