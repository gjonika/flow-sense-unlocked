
import { useState, useCallback } from 'react';
import { get, set, del, keys } from 'idb-keyval';
import { supabase } from '@/integrations/supabase/client';
import { SurveyMedia } from '@/types/survey';
import { useToast } from '@/hooks/use-toast';

const OFFLINE_MEDIA_PREFIX = 'offline_media_';

interface OfflineMedia extends Omit<SurveyMedia, 'id' | 'storage_path'> {
  id: string;
  storage_path: string;
  file_data?: string; // Base64 encoded file data for offline storage
  sync_attempts?: number;
  last_sync_error?: string;
}

export const useMediaSync = () => {
  const [syncingMedia, setSyncingMedia] = useState<string[]>([]);
  const { toast } = useToast();

  // Save media file offline
  const saveMediaOffline = useCallback(async (
    surveyId: string,
    file: File,
    zoneId?: string
  ): Promise<string> => {
    const mediaId = `temp_media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Convert file to base64 for offline storage
    const fileData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const offlineMedia: OfflineMedia = {
      id: mediaId,
      survey_id: surveyId,
      zone_id: zoneId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: `temp/${mediaId}`,
      file_data: fileData,
      created_at: new Date().toISOString(),
      local_file_data: fileData,
      last_synced_at: '',
      needs_sync: true,
      sync_attempts: 0,
    };

    const offlineKey = `${OFFLINE_MEDIA_PREFIX}${mediaId}`;
    await set(offlineKey, offlineMedia);
    
    console.log('Media saved offline:', mediaId);
    return mediaId;
  }, []);

  // Sync a single media file to Supabase
  const syncMediaFile = useCallback(async (offlineMedia: OfflineMedia): Promise<SurveyMedia | null> => {
    try {
      if (!offlineMedia.file_data) {
        throw new Error('No file data available for sync');
      }

      // Convert base64 back to file
      const response = await fetch(offlineMedia.file_data);
      const blob = await response.blob();
      const file = new File([blob], offlineMedia.file_name, { type: offlineMedia.file_type });

      // Upload to Supabase Storage (placeholder - would need actual storage bucket)
      const fileName = `${offlineMedia.survey_id}/${Date.now()}_${offlineMedia.file_name}`;
      
      // For now, we'll store the media record in the database
      // In a full implementation, you'd upload to Supabase Storage first
      const { data, error } = await supabase
        .from('survey_media')
        .insert([{
          survey_id: offlineMedia.survey_id,
          zone_id: offlineMedia.zone_id,
          file_name: offlineMedia.file_name,
          file_type: offlineMedia.file_type,
          file_size: offlineMedia.file_size,
          storage_path: fileName,
          local_file_data: offlineMedia.file_data, // Store base64 temporarily
        }])
        .select()
        .single();

      if (error) throw error;

      // Remove from offline storage
      const offlineKey = `${OFFLINE_MEDIA_PREFIX}${offlineMedia.id}`;
      await del(offlineKey);

      console.log('Media synced successfully:', data.id);
      return data as SurveyMedia;
    } catch (error) {
      console.error('Failed to sync media:', error);
      
      // Update offline media with error info
      const updatedMedia = {
        ...offlineMedia,
        sync_attempts: (offlineMedia.sync_attempts || 0) + 1,
        last_sync_error: error instanceof Error ? error.message : 'Unknown error',
      };
      
      const offlineKey = `${OFFLINE_MEDIA_PREFIX}${offlineMedia.id}`;
      await set(offlineKey, updatedMedia);
      
      throw error;
    }
  }, []);

  // Sync all pending media files
  const syncAllPendingMedia = useCallback(async (): Promise<SurveyMedia[]> => {
    try {
      const allKeys = await keys();
      const mediaKeys = allKeys.filter(key => 
        typeof key === 'string' && key.startsWith(OFFLINE_MEDIA_PREFIX)
      ) as string[];

      if (mediaKeys.length === 0) {
        return [];
      }

      setSyncingMedia(mediaKeys);
      const syncedMedia: SurveyMedia[] = [];
      let errorCount = 0;

      for (const key of mediaKeys) {
        try {
          const offlineMedia = await get(key) as OfflineMedia;
          if (offlineMedia && offlineMedia.needs_sync) {
            const syncedFile = await syncMediaFile(offlineMedia);
            if (syncedFile) {
              syncedMedia.push(syncedFile);
            }
          }
        } catch (error) {
          console.error(`Failed to sync media with key ${key}:`, error);
          errorCount++;
        }
      }

      setSyncingMedia([]);

      if (syncedMedia.length > 0) {
        toast({
          title: "Media Sync Complete",
          description: `${syncedMedia.length} media file(s) synced${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        });
      }

      return syncedMedia;
    } catch (error) {
      console.error('Error during media sync:', error);
      setSyncingMedia([]);
      return [];
    }
  }, [syncMediaFile, toast]);

  // Get offline media for a survey
  const getOfflineMediaForSurvey = useCallback(async (surveyId: string): Promise<OfflineMedia[]> => {
    try {
      const allKeys = await keys();
      const mediaKeys = allKeys.filter(key => 
        typeof key === 'string' && key.startsWith(OFFLINE_MEDIA_PREFIX)
      ) as string[];

      const offlineMedia: OfflineMedia[] = [];
      
      for (const key of mediaKeys) {
        const media = await get(key) as OfflineMedia;
        if (media && media.survey_id === surveyId) {
          offlineMedia.push(media);
        }
      }

      return offlineMedia;
    } catch (error) {
      console.error('Failed to get offline media:', error);
      return [];
    }
  }, []);

  return {
    syncingMedia,
    saveMediaOffline,
    syncAllPendingMedia,
    getOfflineMediaForSurvey,
  };
};
