
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectFilter } from '@/lib/supabase';
import { 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject,
  importProjectsFromCSV
} from '@/services/projectService';

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
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, [filters, sortBy]);

  const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>) => {
    const newProject = await createProject(project);
    await refreshProjects();
    return newProject;
  };

  const editProject = async (id: string, project: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    const updatedProject = await updateProject(id, project);
    await refreshProjects();
    return updatedProject;
  };

  const removeProject = async (id: string) => {
    const success = await deleteProject(id);
    if (success) {
      await refreshProjects();
    }
    return success;
  };

  const importProjects = async (csvData: string) => {
    const importedProjects = await importProjectsFromCSV(csvData);
    await refreshProjects();
    return importedProjects;
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
