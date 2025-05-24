
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Ship, Calendar, MapPin, Users, Edit } from "lucide-react";
import { Survey } from "@/types/survey";
import { useSurveyZones } from "@/hooks/useSurveyZones";
import ZoneNotesSection from "./ZoneNotesSection";
import MediaSection from "./MediaSection";
import TravelSection from "./TravelSection";

interface SurveyDetailsProps {
  survey: Survey;
  onUpdate: (id: string, updates: Partial<Survey>) => Promise<Survey | undefined>;
  onBack: () => void;
}

const SurveyDetails = ({ survey, onUpdate, onBack }: SurveyDetailsProps) => {
  const { zones, notes, loading, createZone, createNote } = useSurveyZones(survey.id);

  const updateStatus = async (newStatus: Survey['status']) => {
    await onUpdate(survey.id, { status: newStatus });
  };

  const handleSurveyUpdate = async (updatedSurvey: Survey) => {
    await onUpdate(updatedSurvey.id, updatedSurvey);
  };

  const getStatusColor = (status: Survey['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const hasFlightDetails = Object.keys(survey.flight_details || {}).length > 0;
  const hasHotelDetails = Object.keys(survey.hotel_details || {}).length > 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Ship className="mr-2 h-6 w-6 text-blue-600" />
              {survey.ship_name}
            </h1>
            <p className="text-gray-600">{survey.client_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(survey.status)}>
            {survey.status.replace('-', ' ')}
          </Badge>
          <Button
            variant="outline"
            onClick={() => updateStatus(survey.status === 'completed' ? 'in-progress' : 'completed')}
          >
            Mark as {survey.status === 'completed' ? 'In Progress' : 'Completed'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">Zone Notes</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="travel" className="relative">
            Travel
            {(hasFlightDetails || hasHotelDetails) && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full"></span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700">Survey Details</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span><strong>Date:</strong> {new Date(survey.survey_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span><strong>Location:</strong> {survey.survey_location}</span>
                </div>
                <div>
                  <strong>Duration:</strong> {survey.duration}
                </div>
                <div>
                  <strong>Client Country:</strong> {survey.client_country}
                </div>
              </div>
              <div>
                <strong>Project Scope:</strong>
                <p className="mt-1 text-gray-700">{survey.project_scope}</p>
              </div>
            </CardContent>
          </Card>

          {survey.client_contacts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Client Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {survey.client_contacts.map((contact, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="font-medium">{contact.name}</div>
                      {contact.email && <div className="text-sm text-gray-600">{contact.email}</div>}
                      {contact.phone && <div className="text-sm text-gray-600">{contact.phone}</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {Object.keys(survey.custom_fields || {}).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Custom Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(survey.custom_fields || {}).map(([name, value]) => (
                    <div key={name}>
                      <strong>{name}:</strong> {value}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notes">
          <ZoneNotesSection
            surveyId={survey.id}
            zones={zones}
            notes={notes}
            loading={loading}
            onCreateZone={createZone}
            onCreateNote={createNote}
          />
        </TabsContent>

        <TabsContent value="media">
          <MediaSection surveyId={survey.id} zones={zones} />
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700">Tools & Equipment List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-2">
                {survey.tools.map((tool, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                    <div className="w-4 h-4 border border-gray-300 rounded mr-3"></div>
                    <span>{tool}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="travel">
          <TravelSection
            survey={survey}
            onUpdate={handleSurveyUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SurveyDetails;
