
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { suppliersByType } from "@/utils/supplierData";

export const useLastReadings = () => {
  const [lastReadings, setLastReadings] = useState<Record<string, number | null>>({});
  
  // Fetch last readings for all utility types
  const fetchLastReadings = async () => {
    try {
      const readings: Record<string, number | null> = {};
      
      for (const [type, suppliers] of Object.entries(suppliersByType)) {
        for (const supplier of suppliers) {
          if (supplier.requiresReading) {
            const { data, error } = await supabase
              .from('readings_utilities')
              .select('reading_value')
              .eq('supplier_id', supplier.id)
              .order('date', { ascending: false })
              .limit(1);
            
            if (!error && data && data.length > 0 && data[0].reading_value) {
              readings[`${type}-${supplier.id}`] = data[0].reading_value;
            } else {
              readings[`${type}-${supplier.id}`] = null;
            }
          }
        }
      }
      
      setLastReadings(readings);
    } catch (error) {
      console.error('Error fetching last readings:', error);
    }
  };

  // Initialize fetch on mount
  useEffect(() => {
    fetchLastReadings();
  }, []);

  return { lastReadings, fetchLastReadings };
};
