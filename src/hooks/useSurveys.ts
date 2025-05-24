import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Survey, ClientContact } from '@/types/survey';
import { useToast } from '@/hooks/use-toast';
import { useSyncManager } from './useSyncManager';

// Helper function to safely parse client contacts from JSON
const parseClientContacts = (data: any): ClientContact[] => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.filter(contact => 
      contact && 
      typeof contact === 'object' && 
      typeof contact.name === 'string'
    ).map(contact => ({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || ''
    }));
  }
  return [];
};

// Helper function to safely parse custom fields from JSON
const parseCustomFields = (data: any): { [key: string]: string } => {
  if (!data || typeof data !== 'object') return {};
  return data;
};

// Helper function to safely parse tools from array
const parseTools = (data: any): string[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(tool => typeof tool === 'string');
  return [];
};

export const useSurveys = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isOnline, saveOffline, getOfflineSurveys, syncAllPendingSurveys } = useSyncManager();

  const fetchSurveys = async () => {
    try {
      // Fetch online surveys
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data to match our Survey type with proper parsing
      const typedSurveys: Survey[] = (data || []).map(survey => ({
        ...survey,
        client_contacts: parseClientContacts(survey.client_contacts),
        custom_fields: parseCustomFields(survey.custom_fields),
        flight_details: parseCustomFields(survey.flight_details),
        hotel_details: parseCustomFields(survey.hotel_details),
        tools: parseTools(survey.tools),
        status: survey.status as Survey['status']
      }));

      // Get offline surveys
      const offlineSurveys = await getOfflineSurveys();
      
      // Combine online and offline surveys, avoiding duplicates
      const allSurveys = [...typedSurveys];
      
      // Add offline surveys that aren't already synced
      offlineSurveys.forEach(offlineSurvey => {
        if (!allSurveys.find(s => s.id === offlineSurvey.id)) {
          allSurveys.push(offlineSurvey as Survey);
        }
      });

      // Sort by created_at
      allSurveys.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setSurveys(allSurveys);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      
      // If online fetch fails, try to get offline surveys only
      try {
        const offlineSurveys = await getOfflineSurveys();
        setSurveys(offlineSurveys as Survey[]);
        if (offlineSurveys.length > 0) {
          toast({
            title: "Offline Mode",
            description: `Showing ${offlineSurveys.length} offline survey(s)`,
          });
        }
      } catch (offlineError) {
        console.error('Error fetching offline surveys:', offlineError);
        toast({
          title: "Error",
          description: "Failed to load surveys",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const createSurvey = async (surveyData: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>) => {
    try {
      if (isOnline) {
        // Try to save directly to Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Prepare data for Supabase with proper JSON conversion
        const supabaseData = {
          ...surveyData,
          user_id: user.id,
          client_contacts: surveyData.client_contacts as any,
          custom_fields: surveyData.custom_fields as any,
          flight_details: surveyData.flight_details as any,
          hotel_details: surveyData.hotel_details as any,
        };

        const { data, error } = await supabase
          .from('surveys')
          .insert([supabaseData])
          .select()
          .single();

        if (error) throw error;
        
        const typedSurvey: Survey = {
          ...data,
          client_contacts: parseClientContacts(data.client_contacts),
          custom_fields: parseCustomFields(data.custom_fields),
          flight_details: parseCustomFields(data.flight_details),
          hotel_details: parseCustomFields(data.hotel_details),
          tools: parseTools(data.tools),
          status: data.status as Survey['status']
        };
        
        setSurveys(prev => [typedSurvey, ...prev]);
        toast({
          title: "Success",
          description: "Survey created and saved online",
        });
        
        return typedSurvey;
      } else {
        // Save offline
        const surveyId = await saveOffline(surveyData);
        
        const offlineSurvey: Survey = {
          id: surveyId,
          user_id: 'offline_user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_synced_at: '',
          needs_sync: true,
          ...surveyData,
        };
        
        setSurveys(prev => [offlineSurvey, ...prev]);
        toast({
          title: "Saved Offline",
          description: "Survey saved locally and will sync when online",
        });
        
        return offlineSurvey;
      }
    } catch (error) {
      console.error('Error creating survey:', error);
      
      // Fallback to offline save
      try {
        const surveyId = await saveOffline(surveyData);
        
        const offlineSurvey: Survey = {
          id: surveyId,
          user_id: 'offline_user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_synced_at: '',
          needs_sync: true,
          ...surveyData,
        };
        
        setSurveys(prev => [offlineSurvey, ...prev]);
        toast({
          title: "Saved Offline",
          description: "Failed to save online, saved locally instead",
          variant: "destructive",
        });
        
        return offlineSurvey;
      } catch (offlineError) {
        console.error('Failed to save offline:', offlineError);
        toast({
          title: "Error",
          description: "Failed to create survey",
          variant: "destructive",
        });
        throw offlineError;
      }
    }
  };

  const updateSurvey = async (id: string, updates: Partial<Survey>) => {
    try {
      if (isOnline && !id.startsWith('temp_')) {
        // Try to update in Supabase
        const supabaseUpdates = {
          ...updates,
          ...(updates.client_contacts && { client_contacts: updates.client_contacts as any }),
          ...(updates.custom_fields && { custom_fields: updates.custom_fields as any }),
          ...(updates.flight_details && { flight_details: updates.flight_details as any }),
          ...(updates.hotel_details && { hotel_details: updates.hotel_details as any }),
        };

        const { data, error } = await supabase
          .from('surveys')
          .update(supabaseUpdates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        
        const typedSurvey: Survey = {
          ...data,
          client_contacts: parseClientContacts(data.client_contacts),
          custom_fields: parseCustomFields(data.custom_fields),
          flight_details: parseCustomFields(data.flight_details),
          hotel_details: parseCustomFields(data.hotel_details),
          tools: parseTools(data.tools),
          status: data.status as Survey['status']
        };
        
        setSurveys(prev => prev.map(s => s.id === id ? typedSurvey : s));
        toast({
          title: "Success",
          description: "Survey updated successfully",
        });
        
        return typedSurvey;
      } else {
        // Update locally (for offline surveys or when offline)
        setSurveys(prev => prev.map(s => 
          s.id === id 
            ? { ...s, ...updates, updated_at: new Date().toISOString(), needs_sync: true }
            : s
        ));
        
        toast({
          title: "Updated Offline",
          description: "Survey updated locally",
        });
        
        return surveys.find(s => s.id === id);
      }
    } catch (error) {
      console.error('Error updating survey:', error);
      toast({
        title: "Error",
        description: "Failed to update survey",
        variant: "destructive",
      });
      throw error;
    }
  };

  const syncPendingSurveys = async () => {
    try {
      const syncedSurveys = await syncAllPendingSurveys();
      if (syncedSurveys.length > 0) {
        // Refresh the surveys list
        await fetchSurveys();
      }
      return syncedSurveys;
    } catch (error) {
      console.error('Error syncing surveys:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  return {
    surveys,
    loading,
    createSurvey,
    updateSurvey,
    refetch: fetchSurveys,
    syncPendingSurveys,
    isOnline,
  };
};
