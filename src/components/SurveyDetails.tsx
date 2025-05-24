
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, FileText, MapPin, Users, Calendar, Clock, Camera, CheckSquare, TrendingUp } from 'lucide-react';
import { Survey, SurveyZone } from '@/types/survey';
import { useSurveys } from '@/hooks/useSurveys';
import { useSurveyZones } from '@/hooks/useSurveyZones';
import SyncStatusBadge from './SyncStatusBadge';
import TravelSection from './TravelSection';
import ZoneNotesSection from './ZoneNotesSection';
import MediaSection from './MediaSection';
import SurveyChecklistSection from './SurveyChecklistSection';
import SurveyAnalytics from './SurveyAnalytics';

const SurveyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { surveys, updateSurvey } = useSurveys();
  const { zones, addZone, loading: zonesLoading } = useSurveyZones(id!);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [selectedZone, setSelectedZone] = useState<SurveyZone | null>(null);

  useEffect(() => {
    if (id && surveys) {
      const foundSurvey = surveys.find(s => s.id === id);
      if (foundSurvey) {
        setSurvey(foundSurvey);
      }
    }
  }, [id, surveys]);

  const handleStatusChange = async (newStatus: Survey['status']) => {
    if (!survey) return;
    
    try {
      await updateSurvey(survey.id, { status: newStatus });
      setSurvey(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Failed to update survey status:', error);
    }
  };

  if (!survey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-spin" />
            <p className="text-gray-600">Loading survey details...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Surveys
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {survey.ship_name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {survey.survey_location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(survey.survey_date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {survey.client_name}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <SyncStatusBadge survey={survey} />
          <Badge className={getStatusColor(survey.status)}>
            {survey.status.replace('-', ' ').toUpperCase()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/surveys/${survey.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Survey Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-blue-700">Survey Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Project Details</h4>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Scope:</strong> {survey.project_scope}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Duration:</strong> {survey.duration}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Country:</strong> {survey.client_country}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Tools & Equipment</h4>
              <div className="flex flex-wrap gap-1">
                {survey.tools.map((tool, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Status Control</h4>
              <div className="space-y-2">
                <select
                  value={survey.status}
                  onChange={(e) => handleStatusChange(e.target.value as Survey['status'])}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="checklist" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Compliance Checklist
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Media
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="travel" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Travel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checklist">
          <SurveyChecklistSection 
            surveyId={survey.id}
            zoneId={selectedZone?.id}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <SurveyAnalytics surveyId={survey.id} />
        </TabsContent>

        <TabsContent value="media">
          <MediaSection 
            surveyId={survey.id} 
            zones={zones} 
          />
        </TabsContent>

        <TabsContent value="notes">
          <ZoneNotesSection 
            surveyId={survey.id} 
            zones={zones}
            onZoneSelect={setSelectedZone}
            selectedZone={selectedZone}
            onAddZone={addZone}
            zonesLoading={zonesLoading}
          />
        </TabsContent>

        <TabsContent value="travel">
          <TravelSection 
            survey={survey}
            onUpdate={updateSurvey}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SurveyDetails;
