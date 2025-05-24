
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ship, Calendar, MapPin, Users } from "lucide-react";
import { Survey } from "@/types/survey";
import SyncStatusBadge from "./SyncStatusBadge";

interface SurveyListProps {
  surveys: Survey[];
  onEditSurvey: (survey: Survey) => void;
  isOnline?: boolean;
}

const SurveyList = ({ surveys, onEditSurvey, isOnline = true }: SurveyListProps) => {
  const getStatusColor = (status: Survey['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid gap-4">
      {surveys.map((survey) => (
        <Card key={survey.id} className="border-blue-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center text-lg">
                <Ship className="mr-2 h-5 w-5 text-blue-600" />
                {survey.ship_name}
              </CardTitle>
              <div className="flex gap-2">
                <Badge className={getStatusColor(survey.status)}>
                  {survey.status.replace('-', ' ')}
                </Badge>
                <SyncStatusBadge survey={survey} isOnline={isOnline} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p className="text-gray-600">
                <strong>Client:</strong> {survey.client_name}
              </p>
              <div className="flex items-center text-gray-600">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date(survey.survey_date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-2 h-4 w-4" />
                {survey.survey_location}, {survey.client_country}
              </div>
              {survey.client_contacts.length > 0 && (
                <div className="flex items-center text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  {survey.client_contacts.length} contact{survey.client_contacts.length !== 1 ? 's' : ''}
                </div>
              )}
              <p className="text-gray-600">
                <strong>Duration:</strong> {survey.duration}
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-700 line-clamp-2">
                {survey.project_scope}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Created: {new Date(survey.created_at).toLocaleDateString()}
              </div>
              <Button 
                onClick={() => onEditSurvey(survey)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Open Survey
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SurveyList;
