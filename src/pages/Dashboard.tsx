
import React, { useState } from 'react';
import { useProjects } from '@/contexts/ProjectContext';
import ProjectFilters from '@/components/ProjectFilters';
import ProjectForm from '@/components/ProjectForm';
import ImportCSVDialog from '@/components/ImportCSVDialog';
import ProjectAnalytics from '@/components/ProjectAnalytics';
import AISupport from '@/components/AISupport';
import { Project } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProjectViewControls from '@/components/dashboard/ProjectViewControls';
import ProjectContent from '@/components/dashboard/ProjectContent';

const Dashboard: React.FC = () => {
  const { projects, loading, addProject, editProject, removeProject, importProjects, setSortBy } = useProjects();
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAISupport, setShowAISupport] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const isMobile = useIsMobile();

  const handleAddProject = () => {
    setEditingProject(undefined);
    setIsProjectFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  };

  const handleSaveProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>) => {
    try {
      if (editingProject) {
        await editProject(editingProject.id, projectData);
      } else {
        await addProject(projectData);
      }
      setIsProjectFormOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await removeProject(id);
    }
  };

  const handleImportCSV = async (csvContent: string) => {
    try {
      await importProjects(csvContent);
    } catch (error) {
      console.error('Error importing CSV:', error);
    }
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
    if (!showAnalytics) setShowAISupport(false);
  };

  const toggleAISupport = () => {
    setShowAISupport(!showAISupport);
    if (!showAISupport) setShowAnalytics(false);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'cards' ? 'table' : 'cards');
  };

  return (
    <div className="container py-4 px-4 md:py-8 md:px-8 max-w-7xl">
      <DashboardHeader 
        handleAddProject={handleAddProject}
        toggleAnalytics={toggleAnalytics}
        toggleAISupport={toggleAISupport}
        showAnalytics={showAnalytics}
        showAISupport={showAISupport}
        openImportDialog={() => setIsImportDialogOpen(true)}
      />
      
      {showAnalytics && (
        <div className="mb-6">
          <ProjectAnalytics projects={projects} />
        </div>
      )}
      
      {showAISupport && (
        <div className="mb-6">
          <AISupport projects={projects} />
        </div>
      )}
      
      <div className="mb-6">
        <ProjectFilters />
      </div>
      
      <ProjectViewControls 
        viewMode={viewMode}
        toggleViewMode={toggleViewMode}
        projectCount={projects.length}
        setSortBy={setSortBy}
        isMobile={isMobile}
      />
      
      <ProjectContent 
        loading={loading}
        projects={projects}
        viewMode={viewMode}
        handleAddProject={handleAddProject}
        handleEditProject={handleEditProject}
        handleDeleteProject={handleDeleteProject}
      />
      
      <ProjectForm 
        isOpen={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
        onSave={handleSaveProject}
        initialData={editingProject}
      />
      
      <ImportCSVDialog 
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImportCSV}
      />
    </div>
  );
};

export default Dashboard;
