
import React, { useEffect } from 'react';
import { useProjects } from '@/contexts/ProjectContext';
import ProjectFilters from '@/components/ProjectFilters';
import ProjectForm from '@/components/ProjectForm';
import ImportCSVDialog from '@/components/ImportCSVDialog';
import { Project } from '@/lib/supabase';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProjectViewControls from '@/components/dashboard/ProjectViewControls';
import ProjectContent from '@/components/dashboard/ProjectContent';
import EnhancedCompletedProjects from '@/components/dashboard/EnhancedCompletedProjects';
import DashboardPanels from '@/components/dashboard/DashboardPanels';
import { useDashboardState } from '@/hooks/useDashboardState';
import { useDashboardActions } from '@/hooks/useDashboardActions';
import { useLocation, useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts, useAccessibleFocus } from '@/hooks/useKeyboardShortcuts';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import SkipNavigation from '@/components/ui/SkipNavigation';
import KeyboardShortcutsHelp from '@/components/ui/KeyboardShortcutsHelp';
import { MotionProvider } from '@/components/ui/ReducedMotion';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { projects, loading, addProject, editProject, removeProject, importProjects, setSortBy, refreshProjects } = useProjects();
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

  // Enable accessible focus management
  useAccessibleFocus();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'n',
      ctrlKey: true,
      action: handleAddProject,
      description: 'Add new project'
    },
    {
      key: 'a',
      ctrlKey: true,
      action: toggleAnalytics,
      description: 'Toggle analytics panel'
    },
    {
      key: 'r',
      ctrlKey: true,
      action: () => {
        refreshProjects();
        toast.success('Data refreshed');
      },
      description: 'Refresh project data'
    },
    {
      key: '?',
      action: () => {
        // This will be handled by KeyboardShortcutsHelp component
      },
      description: 'Show keyboard shortcuts'
    }
  ]);

  // Handle navigation state from GlobalTasks and Deadlines page
  useEffect(() => {
    if (location.state?.expandProjectId) {
      const projectToExpand = projects.find(p => p.id === location.state.expandProjectId);
      if (projectToExpand) {
        setTimeout(() => {
          handleEditProject(projectToExpand);
        }, 100);
      }
      navigate(location.pathname, { replace: true });
    }
    
    if (location.state?.openAnalytics) {
      if (!showAnalytics) {
        toggleAnalytics();
      }
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, projects, handleEditProject, showAnalytics, toggleAnalytics, navigate, location.pathname]);

  // Filter projects
  const activeProjects = projects.filter(p => p.status !== 'Completed');
  const completedProjects = projects.filter(p => p.status === 'Completed');

  const handleSaveProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>) => {
    try {
      if (editingProject) {
        await editProject(editingProject.id, projectData);
        toast.success('Project updated successfully');
      } else {
        await addProject(projectData);
        toast.success('Project created successfully');
      }
      handleCloseProjectForm();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project. Please try again.');
    }
  };

  const handleCloseProjectForm = () => {
    setIsProjectFormOpen(false);
    setEditingProject(undefined);
    
    if (location.state) {
      navigate(location.pathname, { replace: true });
    }
  };

  return (
    <MotionProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-surface-subtle to-background">
        <SkipNavigation />
        
        <div className="container py-6 px-4 md:py-10 lg:px-8 max-w-7xl mx-auto space-y-8">
          <ErrorBoundary>
            <header id="main-navigation" role="banner">
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
              <div className="flex justify-end mt-4">
                <KeyboardShortcutsHelp />
              </div>
            </header>
          </ErrorBoundary>
          
          <ErrorBoundary>
            <DashboardPanels
              showAnalytics={showAnalytics}
              showAISupport={showAISupport}
              showPriorities={showPriorities}
              activeProjects={projects}
              onSelectProject={handleSelectProject}
            />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <nav className="animate-smooth-fade-in" aria-label="Project filters">
              <ProjectFilters />
            </nav>
          </ErrorBoundary>
          
          <ErrorBoundary>
            {completedProjects.length > 0 && (
              <EnhancedCompletedProjects 
                projects={completedProjects} 
                onSelect={handleEditProject} 
              />
            )}
          </ErrorBoundary>
          
          <ErrorBoundary>
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
          </ErrorBoundary>
          
          <main id="main-content" tabIndex={-1} role="main">
            <ErrorBoundary>
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
            </ErrorBoundary>
          </main>
          
          <ErrorBoundary>
            <ProjectForm 
              isOpen={isProjectFormOpen}
              onClose={handleCloseProjectForm}
              onSave={handleSaveProject}
              initialData={editingProject}
            />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <ImportCSVDialog 
              isOpen={isImportDialogOpen}
              onClose={() => setIsImportDialogOpen(false)}
              onImport={handleImportCSV}
            />
          </ErrorBoundary>
        </div>
      </div>
    </MotionProvider>
  );
};

export default Dashboard;
