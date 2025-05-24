
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Upload, Image as ImageIcon, Download } from 'lucide-react';
import { SurveyZone } from '@/types/survey';

interface MediaSectionProps {
  surveyId: string;
  zones: SurveyZone[];
}

const MediaSection = ({ surveyId, zones }: MediaSectionProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');

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

    // TODO: Implement actual file upload to Supabase storage
    console.log('Uploading files:', selectedFiles);
    console.log('To survey:', surveyId);
    console.log('To zone:', selectedZoneId);
    
    // For now, just clear the selected files
    setSelectedFiles([]);
  };

  return (
    <div className="space-y-6">
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
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
              <label className="flex-1">
                <Button 
                  asChild
                  variant="outline"
                  className="w-full"
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
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ))}
                </div>
                <Button onClick={handleUpload} className="w-full">
                  Upload {selectedFiles.length} file(s)
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Media Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Media Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No media files yet</h3>
            <p className="text-gray-500">Upload photos and videos to see them here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaSection;
