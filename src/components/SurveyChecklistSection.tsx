
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronRight, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { ChecklistTemplate, ChecklistResponse } from '@/types/checklist';
import { useChecklistTemplates } from '@/hooks/useChecklistTemplates';
import { useChecklistResponses } from '@/hooks/useChecklistResponses';
import ChecklistQuestion from './ChecklistQuestion';
import { useSyncManager } from '@/hooks/useSyncManager';

interface SurveyChecklistSectionProps {
  surveyId: string;
  zoneId?: string;
}

const SurveyChecklistSection = ({ surveyId, zoneId }: SurveyChecklistSectionProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [responses, setResponses] = useState<Record<string, ChecklistResponse>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  const { templates, loading: templatesLoading } = useChecklistTemplates();
  const { getResponsesForSurvey } = useChecklistResponses();
  const { isOnline } = useSyncManager();

  // Load existing responses
  useEffect(() => {
    const loadResponses = async () => {
      const existingResponses = await getResponsesForSurvey(surveyId);
      const responsesMap = existingResponses.reduce((acc, response) => {
        acc[response.question_id] = response;
        return acc;
      }, {} as Record<string, ChecklistResponse>);
      setResponses(responsesMap);
    };

    if (surveyId) {
      loadResponses();
    }
  }, [surveyId, getResponsesForSurvey]);

  // Auto-select default template
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      const defaultTemplate = templates.find(t => t.is_default) || templates[0];
      setSelectedTemplate(defaultTemplate);
      
      // Auto-expand all categories initially
      const categories = defaultTemplate.questions.reduce((acc, q) => {
        acc[q.category] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedCategories(categories);
    }
  }, [templates, selectedTemplate]);

  const handleResponseSaved = (questionId: string, response: ChecklistResponse) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (templatesLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Clock className="h-6 w-6 animate-spin mr-2" />
            <span>Loading compliance templates...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedTemplate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Survey Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">Select a compliance template to begin assessment:</p>
            <div className="grid gap-3">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  className="justify-start h-auto p-4"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">{template.name}</span>
                      {template.is_default && (
                        <Badge variant="default" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="flex gap-1 mt-2">
                      {template.compliance_standards.map((standard) => (
                        <Badge key={standard} variant="secondary" className="text-xs">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group questions by category
  const questionsByCategory = selectedTemplate.questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, typeof selectedTemplate.questions>);

  // Calculate progress
  const totalQuestions = selectedTemplate.questions.length;
  const answeredQuestions = Object.keys(responses).length;
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  // Count responses by type
  const responseCounts = Object.values(responses).reduce((acc, response) => {
    acc[response.response_type] = (acc[response.response_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm mb-4">
        {isOnline ? (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Online - Real-time sync
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Offline - Syncing when connected
          </Badge>
        )}
      </div>

      {/* Template Header & Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {selectedTemplate.name}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">{selectedTemplate.description}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTemplate(null)}
            >
              <FileText className="h-4 w-4 mr-1" />
              Change Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Compliance Standards */}
            <div className="flex gap-2">
              {selectedTemplate.compliance_standards.map((standard) => (
                <Badge key={standard} variant="secondary">
                  {standard}
                </Badge>
              ))}
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress: {answeredQuestions} of {totalQuestions} questions</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Response Summary */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-lg font-semibold text-green-700">
                  {responseCounts.yes || 0}
                </div>
                <div className="text-xs text-green-600">Compliant</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <div className="text-lg font-semibold text-red-700">
                  {responseCounts.no || 0}
                </div>
                <div className="text-xs text-red-600">Issues Found</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-lg font-semibold text-gray-700">
                  {responseCounts.na || 0}
                </div>
                <div className="text-xs text-gray-600">Not Applicable</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-lg font-semibold text-yellow-700">
                  {responseCounts.skipped || 0}
                </div>
                <div className="text-xs text-yellow-600">Skipped</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions by Category */}
      <div className="space-y-4">
        {Object.entries(questionsByCategory).map(([category, questions]) => {
          const categoryResponses = questions.filter(q => responses[q.id]).length;
          const isExpanded = expandedCategories[category];
          
          return (
            <Card key={category}>
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <CardTitle className="text-lg">{category}</CardTitle>
                    <Badge variant="outline">
                      {categoryResponses}/{questions.length}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {questions.some(q => q.mandatory) && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Mandatory Items
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {questions.map((question) => (
                      <ChecklistQuestion
                        key={question.id}
                        question={question}
                        surveyId={surveyId}
                        zoneId={zoneId}
                        existingResponse={responses[question.id]}
                        onResponseSaved={handleResponseSaved}
                      />
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SurveyChecklistSection;
