
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SurveyZone, SurveyNote } from '@/types/survey';
import { useToast } from '@/hooks/use-toast';

export const useSurveyZones = (surveyId: string) => {
  const [zones, setZones] = useState<SurveyZone[]>([]);
  const [notes, setNotes] = useState<SurveyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchZones = async () => {
    if (!surveyId) return;
    
    try {
      const { data, error } = await supabase
        .from('survey_zones')
        .select('*')
        .eq('survey_id', surveyId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Cast the data to match our SurveyZone type
      const typedZones: SurveyZone[] = (data || []).map(zone => ({
        ...zone,
        zone_type: zone.zone_type as SurveyZone['zone_type']
      }));
      
      setZones(typedZones);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const fetchNotes = async () => {
    if (!surveyId) return;
    
    try {
      const { data, error } = await supabase
        .from('survey_notes')
        .select('*')
        .eq('survey_id', surveyId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createZone = async (zoneName: string, zoneType: SurveyZone['zone_type']) => {
    try {
      const { data, error } = await supabase
        .from('survey_zones')
        .insert([{
          survey_id: surveyId,
          zone_name: zoneName,
          zone_type: zoneType,
        }])
        .select()
        .single();

      if (error) throw error;
      
      const typedZone: SurveyZone = {
        ...data,
        zone_type: data.zone_type as SurveyZone['zone_type']
      };
      
      setZones(prev => [...prev, typedZone]);
      toast({
        title: "Success",
        description: "Zone created successfully",
      });
      
      return typedZone;
    } catch (error) {
      console.error('Error creating zone:', error);
      toast({
        title: "Error",
        description: "Failed to create zone",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createNote = async (zoneId: string, noteContent: string) => {
    try {
      const { data, error } = await supabase
        .from('survey_notes')
        .insert([{
          survey_id: surveyId,
          zone_id: zoneId,
          note_content: noteContent,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Note added successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (surveyId) {
      fetchZones();
      fetchNotes();
    }
  }, [surveyId]);

  return {
    zones,
    notes,
    loading,
    createZone,
    createNote,
    refetch: () => {
      fetchZones();
      fetchNotes();
    },
  };
};
