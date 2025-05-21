
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema with Zod
const formSchema = z.object({
  supplier_id: z.string().min(1, "Supplier is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  reading_value: z.string().optional(),
  cost: z.string().min(1, "Cost is required"),
  notes: z.string().optional(),
});

interface Supplier {
  id: string;
  name: string;
  utility_type: string;
  is_meter_based: boolean;
}

export function AccordionReadingForm() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null);
  const [previousReadings, setPreviousReadings] = useState<Record<string, number | null>>({});

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier_id: "",
      date: new Date(),
      reading_value: "",
      cost: "",
      notes: "",
    },
  });

  // Group suppliers by utility type
  const suppliersByType = suppliers.reduce((acc, supplier) => {
    if (!acc[supplier.utility_type]) {
      acc[supplier.utility_type] = [];
    }
    acc[supplier.utility_type].push(supplier);
    return acc;
  }, {} as Record<string, Supplier[]>);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const { data, error } = await supabase
          .from("suppliers_utilities")
          .select("id, name, utility_type, is_meter_based")
          .order("utility_type, name");
          
        if (error) throw error;
        
        setSuppliers(data || []);

        // Fetch previous readings for all suppliers
        const supplierIds = data?.map(s => s.id) || [];
        await fetchPreviousReadings(supplierIds);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast({
          title: "Error",
          description: "Could not load suppliers. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchSuppliers();
  }, []);

  const fetchPreviousReadings = async (supplierIds: string[]) => {
    if (!supplierIds.length) return;
    
    try {
      const readings: Record<string, number | null> = {};
      
      for (const supplierId of supplierIds) {
        const { data, error } = await supabase
          .from("readings_utilities")
          .select("reading_value")
          .eq("supplier_id", supplierId)
          .order("date", { ascending: false })
          .limit(1);
          
        readings[supplierId] = (data && data[0]?.reading_value) || null;
      }
      
      setPreviousReadings(readings);
    } catch (error) {
      console.error("Error fetching previous readings:", error);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>, supplier: Supplier) => {
    try {
      const formattedDate = format(data.date, "yyyy-MM-dd");
      
      const readingPayload = {
        supplier_id: data.supplier_id,
        date: formattedDate,
        reading_value: data.reading_value ? parseFloat(data.reading_value) : null,
        cost: parseFloat(data.cost),
        notes: data.notes || null,
      };
      
      const { error } = await supabase
        .from("readings_utilities")
        .insert([readingPayload]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Reading saved for ${supplier.name}`,
      });
      
      // Reset form for this supplier
      form.reset({
        supplier_id: "",
        date: new Date(),
        reading_value: "",
        cost: "",
        notes: "",
      });
      
      // Refresh previous readings
      await fetchPreviousReadings([supplier.id]);
      
      // Close the accordion item
      setExpandedSupplier(null);
      
    } catch (error: any) {
      console.error("Error saving reading:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save reading",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading suppliers...</div>;
  }

  if (Object.keys(suppliersByType).length === 0) {
    return <div className="p-4 text-center">No suppliers found. Add suppliers to enter readings.</div>;
  }

  return (
    <Accordion 
      type="single" 
      collapsible 
      className="w-full"
      value={expandedSupplier || undefined}
      onValueChange={(value) => setExpandedSupplier(value)}
    >
      {Object.entries(suppliersByType).map(([type, typeSuppliers]) => (
        <AccordionItem key={type} value={`type-${type}`}>
          <AccordionTrigger className="text-lg font-medium capitalize">
            {type}
          </AccordionTrigger>
          <AccordionContent>
            <Accordion type="single" collapsible className="w-full">
              {typeSuppliers.map(supplier => (
                <AccordionItem key={supplier.id} value={supplier.id}>
                  <AccordionTrigger className="text-md">
                    {supplier.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4 pb-2">
                      <Form {...form}>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          form.setValue("supplier_id", supplier.id);
                          form.handleSubmit((data) => onSubmit(data, supplier))();
                        }} 
                        className="space-y-6">
                          <input type="hidden" {...form.register("supplier_id")} value={supplier.id} />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date Field */}
                            <FormField
                              control={form.control}
                              name="date"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Reading Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Cost */}
                            <FormField
                              control={form.control}
                              name="cost"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cost</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter cost"
                                      type="number"
                                      step="0.01"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Reading Value (if meter-based) */}
                          {supplier.is_meter_based && (
                            <FormField
                              control={form.control}
                              name="reading_value"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Meter Reading</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={previousReadings[supplier.id] !== undefined && previousReadings[supplier.id] !== null 
                                        ? `Previous reading: ${previousReadings[supplier.id]}` 
                                        : "Enter meter reading"}
                                      type="number"
                                      step="0.01"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {/* Notes */}
                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Any additional notes (optional)"
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Submit Button */}
                          <Button 
                            type="submit" 
                            className="w-full bg-[#d1b37f] hover:bg-[#c4a66e]"
                          >
                            Save Reading
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
