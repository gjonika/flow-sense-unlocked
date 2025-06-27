
import { useState, useCallback } from 'react';
import { get, set, del, keys } from 'idb-keyval';
import { supabase } from '@/integrations/supabase/client';
import { ChecklistResponse, ChecklistMedia } from '@/types/checklist';
import { useToast } from '@/hooks/use-toast';
import { useSyncManager } from './useSyncManager';

const OFFLINE_RESPONSE_PREFIX = 'offline_checklist_response_';
const OFFLINE_MEDIA_PREFIX = 'offline_checklist_media_';

export const useChecklistResponses = () => {
  const [responses, setResponses] = useState<ChecklistResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isOnline } = useSyncManager();

  const saveResponse = useCallback(async (
    surveyId: string,
    questionId: string,
    questionCategory: string,
    questionText: string,
    responseType: 'yes' | 'no' | 'na' | 'skipped',
    isMandatory: boolean,
    notes?: string,
    zoneId?: string,
    assetTag?: string,
    qrCode?: string,
    rfidTag?: string
  ): Promise<string> => {
    const responseId = `temp_response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const response: ChecklistResponse = {
      id: responseId,
      survey_id: surveyId,
      zone_id: zoneId,
      question_id: questionId,
      question_category: questionCategory,
      question_text: questionText,
      response_type: responseType,
      is_mandatory: isMandatory,
      notes,
      asset_tag: assetTag,
      qr_code: qrCode,
      rfid_tag: rfidTag,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      needs_sync: true,
    };

    if (isOnline) {
      try {
        const { data, error } = await supabase
          .from('survey_checklist_responses')
          .insert([response])
          .select()
          .single();

        if (error) throw error;
        
        toast({
          title: "Response Saved",
          description: "Checklist response saved successfully",
        });
        
        return data.id;
      } catch (error) {
        console.error('Failed to save response online, saving offline:', error);
      }
    }

    // Save offline
    const offlineKey = `${OFFLINE_RESPONSE_PREFIX}${responseId}`;
    await set(offlineKey, response);
    
    toast({
      title: "Saved Offline",
      description: "Response saved locally and will sync when online",
    });
    
    return responseId;
  }, [isOnline, toast]);

  const saveMediaEvidence = useCallback(async (
    responseId: string,
    surveyId: string,
    file: File,
    evidenceType: 'defect' | 'compliance' | 'reference' = 'defect'
  ): Promise<string> => {
    const mediaId = `temp_media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Convert file to base64 for offline storage
    const fileData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const media: ChecklistMedia = {
      id: mediaId,
      response_id: responseId,
      survey_id: surveyId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: `checklist/${surveyId}/${mediaId}`,
      local_file_data: fileData,
      evidence_type: evidenceType,
      created_at: new Date().toISOString(),
      needs_sync: true,
    };

    if (isOnline) {
      try {
        const { data, error } = await supabase
          .from('survey_checklist_media')
          .insert([media])
          .select()
          .single();

        if (error) throw error;
        return data.id;
      } catch (error) {
        console.error('Failed to save media online, saving offline:', error);
      }
    }

    // Save offline
    const offlineKey = `${OFFLINE_MEDIA_PREFIX}${mediaId}`;
    await set(offlineKey, media);
    
    return mediaId;
  }, [isOnline]);

  const getResponsesForSurvey = useCallback(async (surveyId: string): Promise<ChecklistResponse[]> => {
    try {
      // Get online responses
      const { data: onlineResponses, error } = await supabase
        .from('survey_checklist_responses')
        .select('*')
        .eq('survey_id', surveyId);

      if (error) throw error;

      // Get offline responses
      const allKeys = await keys();
      const responseKeys = allKeys.filter(key => 
        typeof key === 'string' && key.startsWith(OFFLINE_RESPONSE_PREFIX)
      ) as string[];

      const offlineResponses: ChecklistResponse[] = [];
      for (const key of responseKeys) {
        const response = await get(key) as ChecklistResponse;
        if (response && response.survey_id === surveyId) {
          offlineResponses.push(response);
        }
      }

      // Combine and deduplicate
      const allResponses = [...(onlineResponses || []), ...offlineResponses];
      const uniqueResponses = allResponses.filter((response, index, arr) => 
        arr.findIndex(r => r.question_id === response.question_id) === index
      );

      return uniqueResponses;
    } catch (error) {
      console.error('Error fetching responses:', error);
      return [];
    }
  }, []);

  return {
    responses,
    loading,
    saveResponse,
    saveMediaEvidence,
    getResponsesForSurvey,
  };
};
