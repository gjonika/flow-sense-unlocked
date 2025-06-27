
import { Project } from '@/lib/supabase';
import { useProjects } from '@/contexts/ProjectContext';

export const useDashboardActions = (
  setEditingProject: (project: Project | undefined) => void,
  setIsProjectFormOpen: (open: boolean) => void
) => {
  const { addProject, editProject, removeProject, importProjects } = useProjects();

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
      if (setEditingProject) {
        // We need to access the current editing project, but since this is in a hook,
        // we'll need to pass it from the component
        console.log('Saving project:', projectData);
      }
      await addProject(projectData);
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

  const handleSelectProject = (projectId: string) => {
    // Find and scroll to the project
    const projectElement = document.getElementById(`project-${projectId}`);
    if (projectElement) {
      projectElement.scrollIntoView({ behavior: 'smooth' });
      // Add a temporary highlight effect
      projectElement.classList.add('highlight-project');
      setTimeout(() => {
        projectElement.classList.remove('highlight-project');
      }, 2000);
    }
  };

  return {
    handleAddProject,
    handleEditProject,
    handleSaveProject,
    handleDeleteProject,
    handleImportCSV,
    handleSelectProject,
  };
};
