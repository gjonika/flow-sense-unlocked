
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChecklistTemplate } from '@/types/checklist';
import { useToast } from '@/hooks/use-toast';

export const useChecklistTemplates = () => {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('survey_templates')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load checklist templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    refetch: fetchTemplates,
  };
};
