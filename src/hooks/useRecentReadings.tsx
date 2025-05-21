
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ReadingEntry {
  id: string;
  date: string;
  supplier_id: string;
  reading_value: number | null;
  unit: string | null;
  cost: number;
  notes?: string | null;
  user_id: string | null;
  // Add these properties for compatibility with the component
  utility_type?: string;
  supplier_name?: string;
}

interface UseRecentReadingsProps {
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ascending' | 'descending';
}

export function useRecentReadings({
  limit = 5,
  orderBy = 'date',
  orderDirection = 'descending'
}: UseRecentReadingsProps = {}) {
  const [readings, setReadings] = useState<ReadingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Only fetch data when we have a user
    if (!user) return;
    
    const fetchRecentReadings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('readings_utilities')
          .select('id, date, supplier_id, reading_value, cost, notes, user_id, suppliers_utilities(name, utility_type, unit)')
          .order(orderBy, { ascending: orderDirection === 'ascending' })
          .limit(limit);
          
        if (error) throw new Error(error.message);
        
        // Transform the data to include the supplier information
        const formattedReadings: ReadingEntry[] = data?.map(reading => ({
          id: reading.id,
          date: reading.date,
          supplier_id: reading.supplier_id,
          reading_value: reading.reading_value,
          cost: reading.cost,
          notes: reading.notes,
          user_id: reading.user_id,
          utility_type: reading.suppliers_utilities?.utility_type,
          supplier_name: reading.suppliers_utilities?.name,
          unit: reading.suppliers_utilities?.unit
        })) || [];
        
        setReadings(formattedReadings);
      } catch (err) {
        console.error('Error fetching recent readings:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentReadings();
  }, [limit, orderBy, orderDirection, user]);

  const refetch = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('readings_utilities')
        .select('id, date, supplier_id, reading_value, cost, notes, user_id, suppliers_utilities(name, utility_type, unit)')
        .order(orderBy, { ascending: orderDirection === 'ascending' })
        .limit(limit);
        
      if (error) throw new Error(error.message);
      
      // Transform the data to include the supplier information
      const formattedReadings: ReadingEntry[] = data?.map(reading => ({
        id: reading.id,
        date: reading.date,
        supplier_id: reading.supplier_id,
        reading_value: reading.reading_value,
        cost: reading.cost,
        notes: reading.notes,
        user_id: reading.user_id,
        utility_type: reading.suppliers_utilities?.utility_type,
        supplier_name: reading.suppliers_utilities?.name,
        unit: reading.suppliers_utilities?.unit
      })) || [];
      
      setReadings(formattedReadings);
    } catch (err) {
      console.error('Error refetching recent readings:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return { readings, loading, error, refetch };
}
