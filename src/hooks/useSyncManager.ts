
import { useState, useEffect, useCallback } from 'react';
import { get, set, del, keys } from 'idb-keyval';
import { supabase } from '@/integrations/supabase/client';
import { Survey, ClientContact } from '@/types/survey';
import { useToast } from '@/hooks/use-toast';
import { useMediaSync } from './useMediaSync';

export type SyncStatus = 'draft' | 'saved' | 'synced' | 'error' | 'pending';

interface SurveyWithSyncStatus extends Survey {
  syncStatus: SyncStatus;
  lastSyncAttempt?: string;
  syncError?: string;
}

const OFFLINE_SURVEY_PREFIX = 'offline_survey_';
const SYNC_RETRY_DELAY = 5000; // 5 seconds between retry attempts
const MAX_SYNC_RETRIES = 3;

// Helper functions for type conversion
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

const parseCustomFields = (data: any): { [key: string]: string } => {
  if (!data || typeof data !== 'object') return {};
  return data;
};

const parseTools = (data: any): string[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(tool => typeof tool === 'string');
  return [];
};

export const useSyncManager = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncingCount, setSyncingCount] = useState(0);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const { toast } = useToast();
  const { syncAllPendingMedia } = useMediaSync();

  // Monitor online/offline status with enhanced detection
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network status: ONLINE');
      setIsOnline(true);
      setRetryAttempts(0);
    };
    
    const handleOffline = () => {
      console.log('Network status: OFFLINE');
      setIsOnline(false);
    };

    // Additional connectivity check using fetch
    const checkConnectivity = async () => {
      try {
        const response = await fetch('/ping', { 
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(5000)
        });
        const actuallyOnline = response.ok;
        if (actuallyOnline !== isOnline) {
          setIsOnline(actuallyOnline);
        }
      } catch {
        if (isOnline) {
          setIsOnline(false);
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connectivity check
    const connectivityInterval = setInterval(checkConnectivity, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(connectivityInterval);
    };
  }, [isOnline]);

  // Save survey to IndexedDB
  const saveOffline = useCallback(async (survey: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>, tempId?: string): Promise<string> => {
    const surveyId = tempId || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const offlineKey = `${OFFLINE_SURVEY_PREFIX}${surveyId}`;
    
    const offlineSurvey: SurveyWithSyncStatus = {
      id: surveyId,
      user_id: 'offline_user', // Will be updated when synced
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_synced_at: '',
      needs_sync: true,
      syncStatus: 'pending',
      ...survey,
    };

    await set(offlineKey, offlineSurvey);
    console.log('Survey saved offline with comprehensive data:', surveyId);
    
    return surveyId;
  }, []);

  // Sync a single survey to Supabase with retry logic
  const syncSurvey = useCallback(async (offlineSurvey: SurveyWithSyncStatus, retryCount = 0): Promise<Survey | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Prepare data for Supabase
      const supabaseData = {
        client_name: offlineSurvey.client_name,
        client_country: offlineSurvey.client_country,
        client_contacts: offlineSurvey.client_contacts as any,
        ship_name: offlineSurvey.ship_name,
        survey_location: offlineSurvey.survey_location,
        survey_date: offlineSurvey.survey_date,
        project_scope: offlineSurvey.project_scope,
        duration: offlineSurvey.duration,
        tools: offlineSurvey.tools,
        custom_fields: offlineSurvey.custom_fields as any,
        flight_details: offlineSurvey.flight_details as any,
        hotel_details: offlineSurvey.hotel_details as any,
        status: offlineSurvey.status,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('surveys')
        .insert([supabaseData])
        .select()
        .single();

      if (error) throw error;

      // Convert the Supabase data back to Survey type with proper parsing
      const typedSurvey: Survey = {
        ...data,
        client_contacts: parseClientContacts(data.client_contacts),
        custom_fields: parseCustomFields(data.custom_fields),
        flight_details: parseCustomFields(data.flight_details),
        hotel_details: parseCustomFields(data.hotel_details),
        tools: parseTools(data.tools),
        status: data.status as Survey['status']
      };

      // Remove from offline storage after successful sync
      const offlineKey = `${OFFLINE_SURVEY_PREFIX}${offlineSurvey.id}`;
      await del(offlineKey);

      console.log('Survey synced successfully with all data:', typedSurvey.id);
      return typedSurvey;
    } catch (error) {
      console.error(`Failed to sync survey (attempt ${retryCount + 1}):`, error);
      
      // Retry logic for temporary failures
      if (retryCount < MAX_SYNC_RETRIES && isOnline) {
        console.log(`Retrying sync in ${SYNC_RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, SYNC_RETRY_DELAY));
        return syncSurvey(offlineSurvey, retryCount + 1);
      }
      
      // Update offline survey with error status
      const offlineKey = `${OFFLINE_SURVEY_PREFIX}${offlineSurvey.id}`;
      const updatedSurvey = {
        ...offlineSurvey,
        syncStatus: 'error' as SyncStatus,
        syncError: error instanceof Error ? error.message : 'Unknown error',
        lastSyncAttempt: new Date().toISOString(),
      };
      await set(offlineKey, updatedSurvey);
      
      throw error;
    }
  }, [isOnline]);

  // Sync all pending surveys and media
  const syncAllPendingSurveys = useCallback(async (): Promise<Survey[]> => {
    if (!isOnline) {
      console.log('Cannot sync: offline');
      return [];
    }

    try {
      const allKeys = await keys();
      const offlineKeys = allKeys.filter(key => 
        typeof key === 'string' && key.startsWith(OFFLINE_SURVEY_PREFIX)
      ) as string[];

      if (offlineKeys.length === 0) {
        console.log('No pending surveys to sync');
        // Still attempt to sync media files
        await syncAllPendingMedia();
        return [];
      }

      setSyncingCount(offlineKeys.length);
      const syncedSurveys: Survey[] = [];
      let errorCount = 0;

      // Sync surveys first
      for (const key of offlineKeys) {
        try {
          const offlineSurvey = await get(key) as SurveyWithSyncStatus;
          if (offlineSurvey && offlineSurvey.syncStatus === 'pending') {
            const syncedSurvey = await syncSurvey(offlineSurvey);
            if (syncedSurvey) {
              syncedSurveys.push(syncedSurvey);
            }
          }
        } catch (error) {
          console.error(`Failed to sync survey with key ${key}:`, error);
          errorCount++;
        }
      }

      // Then sync media files
      await syncAllPendingMedia();

      setSyncingCount(0);

      if (syncedSurveys.length > 0) {
        toast({
          title: "Sync Complete",
          description: `${syncedSurveys.length} survey(s) synced successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        });
      }

      if (errorCount > 0 && syncedSurveys.length === 0) {
        setRetryAttempts(prev => prev + 1);
        toast({
          title: "Sync Failed",
          description: `Failed to sync ${errorCount} survey(s). Will retry automatically.`,
          variant: "destructive",
        });
      }

      return syncedSurveys;
    } catch (error) {
      console.error('Error during comprehensive sync:', error);
      setSyncingCount(0);
      toast({
        title: "Sync Error",
        description: "Failed to sync surveys and media",
        variant: "destructive",
      });
      return [];
    }
  }, [isOnline, syncSurvey, syncAllPendingMedia, toast]);

  // Get all offline surveys
  const getOfflineSurveys = useCallback(async (): Promise<SurveyWithSyncStatus[]> => {
    try {
      const allKeys = await keys();
      const offlineKeys = allKeys.filter(key => 
        typeof key === 'string' && key.startsWith(OFFLINE_SURVEY_PREFIX)
      ) as string[];

      const offlineSurveys: SurveyWithSyncStatus[] = [];
      
      for (const key of offlineKeys) {
        const survey = await get(key) as SurveyWithSyncStatus;
        if (survey) {
          offlineSurveys.push(survey);
        }
      }

      return offlineSurveys.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (error) {
      console.error('Failed to get offline surveys:', error);
      return [];
    }
  }, []);

  // Auto-sync when coming online with exponential backoff
  useEffect(() => {
    if (isOnline && retryAttempts < MAX_SYNC_RETRIES) {
      const delay = Math.min(1000 * Math.pow(2, retryAttempts), 30000); // Max 30 seconds
      const timeoutId = setTimeout(() => {
        console.log('Attempting auto-sync after connectivity restoration...');
        syncAllPendingSurveys();
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [isOnline, syncAllPendingSurveys, retryAttempts]);

  // Periodic sync attempt for failed syncs
  useEffect(() => {
    if (isOnline && retryAttempts > 0 && retryAttempts < MAX_SYNC_RETRIES) {
      const retryInterval = setInterval(() => {
        console.log('Periodic retry attempt for failed syncs...');
        syncAllPendingSurveys();
      }, 60000); // Every minute

      return () => clearInterval(retryInterval);
    }
  }, [isOnline, retryAttempts, syncAllPendingSurveys]);

  return {
    isOnline,
    syncingCount,
    retryAttempts,
    saveOffline,
    syncAllPendingSurveys,
    getOfflineSurveys,
    syncSurvey,
  };
};
