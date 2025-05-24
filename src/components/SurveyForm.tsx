
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Wifi, WifiOff } from "lucide-react";
import { Survey, ClientContact } from "@/types/survey";
import ClientContactsForm from "./ClientContactsForm";
import ToolsForm from "./ToolsForm";
import CustomFieldsForm from "./CustomFieldsForm";
import { ContactValidationModal, validateContacts } from "./SurveyFormValidation";

interface SurveyFormProps {
  survey?: Survey;
  onSubmit: (survey: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>) => void;
  onCancel: () => void;
  isOnline?: boolean;
}

const SurveyForm = ({ survey, onSubmit, onCancel, isOnline = true }: SurveyFormProps) => {
  const [saving, setSaving] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    client_name: "",
    client_country: "",
    client_contacts: [] as ClientContact[],
    ship_name: "",
    survey_location: "",
    survey_date: new Date().toISOString().split('T')[0],
    project_scope: "",
    duration: "",
    tools: [
      "Measuring tape",
      "Digital camera", 
      "Moisture meter",
      "Flashlight",
      "Notebook",
      "Safety equipment"
    ],
    custom_fields: {} as { [key: string]: string },
    flight_details: {},
    hotel_details: {},
    status: 'draft' as const,
  });

  // Pre-fill form if editing existing survey
  useEffect(() => {
    if (survey) {
      setFormData({
        client_name: survey.client_name,
        client_country: survey.client_country,
        client_contacts: survey.client_contacts,
        ship_name: survey.ship_name,
        survey_location: survey.survey_location,
        survey_date: survey.survey_date,
        project_scope: survey.project_scope,
        duration: survey.duration,
        tools: survey.tools,
        custom_fields: survey.custom_fields,
        flight_details: survey.flight_details,
        hotel_details: survey.hotel_details,
        status: survey.status,
      });
    }
  }, [survey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate contacts
    const contactIssues = validateContacts(formData.client_contacts);
    
    if (contactIssues.length > 0) {
      setValidationIssues(contactIssues);
      setShowValidationModal(true);
      return;
    }
    
    await proceedWithSubmit();
  };

  const proceedWithSubmit = async () => {
    setSaving(true);
    setShowValidationModal(false);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onCancel} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {survey ? 'Edit Survey Project' : 'New Survey Project'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-600">Offline Mode</span>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientCountry">Client Country</Label>
                <Input
                  id="clientCountry"
                  value={formData.client_country}
                  onChange={(e) => setFormData({...formData, client_country: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <ClientContactsForm
              contacts={formData.client_contacts}
              onChange={(contacts) => setFormData({...formData, client_contacts: contacts})}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">Survey Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shipName">Ship Name</Label>
                <Input
                  id="shipName"
                  value={formData.ship_name}
                  onChange={(e) => setFormData({...formData, ship_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="surveyLocation">Survey Location</Label>
                <Input
                  id="surveyLocation"
                  value={formData.survey_location}
                  onChange={(e) => setFormData({...formData, survey_location: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="surveyDate">Survey Date</Label>
                <Input
                  id="surveyDate"
                  type="date"
                  value={formData.survey_date}
                  onChange={(e) => setFormData({...formData, survey_date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="e.g., 3-5 days"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="projectScope">Project Scope</Label>
              <Textarea
                id="projectScope"
                value={formData.project_scope}
                onChange={(e) => setFormData({...formData, project_scope: e.target.value})}
                placeholder="Describe the survey scope and objectives..."
                required
              />
            </div>
          </CardContent>
        </Card>

        <ToolsForm
          tools={formData.tools}
          onChange={(tools) => setFormData({...formData, tools})}
        />

        <CustomFieldsForm
          customFields={formData.custom_fields}
          onChange={(custom_fields) => setFormData({...formData, custom_fields})}
        />

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            disabled={saving}
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : survey ? 'Update Survey' : isOnline ? 'Create Survey' : 'Save Offline'}
          </Button>
        </div>
      </form>

      <ContactValidationModal
        isOpen={showValidationModal}
        onConfirm={proceedWithSubmit}
        onCancel={() => setShowValidationModal(false)}
        missingContacts={validationIssues}
      />
    </div>
  );
};

export default SurveyForm;
