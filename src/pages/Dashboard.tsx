
import React, { useEffect } from 'react';
import { useProjects } from '@/contexts/ProjectContext';
import ProjectFilters from '@/components/ProjectFilters';
import ProjectForm from '@/components/ProjectForm';
import ImportCSVDialog from '@/components/ImportCSVDialog';
import { Project } from '@/lib/supabase';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProjectViewControls from '@/components/dashboard/ProjectViewControls';
import ProjectContent from '@/components/dashboard/ProjectContent';
import CompletedProjects from '@/components/dashboard/CompletedProjects';
import DashboardPanels from '@/components/dashboard/DashboardPanels';
import { useDashboardState } from '@/hooks/useDashboardState';
import { useDashboardActions } from '@/hooks/useDashboardActions';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { projects, loading, addProject, editProject, removeProject, importProjects, setSortBy } = useProjects();
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    isProjectFormOpen,
    setIsProjectFormOpen,
    isImportDialogOpen,
    setIsImportDialogOpen,
    editingProject,
    setEditingProject,
    showAnalytics,
    showAISupport,
    showPriorities,
    viewMode,
    groupBy,
    setGroupBy,
    isMobile,
    toggleAnalytics,
    toggleAISupport,
    togglePriorities,
    toggleViewMode,
  } = useDashboardState();

  const {
    handleAddProject,
    handleEditProject,
    handleDeleteProject,
    handleImportCSV,
    handleSelectProject,
  } = useDashboardActions(setEditingProject, setIsProjectFormOpen);

  // Handle navigation state from GlobalTasks and Deadlines page
  useEffect(() => {
    if (location.state?.expandProjectId) {
      // Find and edit the specific project to expand its card
      const projectToExpand = projects.find(p => p.id === location.state.expandProjectId);
      if (projectToExpand) {
        setTimeout(() => {
          handleEditProject(projectToExpand);
        }, 100);
      }
      
      // Clear the navigation state to prevent re-triggering
      navigate(location.pathname, { replace: true });
    }
    
    if (location.state?.openAnalytics) {
      if (!showAnalytics) {
        toggleAnalytics();
      }
      
      // Clear the navigation state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, projects, handleEditProject, showAnalytics, toggleAnalytics, navigate, location.pathname]);

  // Filter out completed projects for main view
  const activeProjects = projects.filter(p => p.status !== 'Completed');
  // Get only completed projects for the dedicated section
  const completedProjects = projects.filter(p => p.status === 'Completed');

  const handleSaveProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>) => {
    try {
      if (editingProject) {
        await editProject(editingProject.id, projectData);
      } else {
        await addProject(projectData);
      }
      handleCloseProjectForm();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleCloseProjectForm = () => {
    setIsProjectFormOpen(false);
    setEditingProject(undefined);
    
    // If we came from another page, clear any navigation state
    if (location.state) {
      navigate(location.pathname, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-subtle to-background">
      <div className="container py-6 px-4 md:py-10 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <DashboardHeader 
          handleAddProject={handleAddProject}
          toggleAnalytics={toggleAnalytics}
          showAnalytics={showAnalytics}
          toggleAISupport={toggleAISupport}
          showAISupport={showAISupport}
          togglePriorities={togglePriorities}
          showPriorities={showPriorities}
          openImportDialog={() => setIsImportDialogOpen(true)}
          projects={projects}
        />
        
        {/* Dashboard Panels */}
        <DashboardPanels
          showAnalytics={showAnalytics}
          showAISupport={showAISupport}
          showPriorities={showPriorities}
          activeProjects={projects}
          onSelectProject={handleSelectProject}
        />
        
        {/* Filters */}
        <div className="animate-smooth-fade-in">
          <ProjectFilters />
        </div>
        
        {/* Completed Projects Section */}
        {completedProjects.length > 0 && (
          <CompletedProjects 
            projects={completedProjects} 
            onSelect={handleEditProject} 
          />
        )}
        
        {/* View Controls */}
        <div className="animate-smooth-fade-in">
          <ProjectViewControls 
            viewMode={viewMode}
            toggleViewMode={toggleViewMode}
            projectCount={activeProjects.length}
            setSortBy={setSortBy}
            isMobile={isMobile}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
          />
        </div>
        
        {/* Main Project Content */}
        <ProjectContent 
          loading={loading}
          projects={activeProjects}
          viewMode={viewMode}
          handleAddProject={handleAddProject}
          handleEditProject={handleEditProject}
          handleDeleteProject={handleDeleteProject}
          useAccordion={true}
          groupBy={groupBy}
        />
        
        {/* Modals */}
        <ProjectForm 
          isOpen={isProjectFormOpen}
          onClose={handleCloseProjectForm}
          onSave={handleSaveProject}
          initialData={editingProject}
        />
        
        <ImportCSVDialog 
          isOpen={isImportDialogOpen}
          onClose={() => setIsImportDialogOpen(false)}
          onImport={handleImportCSV}
        />
      </div>
    </div>
  );
};

export default Dashboard;
