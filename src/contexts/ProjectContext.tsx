
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectFilter } from '@/lib/supabase';
import { 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject,
  importProjectsFromCSV
} from '@/services/projectService';
import { toast } from 'sonner';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  filters: ProjectFilter;
  sortBy: 'name' | 'status' | 'usefulness' | 'progress';
  refreshProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>) => Promise<Project>;
  editProject: (id: string, project: Partial<Omit<Project, 'id' | 'createdAt'>>) => Promise<Project>;
  removeProject: (id: string) => Promise<boolean>;
  importProjects: (csvData: string) => Promise<Project[]>;
  setFilters: (filters: ProjectFilter) => void;
  setSortBy: (sortBy: 'name' | 'status' | 'usefulness' | 'progress') => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<ProjectFilter>({});
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'usefulness' | 'progress'>('name');

  const refreshProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects(filters);
      
      // Apply client-side sorting
      const sortedData = [...data].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'status':
            return a.status.localeCompare(b.status);
          case 'usefulness':
            return b.usefulness - a.usefulness;
          case 'progress':
            return b.progress - a.progress;
          default:
            return 0;
        }
      });

      setProjects(sortedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err as Error);
      toast.error("Failed to load projects. Using cached data if available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, [filters, sortBy]);

  const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>) => {
    try {
      const newProject = await createProject(project);
      await refreshProjects();
      toast.success("Project created successfully");
      return newProject;
    } catch (err) {
      console.error("Error adding project:", err);
      toast.error("Failed to create project. Will try again later.");
      throw err;
    }
  };

  const editProject = async (id: string, project: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    try {
      const updatedProject = await updateProject(id, project);
      
      // Update local state for immediate UI update
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, ...project, lastUpdated: new Date().toISOString() } : p
      ));
      
      // Refresh full project list from database
      await refreshProjects();
      return updatedProject;
    } catch (err) {
      console.error("Error editing project:", err);
      toast.error("Failed to update project. Will try again later.");
      throw err;
    }
  };

  const removeProject = async (id: string) => {
    try {
      const success = await deleteProject(id);
      if (success) {
        // Update local state immediately for better UX
        setProjects(prev => prev.filter(p => p.id !== id));
        // Then refresh from database
        await refreshProjects();
      }
      return success;
    } catch (err) {
      console.error("Error removing project:", err);
      toast.error("Failed to delete project. Will try again later.");
      throw err;
    }
  };

  const importProjects = async (csvData: string) => {
    try {
      const importedProjects = await importProjectsFromCSV(csvData);
      await refreshProjects();
      return importedProjects;
    } catch (err) {
      console.error("Error importing projects:", err);
      toast.error("Failed to import projects. Please check your CSV format.");
      throw err;
    }
  };

  const updateFilters = (newFilters: ProjectFilter) => {
    setFilters(newFilters);
  };

  const value = {
    projects,
    loading,
    error,
    filters,
    sortBy,
    refreshProjects,
    addProject,
    editProject,
    removeProject,
    importProjects,
    setFilters: updateFilters,
    setSortBy,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
