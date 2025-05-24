import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ship, Calendar, MapPin, Users, Plus, Search, Filter, Wifi, WifiOff, Menu, X } from "lucide-react";
import { Survey } from "@/types/survey";
import { useSurveys } from "@/hooks/useSurveys";
import SyncStatusBadge from "@/components/SyncStatusBadge";
import SurveyForm from "@/components/SurveyForm";
import SurveyDetails from "@/components/SurveyDetails";
import EmptyState from "@/components/EmptyState";
import { DashboardLoadingState } from "@/components/LoadingState";

type ViewMode = 'dashboard' | 'create' | 'edit' | 'view';

const Dashboard = () => {
  const { surveys, loading, createSurvey, updateSurvey, isOnline, syncPendingSurveys } = useSurveys();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get unique countries for filter
  const uniqueCountries = Array.from(new Set(surveys.map(s => s.client_country))).filter(Boolean);

  // Filter surveys based on search and filters
  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = 
      survey.ship_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.survey_location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
    const matchesCountry = countryFilter === 'all' || survey.client_country === countryFilter;
    
    return matchesSearch && matchesStatus && matchesCountry;
  });

  // Auto-sync pending surveys when online
  useEffect(() => {
    if (isOnline) {
      syncPendingSurveys();
    }
  }, [isOnline, syncPendingSurveys]);

  const handleCreateSurvey = async (surveyData: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>) => {
    try {
      await createSurvey(surveyData);
      setViewMode('dashboard');
    } catch (error) {
      console.error('Failed to create survey:', error);
    }
  };

  const handleUpdateSurvey = async (surveyData: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>) => {
    if (!selectedSurvey) return;
    
    try {
      await updateSurvey(selectedSurvey.id, surveyData);
      setViewMode('dashboard');
      setSelectedSurvey(null);
    } catch (error) {
      console.error('Failed to update survey:', error);
    }
  };

  const handleEditSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setViewMode('edit');
  };

  const handleViewSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setViewMode('view');
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

  if (viewMode === 'create') {
    return (
      <SurveyForm
        onSubmit={handleCreateSurvey}
        onCancel={() => setViewMode('dashboard')}
        isOnline={isOnline}
      />
    );
  }

  if (viewMode === 'edit' && selectedSurvey) {
    return (
      <SurveyForm
        survey={selectedSurvey}
        onSubmit={handleUpdateSurvey}
        onCancel={() => setViewMode('dashboard')}
        isOnline={isOnline}
      />
    );
  }

  if (viewMode === 'view' && selectedSurvey) {
    return (
      <SurveyDetails
        survey={selectedSurvey}
        onUpdate={updateSurvey}
        onBack={() => setViewMode('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-80'} flex-shrink-0`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">Survey Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Ship Interior Inspections</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2"
            >
              {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {!sidebarCollapsed && (
          <div className="p-6 space-y-6">
            {/* Connection Status */}
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

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search surveys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Country</label>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {uniqueCountries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Survey Statistics</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Total:</span>
                  <span className="font-medium">{surveys.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Completed:</span>
                  <span className="font-medium">{surveys.filter(s => s.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">In Progress:</span>
                  <span className="font-medium">{surveys.filter(s => s.status === 'in-progress').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Pending Sync:</span>
                  <span className="font-medium">{surveys.filter(s => s.needs_sync).length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Survey Projects</h2>
              <p className="text-gray-600">Manage your ship inspection surveys</p>
            </div>
            <Button onClick={() => setViewMode('create')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Survey Project
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {loading ? (
            <DashboardLoadingState />
          ) : filteredSurveys.length === 0 ? (
            <EmptyState
              title={surveys.length === 0 ? "No surveys yet" : "No surveys found"}
              description={
                surveys.length === 0 
                  ? "Get started by creating your first survey project to track ship inspections and manage project details."
                  : "Try adjusting your search or filter criteria to find the surveys you're looking for."
              }
              actionLabel={surveys.length === 0 ? "Create First Survey" : undefined}
              onAction={surveys.length === 0 ? () => setViewMode('create') : undefined}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSurveys.map((survey) => (
                <Card key={survey.id} className="border-blue-200 hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardHeader className="pb-3">
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
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Client:</strong> {survey.client_name}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(survey.survey_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="mr-2 h-4 w-4" />
                      {survey.survey_location}, {survey.client_country}
                    </div>
                    {survey.client_contacts.length > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="mr-2 h-4 w-4" />
                        {survey.client_contacts.length} contact{survey.client_contacts.length !== 1 ? 's' : ''}
                      </div>
                    )}
                    <div className="text-sm text-gray-600">
                      <strong>Duration:</strong> {survey.duration}
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                        {survey.project_scope}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewSurvey(survey)}
                          className="flex-1"
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleEditSurvey(survey)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                      Created: {new Date(survey.created_at).toLocaleDateString()}
                      {survey.needs_sync && (
                        <span className="ml-2 text-yellow-600">• Pending sync</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
