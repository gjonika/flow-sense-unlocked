
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useReadingForm } from "@/hooks/useReadingForm";
import { UtilityTypeField } from "./UtilityTypeField";
import { SupplierField } from "./SupplierField";
import { DateField } from "./DateField";
import { CostField } from "./CostField";
import { ReadingField } from "./ReadingField";
import { NotesField } from "./NotesField";

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
      // Prepare data for Supabase
      const entryData = {
        readingdate: values.date.toISOString(),
        utilitytype: values.utilityType,
        supplier: values.supplier,
        reading: values.reading ? parseFloat(values.reading) : null,
        unit: unit || null,
        amount: parseFloat(values.cost),
        notes: values.notes || null
      };
      
      // Insert into Supabase
      const { error } = await supabase.from('utility_entries').insert(entryData);
      
      if (error) {
        throw error;
      }
      
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
      
    } catch (error) {
      console.error('Error saving reading:', error);
      toast({
        title: t('error.load'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t('addReading.formTitle')}</CardTitle>
        <CardDescription>
          {t('addReading.formDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
