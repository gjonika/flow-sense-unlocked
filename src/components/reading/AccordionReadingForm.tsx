
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MonthlyReadingsForm } from "./MonthlyReadingsForm";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface Supplier {
  id: string;
  name: string;
  utility_type: string;
}

export function AccordionReadingForm() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const { data, error } = await supabase
          .from("suppliers_utilities")
          .select("id, name, utility_type")
          .order("name");
          
        if (error) throw error;
        setSuppliers(data || []);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSuppliers();
  }, []);

  if (loading) {
    return <div>Loading suppliers...</div>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {suppliers.map(supplier => (
        <AccordionItem key={supplier.id} value={supplier.id}>
          <AccordionTrigger className="text-lg">
            {supplier.name} - {supplier.utility_type}
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-4">
              <MonthlyReadingsForm />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
