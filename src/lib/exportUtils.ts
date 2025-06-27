
import { Project } from '@/lib/supabase';

/**
 * Converts projects to CSV format and triggers download
 */
export function exportProjectsToCSV(projects: Project[]): void {
  // Define CSV headers
  const headers = [
    'id',
    'name',
    'description',
    'type',
    'status',
    'usefulness',
    'isMonetized',
    'progress',
    'tags',
    'githubUrl',
    'websiteUrl',
    'nextAction',
    'lastUpdated',
    'createdAt',
    'category'
  ];

  // Convert projects to CSV rows
  const csvRows = [
    // Headers row
    headers.join(','),
    // Data rows
    ...projects.map(project => {
      return headers.map(header => {
        // Handle special cases for different field types
        switch (header) {
          case 'tags':
            // Format tags as semicolon-separated list, escape commas in tags
            return project.tags ? 
              `"${project.tags.join(';').replace(/"/g, '""')}"` : 
              '';
          case 'isMonetized': 
            return project.isMonetized ? 'true' : 'false';
          default:
            // Convert fields to string, escape quotes, and wrap in quotes if contains comma
            const value = (project as any)[header];
            if (value === null || value === undefined) return '';
            
            const stringValue = String(value);
            const escapedValue = stringValue.replace(/"/g, '""');
            return stringValue.includes(',') ? `"${escapedValue}"` : escapedValue;
        }
      }).join(',');
    })
  ].join('\n');

  // Create a download link
  const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `projects_export_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Converts projects to JSON format and triggers download
 */
export function exportProjectsToJSON(projects: Project[]): void {
  // Format with indentation for better readability
  const jsonContent = JSON.stringify(projects, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `projects_export_${new Date().toISOString().slice(0, 10)}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
