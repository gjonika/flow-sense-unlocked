
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { SupplierType, suppliersByType, Supplier } from "@/utils/supplierData";

export const useReadingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [suppliers, setSuppliers] = useState<Array<Supplier>>([]);
  const [requiresReading, setRequiresReading] = useState(true);
  const [lastReading, setLastReading] = useState<number | null>(null);
  const [unit, setUnit] = useState<string | undefined>(undefined);

  // Schema dynamically created based on whether reading is required
  const createSchema = (readingRequired: boolean) => {
    const baseSchema = {
      utilityType: z.string({
        required_error: "Please select a utility type.",
      }),
      supplier: z.string({
        required_error: "Please select a supplier.",
      }),
      cost: z.string().min(1, {
        message: "Cost is required.",
      }),
      date: z.date({
        required_error: "Please select a date.",
      }),
      notes: z.string().optional(),
    };
    
    if (readingRequired) {
      return z.object({
        ...baseSchema,
        reading: z.string().min(1, {
          message: "Reading value is required.",
        }),
      });
    } else {
      return z.object({
        ...baseSchema,
        reading: z.string().optional(),
      });
    }
  };

  const form = useForm<any>({
    resolver: zodResolver(createSchema(requiresReading)),
    defaultValues: {
      date: new Date(),
      notes: "",
      reading: "",
    },
  });

  // Update suppliers when utility type changes
  useEffect(() => {
    const type = form.watch("utilityType");
    if (type && type in suppliersByType) {
      const typeSuppliers = suppliersByType[type as SupplierType];
      setSuppliers(typeSuppliers);
      setSelectedType(type);
      
      // Reset supplier when type changes
      form.setValue("supplier", "");
    }
  }, [form.watch("utilityType")]);

  // Update reading requirements when supplier changes
  useEffect(() => {
    const supplier = form.watch("supplier");
    const selectedSupplier = suppliers.find(s => s.id === supplier);
    
    if (selectedSupplier) {
      setRequiresReading(!!selectedSupplier.requiresReading);
      setUnit(selectedSupplier.unit);
      
      // Fetch last reading if supplier requires reading
      if (selectedSupplier.requiresReading) {
        fetchLastReading(form.getValues("utilityType"), supplier);
      }
    }
  }, [form.watch("supplier"), suppliers]);

  // Fetch the last reading for this utility type and supplier
  const fetchLastReading = async (utilityType: string, supplier: string) => {
    try {
      const { data, error } = await supabase
        .from('utility_entries')
        .select('reading')
        .eq('utilitytype', utilityType)
        .eq('supplier', supplier)
        .order('readingdate', { ascending: false })
        .limit(1);
      
      if (!error && data && data.length > 0 && data[0].reading) {
        setLastReading(data[0].reading);
      } else {
        setLastReading(null);
      }
    } catch (error) {
      console.error('Error fetching last reading:', error);
      setLastReading(null);
    }
  };

  return {
    form,
    isSubmitting,
    setIsSubmitting,
    selectedType,
    suppliers,
    requiresReading,
    lastReading,
    unit
  };
};
