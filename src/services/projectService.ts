import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectFilter, Milestone, ActivityLogEntry, AITask } from '@/lib/supabase';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Json } from '@/integrations/supabase/types';

// Local storage keys (for fallback only)
const LOCAL_PROJECTS_KEY = 'local_projects';

// Map Supabase column names to our Project interface
function mapSupabaseProject(data: any): Project {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    type: data.type,
    status: data.status,
    usefulness: data.usefulness,
    isMonetized: data.ismonetized || false,
    progress: data.progress || 0,
    tags: data.tags || [],
    githubUrl: data.githuburl,
    websiteUrl: data.websiteurl,
    nextAction: data.nextaction,
    lastUpdated: data.lastupdated || data.lastUpdated || new Date().toISOString(),
    createdAt: data.createdat || data.createdAt || new Date().toISOString(),
    user_id: data.user_id,
    milestones: data.milestones as Milestone[] || [],
    category: data.category,
    activityLogs: data.activitylogs as ActivityLogEntry[] || [],
    pinned: data.pinned || false,
    accountUsed: data.account_used,
    chatLinks: data.chat_links || [],
    analysisText: data.analysis_text,
    tasks: data.tasks as AITask[] || [],
  };
}

// Map our Project interface to Supabase column names
function mapToSupabaseProject(project: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'> | Partial<Project>) {
  return {
    name: project.name,
    description: project.description,
    type: project.type,
    status: project.status,
    usefulness: project.usefulness,
    ismonetized: project.isMonetized,
    progress: project.progress || 0,
    tags: project.tags || [],
    githuburl: project.githubUrl,
    websiteurl: project.websiteUrl,
    nextaction: project.nextAction,
    milestones: project.milestones as unknown as Json || [] as unknown as Json,
    category: project.category,
    activitylogs: project.activityLogs as unknown as Json || [] as unknown as Json,
    pinned: project.pinned || false,
    account_used: project.accountUsed,
    chat_links: project.chatLinks || [],
    analysis_text: project.analysisText,
    tasks: project.tasks as unknown as Json || [] as unknown as Json,
  };
}

// Check if Supabase is properly connected
const isSupabaseConnected = () => {
  // We can now assume Supabase is connected since the table was created
  return true;
};

// Local storage fallback functions (only used if Supabase fails)
const getLocalProjects = (): Project[] => {
  try {
    const stored = localStorage.getItem(LOCAL_PROJECTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const saveLocalProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const fetchProjects = async (filters?: ProjectFilter) => {
  try {
    // Use Supabase
    let query = supabase.from('projects').select('*');

    if (filters) {
      if (filters.status && filters.status !== 'All Status') {
        query = query.eq('status', filters.status);
      }
      if (filters.type && filters.type !== 'All Types') {
        query = query.eq('type', filters.type);
      }
      if (filters.usefulness && filters.usefulness !== 'All Ratings') {
        query = query.eq('usefulness', filters.usefulness);
      }
      if (filters.monetizedOnly) {
        query = query.eq('ismonetized', true);
      }
      if (filters.searchQuery) {
        query = query.ilike('name', `%${filters.searchQuery}%`);
      }
      if (filters.tags && filters.tags.length > 0) {
        // For array contains any
        query = query.contains('tags', filters.tags);
      }
    }

    const { data, error } = await query.order('lastupdated', { ascending: false });

    if (error) {
      throw error;
    }
    
    // Transform column names to match our Project interface
    return (data as any[]).map(mapSupabaseProject);
    
  } catch (error) {
    console.error('Error fetching projects from Supabase:', error);
    toast.error('Failed to fetch projects from database, using local data instead');
    
    // Fall back to local storage if Supabase fetch fails
    return getLocalProjects();
  }
};

export const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>) => {
  try {
    const now = new Date().toISOString();
    const newProjectData = {
      ...mapToSupabaseProject(project),
      lastupdated: now,
      createdat: now,
    };

    // Save to Supabase
    const { data, error } = await supabase
      .from('projects')
      .insert(newProjectData)
      .select();

    if (error) {
      throw error;
    }
    
    toast.success('Project created successfully');
    return mapSupabaseProject(data[0]);
  } catch (error) {
    console.error('Error creating project in Supabase:', error);
    toast.error('Failed to save to database, storing locally instead');
    
    // Fallback to local storage
    const now = new Date().toISOString();
    const newProject = {
      ...project,
      id: uuidv4(),
      createdAt: now,
      lastUpdated: now,
    } as Project;
    
    const projects = getLocalProjects();
    projects.push(newProject);
    saveLocalProjects(projects);
    
    return newProject;
  }
};

export const updateProject = async (id: string, project: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
  try {
    const updates = {
      ...mapToSupabaseProject(project),
      lastupdated: new Date().toISOString(),
    };

    // Update in Supabase
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }
    
    toast.success('Project updated successfully');
    return mapSupabaseProject(data[0]);
  } catch (error) {
    console.error('Error updating project in Supabase:', error);
    toast.error('Failed to update in database, updating locally instead');
    
    // Fallback to local storage
    const projects = getLocalProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index !== -1) {
      const updatedProject = {
        ...projects[index],
        ...project,
        lastUpdated: new Date().toISOString()
      };
      
      projects[index] = updatedProject;
      saveLocalProjects(projects);
      
      return updatedProject;
    } else {
      toast.error('Project not found');
      throw new Error('Project not found');
    }
  }
};

export const deleteProject = async (id: string) => {
  try {
    // Delete from Supabase
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
    
    toast.success('Project deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting project from Supabase:', error);
    
    // Fallback to local storage
    const projects = getLocalProjects();
    const filtered = projects.filter(p => p.id !== id);
    
    if (filtered.length < projects.length) {
      saveLocalProjects(filtered);
      toast.success('Project deleted successfully (removed locally)');
      return true;
    } else {
      toast.error('Failed to delete project');
      return false;
    }
  }
};

export const importProjectsFromCSV = async (csvData: string) => {
  try {
    // Parse CSV into rows
    const rows = csvData.trim().split('\n');
    
    // Extract headers from the first row
    const headers = rows[0].split(',');
    
    // Parse data rows
    const projectsData = rows.slice(1).map((row) => {
      const values = row.split(',');
      const project: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        
        if (header === 'tags') {
          // Parse tags as array - supports both comma-in-quotes and semicolon separators
          project[header] = value ? value.split(';').map((tag: string) => tag.trim()).filter(Boolean) : [];
        } else if (header === 'isMonetized') {
          // Parse boolean
          project[header] = value?.toLowerCase() === 'true';
        } else if (header === 'usefulness' || header === 'progress') {
          // Parse numbers
          project[header] = value ? parseInt(value, 10) : 0;
        } else {
          // Parse strings
          project[header] = value || null;
        }
      });

      console.log('Parsed project:', project);

      // Map properties to Supabase column names
      return {
        name: project.name || 'Unnamed Project',
        description: project.description,
        type: project.type || 'Other',
        status: project.status || 'Idea',
        usefulness: project.usefulness || 1,
        ismonetized: project.isMonetized === true,
        progress: project.progress || 0,
        tags: project.tags || [],
        githuburl: project.githubUrl,
        websiteurl: project.websiteUrl,
        nextaction: project.nextAction,
        lastupdated: new Date().toISOString(),
        createdat: new Date().toISOString(),
        milestones: (project.milestones || []) as unknown as Json,
        category: project.category,
        activitylogs: (project.activityLogs || []) as unknown as Json,
        account_used: project.accountUsed,
        chat_links: project.chatLinks || [],
        analysis_text: project.analysisText,
        tasks: (project.tasks || []) as unknown as Json,
      };
    });

    // Filter out any rows with missing required fields
    const validProjects = projectsData.filter(project => project.name && project.type && project.status);
    
    if (validProjects.length === 0) {
      throw new Error('No valid projects found in CSV. Projects must have at least name, type, and status.');
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('projects')
      .insert(validProjects)
      .select();

    if (error) {
      throw error;
    }
    
    toast.success(`Imported ${validProjects.length} projects successfully`);
    return (data as any[]).map(mapSupabaseProject);
  } catch (error) {
    console.error('Error importing projects to Supabase:', error);
    toast.error(`Failed to import to database: ${(error as Error).message || 'Unknown error'}`);
    
    try {
      // Fallback to local storage
      // Parse CSV and add to local storage
      const rows = csvData.trim().split('\n');
      const headers = rows[0].split(',');
      
      const projects = rows.slice(1).map((row) => {
        const values = row.split(',');
        const project: any = {};
        
        headers.forEach((header, index) => {
          const value = values[index]?.trim();
          
          if (header === 'tags') {
            project[header] = value ? value.split(';').map((tag: string) => tag.trim()).filter(Boolean) : [];
          } else if (header === 'isMonetized') {
            project[header] = value?.toLowerCase() === 'true';
          } else if (header === 'usefulness' || header === 'progress') {
            project[header] = value ? parseInt(value, 10) : 0;
          } else {
            project[header] = value || null;
          }
        });

        // Provide default values for required fields
        project.name = project.name || 'Unnamed Project';
        project.type = project.type || 'Other';
        project.status = project.status || 'Idea';
        project.usefulness = project.usefulness || 1;
        project.tags = project.tags || [];
        
        const now = new Date().toISOString();
        project.id = project.id || uuidv4();
        project.createdAt = project.createdAt || now;
        project.lastUpdated = now;

        return project as Project;
      });
      
      // Filter out any rows with missing required fields
      const validProjects = projects.filter(project => project.name && project.type && project.status);
      
      if (validProjects.length === 0) {
        throw new Error('No valid projects found in CSV');
      }
      
      const existingProjects = getLocalProjects();
      const allProjects = [...existingProjects, ...validProjects];
      
      saveLocalProjects(allProjects);
      
      toast.success(`Stored ${validProjects.length} projects locally`);
      return validProjects;
    } catch (csvError) {
      console.error('Error parsing CSV:', csvError);
      toast.error('Failed to parse CSV file. Please check the format.');
      throw csvError;
    }
  }
};
