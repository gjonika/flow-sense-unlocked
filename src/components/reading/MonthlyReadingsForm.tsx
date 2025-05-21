import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyReadingDateField } from "./MonthlyReadingDateField";
import { UtilitySection } from "./UtilitySection";
import { useLastReadings } from "@/hooks/useLastReadings";
import { suppliersByType } from "@/utils/supplierData";

// Schema for the form
const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date.",
  }),
  readings: z.array(
    z.object({
      utilityType: z.string(),
      supplier: z.string(),
      reading: z.string().optional(),
      cost: z.string().min(1, "Cost is required"),
      notes: z.string().optional(),
    })
  ),
});

type FormData = z.infer<typeof formSchema>;

export function MonthlyReadingsForm() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lastReadings, fetchLastReadings } = useLastReadings();

  // Initialize form with all utility types
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      readings: Object.entries(suppliersByType).flatMap(([type, suppliers]) =>
        suppliers.map((supplier) => ({
          utilityType: type,
          supplier: supplier.id,
          reading: "",
          cost: "",
          notes: "",
        }))
      ),
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Filter out empty entries (where cost is empty)
      const validReadings = data.readings.filter(
        (reading) => reading.cost.trim() !== ""
      );
      
      // Prepare data for batch insert
      const readingsToInsert = validReadings.map((reading) => {
        const supplier = suppliersByType[reading.utilityType as keyof typeof suppliersByType]
          .find((s) => s.id === reading.supplier);
        
        return {
          readingdate: data.date.toISOString(),
          utilitytype: reading.utilityType,
          supplier: reading.supplier,
          reading: reading.reading ? parseFloat(reading.reading) : null,
          unit: supplier?.unit || null,
          amount: parseFloat(reading.cost),
          notes: reading.notes || null,
        };
      });
      
      // Skip if no valid readings
      if (readingsToInsert.length === 0) {
        toast({
          title: t('error.noReadings'),
          description: t('error.noReadingsDesc'),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Insert into Supabase
      const { error } = await supabase.from('utility_entries').insert(readingsToInsert);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: t('success.readings'),
        description: t('success.readingsDesc'),
      });
      
      // Reset form costs and readings, keep the date
      const currentDate = form.getValues("date");
      form.reset({
        date: currentDate,
        readings: Object.entries(suppliersByType).flatMap(([type, suppliers]) =>
          suppliers.map((supplier) => ({
            utilityType: type,
            supplier: supplier.id,
            reading: "",
            cost: "",
            notes: "",
          }))
        ),
      });
      
      // Refresh last readings
      fetchLastReadings();
      
    } catch (error) {
      console.error('Error saving readings:', error);
      toast({
        title: t('error.load'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('addMonthly.title')}</CardTitle>
        <CardDescription>{t('addMonthly.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Common date for all readings */}
            <MonthlyReadingDateField form={form} />

            <Accordion type="multiple" className="w-full" defaultValue={["electricity"]}>
              {Object.entries(suppliersByType).map(([type, suppliers]) => (
                <UtilitySection
                  key={type}
                  type={type}
                  suppliers={suppliers}
                  form={form}
                  lastReadings={lastReadings}
                />
              ))}
            </Accordion>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('addMonthly.submitting') : t('addMonthly.submit')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
