
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  MinusCircle, 
  SkipForward, 
  Camera, 
  Upload,
  AlertTriangle,
  Tag,
  QrCode,
  Radio
} from 'lucide-react';
import { ChecklistQuestion as Question, ChecklistResponse } from '@/types/checklist';
import { useChecklistResponses } from '@/hooks/useChecklistResponses';
import { useToast } from '@/hooks/use-toast';

interface ChecklistQuestionProps {
  question: Question;
  surveyId: string;
  zoneId?: string;
  existingResponse?: ChecklistResponse;
  onResponseSaved: (questionId: string, response: ChecklistResponse) => void;
}

const ChecklistQuestion = ({ 
  question, 
  surveyId, 
  zoneId, 
  existingResponse,
  onResponseSaved 
}: ChecklistQuestionProps) => {
  const [selectedResponse, setSelectedResponse] = useState<'yes' | 'no' | 'na' | 'skipped' | null>(
    existingResponse?.response_type || null
  );
  const [notes, setNotes] = useState(existingResponse?.notes || '');
  const [assetTag, setAssetTag] = useState(existingResponse?.asset_tag || '');
  const [qrCode, setQrCode] = useState(existingResponse?.qr_code || '');
  const [rfidTag, setRfidTag] = useState(existingResponse?.rfid_tag || '');
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [attachingMedia, setAttachingMedia] = useState(false);
  
  const { saveResponse, saveMediaEvidence } = useChecklistResponses();
  const { toast } = useToast();

  const handleResponseSelect = async (responseType: 'yes' | 'no' | 'na' | 'skipped') => {
    if (responseType === 'skipped' && question.mandatory && !showSkipConfirm) {
      setShowSkipConfirm(true);
      return;
    }

    try {
      const responseId = await saveResponse(
        surveyId,
        question.id,
        question.category,
        question.text,
        responseType,
        question.mandatory,
        notes,
        zoneId,
        assetTag,
        qrCode,
        rfidTag
      );

      const newResponse: ChecklistResponse = {
        id: responseId,
        survey_id: surveyId,
        zone_id: zoneId,
        question_id: question.id,
        question_category: question.category,
        question_text: question.text,
        response_type: responseType,
        is_mandatory: question.mandatory,
        notes,
        asset_tag: assetTag,
        qr_code: qrCode,
        rfid_tag: rfidTag,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        needs_sync: true,
      };

      setSelectedResponse(responseType);
      setShowSkipConfirm(false);
      onResponseSaved(question.id, newResponse);
      
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        title: "Error",
        description: "Failed to save response",
        variant: "destructive",
      });
    }
  };

  const handleMediaCapture = async (file: File, evidenceType: 'defect' | 'compliance' | 'reference') => {
    if (!selectedResponse) {
      toast({
        title: "Response Required",
        description: "Please answer the question before adding evidence",
        variant: "destructive",
      });
      return;
    }

    setAttachingMedia(true);
    try {
      await saveMediaEvidence(
        existingResponse?.id || 'temp_response_id',
        surveyId,
        file,
        evidenceType
      );
      
      toast({
        title: "Evidence Added",
        description: "Media evidence attached successfully",
      });
    } catch (error) {
      console.error('Error saving media:', error);
      toast({
        title: "Error",
        description: "Failed to attach evidence",
        variant: "destructive",
      });
    } finally {
      setAttachingMedia(false);
    }
  };

  const handleFileSelect = (evidenceType: 'defect' | 'compliance' | 'reference') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleMediaCapture(file, evidenceType);
      }
    };
    input.click();
  };

  const handleCameraCapture = (evidenceType: 'defect' | 'compliance' | 'reference') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleMediaCapture(file, evidenceType);
      }
    };
    input.click();
  };

  const getResponseColor = (type: string) => {
    switch (type) {
      case 'yes': return 'bg-green-100 border-green-500';
      case 'no': return 'bg-red-100 border-red-500';
      case 'na': return 'bg-gray-100 border-gray-500';
      case 'skipped': return 'bg-yellow-100 border-yellow-500';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <Card className={`mb-4 ${getResponseColor(selectedResponse || '')} transition-all duration-200`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Question Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-gray-900">{question.text}</h4>
                {question.mandatory && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Mandatory
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Badge variant="outline">{question.category}</Badge>
                {question.subcategory && (
                  <Badge variant="outline" className="bg-blue-50">
                    {question.subcategory}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Response Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={selectedResponse === 'yes' ? 'default' : 'outline'}
              className={`${selectedResponse === 'yes' ? 'bg-green-600 hover:bg-green-700' : ''}`}
              onClick={() => handleResponseSelect('yes')}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Yes
            </Button>
            <Button
              variant={selectedResponse === 'no' ? 'default' : 'outline'}
              className={`${selectedResponse === 'no' ? 'bg-red-600 hover:bg-red-700' : ''}`}
              onClick={() => handleResponseSelect('no')}
            >
              <XCircle className="h-4 w-4 mr-1" />
              No
            </Button>
            <Button
              variant={selectedResponse === 'na' ? 'default' : 'outline'}
              className={`${selectedResponse === 'na' ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
              onClick={() => handleResponseSelect('na')}
            >
              <MinusCircle className="h-4 w-4 mr-1" />
              N/A
            </Button>
            <Button
              variant={selectedResponse === 'skipped' ? 'default' : 'outline'}
              className={`${selectedResponse === 'skipped' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
              onClick={() => handleResponseSelect('skipped')}
            >
              <SkipForward className="h-4 w-4 mr-1" />
              Skip
            </Button>
          </div>

          {/* Skip Confirmation for Mandatory Questions */}
          {showSkipConfirm && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-yellow-800 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">This is a mandatory question</span>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                Skipping mandatory questions may affect compliance reporting. Are you sure?
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSkipConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => handleResponseSelect('skipped')}
                >
                  Skip Anyway
                </Button>
              </div>
            </div>
          )}

          {/* Additional Details */}
          {selectedResponse && (
            <div className="space-y-3 border-t pt-3">
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes, observations, or recommendations..."
                  className="h-20"
                />
              </div>

              {/* Asset Tagging */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Tag className="h-3 w-3 inline mr-1" />
                    Asset Tag
                  </label>
                  <Input
                    value={assetTag}
                    onChange={(e) => setAssetTag(e.target.value)}
                    placeholder="Asset ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <QrCode className="h-3 w-3 inline mr-1" />
                    QR Code
                  </label>
                  <Input
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    placeholder="QR Code Data"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Radio className="h-3 w-3 inline mr-1" />
                    RFID Tag
                  </label>
                  <Input
                    value={rfidTag}
                    onChange={(e) => setRfidTag(e.target.value)}
                    placeholder="RFID Data"
                  />
                </div>
              </div>

              {/* Media Evidence */}
              <div>
                <label className="block text-sm font-medium mb-2">Evidence Attachments</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCameraCapture('defect')}
                    disabled={attachingMedia}
                    className="flex-1"
                  >
                    <Camera className="h-3 w-3 mr-1" />
                    Photo (Defect)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFileSelect('compliance')}
                    disabled={attachingMedia}
                    className="flex-1"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Compliance
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFileSelect('reference')}
                    disabled={attachingMedia}
                    className="flex-1"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Reference
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistQuestion;
