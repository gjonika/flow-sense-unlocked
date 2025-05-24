
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ship, Plus, List } from "lucide-react";
import { useSurveys } from "@/hooks/useSurveys";
import SurveyForm from "@/components/SurveyForm";
import SurveyList from "@/components/SurveyList";
import SurveyDetails from "@/components/SurveyDetails";
import { Survey } from "@/types/survey";
import { Link } from "react-router-dom";

type ViewMode = 'list' | 'create' | 'edit' | 'view';

const Index = () => {
  const { surveys, createSurvey, isOnline } = useSurveys();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const handleCreateSurvey = async (surveyData: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>) => {
    try {
      await createSurvey(surveyData);
      setViewMode('list');
    } catch (error) {
      console.error('Failed to create survey:', error);
    }
  };

  const handleEditSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setViewMode('edit');
  };

  if (viewMode === 'create') {
    return (
      <SurveyForm
        onSubmit={handleCreateSurvey}
        onCancel={() => setViewMode('list')}
        isOnline={isOnline}
      />
    );
  }

  if (viewMode === 'edit' && selectedSurvey) {
    return (
      <SurveyForm
        survey={selectedSurvey}
        onSubmit={handleCreateSurvey}
        onCancel={() => setViewMode('list')}
        isOnline={isOnline}
      />
    );
  }

  if (viewMode === 'view' && selectedSurvey) {
    return (
      <SurveyDetails
        survey={selectedSurvey}
        onBack={() => setViewMode('list')}
        onEdit={() => setViewMode('edit')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Ship className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Survey Manager</h1>
              <p className="text-gray-600">Ship Interior Inspection Tool</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link to="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Button 
              onClick={() => setViewMode('create')}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Survey
            </Button>
          </div>
        </div>

        {surveys.length === 0 ? (
          <div className="text-center py-12">
            <Ship className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Survey Manager</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start by creating your first survey project. Capture all the details for your ship interior inspections.
            </p>
            <Button 
              onClick={() => setViewMode('create')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Survey
            </Button>
          </div>
        ) : (
          <SurveyList
            surveys={surveys}
            onEditSurvey={handleEditSurvey}
            isOnline={isOnline}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
