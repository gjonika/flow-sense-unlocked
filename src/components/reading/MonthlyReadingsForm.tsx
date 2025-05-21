
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { supabase } from "@/integrations/supabase/client";

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

type ReadingFormValues = z.infer<typeof formSchema>;

interface Supplier {
  id: string;
  name: string;
  utility_type: string;
  is_meter_based: boolean;
}

export function MonthlyReadingsForm() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [previousReading, setPreviousReading] = useState<string | null>(null);

  const form = useForm<ReadingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier_id: "",
      date: new Date(),
      reading_value: "",
      cost: "",
      notes: "",
    },
  });

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data, error } = await supabase
          .from("suppliers_utilities")
          .select("*");
        
        if (error) throw error;
        setSuppliers(data || []);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast({
          title: "Error",
          description: "Failed to load suppliers",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Watch for changes to supplier_id
  const supplierId = form.watch("supplier_id");

  // Fetch previous reading when supplier changes
  useEffect(() => {
    const fetchPreviousReading = async () => {
      if (!supplierId) return;
      
      // Find the selected supplier
      const supplier = suppliers.find(s => s.id === supplierId);
      setSelectedSupplier(supplier || null);
      
      if (!supplier?.is_meter_based) {
        setPreviousReading(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("readings_utilities")
          .select("reading_value")
          .eq("supplier_id", supplierId)
          .order("date", { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0 && data[0].reading_value) {
          setPreviousReading(data[0].reading_value.toString());
        } else {
          setPreviousReading(null);
        }
      } catch (error) {
        console.error("Error fetching previous reading:", error);
        setPreviousReading(null);
      }
    };

    fetchPreviousReading();
  }, [supplierId, suppliers]);

  const onSubmit = async (data: ReadingFormValues) => {
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
        description: "Reading saved successfully",
      });
      
      // Reset form
      form.reset({
        supplier_id: "",
        date: new Date(),
        reading_value: "",
        cost: "",
        notes: "",
      });
      
      setSelectedSupplier(null);
      setPreviousReading(null);
      
    } catch (error) {
      console.error("Error saving reading:", error);
      toast({
        title: "Error",
        description: "Failed to save reading",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Supplier Selection */}
          <FormField
            control={form.control}
            name="supplier_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Utility Supplier</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                    {...field}
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name} ({supplier.utility_type})
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Picker */}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reading Value (if meter-based) */}
          {selectedSupplier?.is_meter_based && (
            <FormField
              control={form.control}
              name="reading_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meter Reading</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={previousReading ? `Previous: ${previousReading}` : "Enter meter reading"}
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
  );
}
