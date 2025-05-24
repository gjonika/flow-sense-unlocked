
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Image as ImageIcon, Download, Wifi, WifiOff } from 'lucide-react';
import { SurveyZone } from '@/types/survey';
import { useMediaSync } from '@/hooks/useMediaSync';
import { useSyncManager } from '@/hooks/useSyncManager';

interface MediaSectionProps {
  surveyId: string;
  zones: SurveyZone[];
}

const MediaSection = ({ surveyId, zones }: MediaSectionProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [offlineMedia, setOfflineMedia] = useState<any[]>([]);
  
  const { saveMediaOffline, getOfflineMediaForSurvey, syncingMedia } = useMediaSync();
  const { isOnline } = useSyncManager();

  // Load offline media for this survey
  useEffect(() => {
    const loadOfflineMedia = async () => {
      const media = await getOfflineMediaForSurvey(surveyId);
      setOfflineMedia(media);
    };
    loadOfflineMedia();
  }, [surveyId, getOfflineMediaForSurvey]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleCameraCapture = () => {
    // This would typically open the camera on mobile devices
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        setSelectedFiles(Array.from(files));
      }
    };
    input.click();
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      for (const file of selectedFiles) {
        if (isOnline) {
          // TODO: Implement direct Supabase Storage upload when online
          console.log('Would upload directly to Supabase:', file.name);
          await saveMediaOffline(surveyId, file, selectedZoneId || undefined);
        } else {
          // Save offline
          await saveMediaOffline(surveyId, file, selectedZoneId || undefined);
        }
      }
      
      // Refresh offline media list
      const updatedMedia = await getOfflineMediaForSurvey(surveyId);
      setOfflineMedia(updatedMedia);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm mb-4">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4 text-green-600" />
            <span className="text-green-600">Online - Media will sync automatically</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-600">Offline - Media saved locally</span>
          </>
        )}
      </div>

      {/* Media Capture */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Capture Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={handleCameraCapture}
                className="flex-1"
                variant="outline"
                disabled={uploading}
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
              <label className="flex-1">
                <Button 
                  asChild
                  variant="outline"
                  className="w-full"
                  disabled={uploading}
                >
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </span>
                </Button>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            {zones.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Associate with zone (optional):</label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">No specific zone</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.zone_name} ({zone.zone_type})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedFiles.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Selected Files:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="border rounded p-2 text-center">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={handleUpload} 
                  className="w-full"
                  disabled={uploading}
                >
                  {uploading ? 'Saving...' : `Save ${selectedFiles.length} file(s) ${isOnline ? 'Online' : 'Offline'}`}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Saved Media Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            Media Gallery
            {offlineMedia.length > 0 && (
              <Badge variant="secondary">
                {offlineMedia.length} file{offlineMedia.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {offlineMedia.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {offlineMedia.map((media) => (
                <div key={media.id} className="border rounded p-2 text-center">
                  {media.file_data && (
                    <img 
                      src={media.file_data} 
                      alt={media.file_name}
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                  )}
                  <p className="text-xs truncate">{media.file_name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(media.file_size || 0)}
                  </p>
                  <div className="flex justify-center mt-1">
                    {media.needs_sync ? (
                      <Badge variant="secondary" className="text-xs">
                        {syncingMedia.includes(`offline_media_${media.id}`) ? 'Syncing...' : 'Pending'}
                      </Badge>
                    ) : (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                        Synced
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No media files yet</h3>
              <p className="text-gray-500">Upload photos and videos to see them here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaSection;
