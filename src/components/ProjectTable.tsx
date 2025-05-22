
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Project } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { TrashIcon, EditIcon, LinkIcon, GithubIcon } from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects, onEdit, onDelete }) => {
  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Usefulness</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Links</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                <div>
                  {project.name}
                  {project.isMonetized && (
                    <span className="ml-1 text-amber-500" title="Monetized">💰</span>
                  )}
                </div>
                {project.description && (
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {project.description}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                  {project.status}
                </span>
              </TableCell>
              <TableCell>{project.type}</TableCell>
              <TableCell>
                <span title={`Usefulness: ${project.usefulness}/5`}>
                  {project.usefulness === 5 ? "⭐⭐⭐⭐⭐" : 
                   project.usefulness === 4 ? "⭐⭐⭐⭐" : 
                   project.usefulness === 3 ? "⭐⭐⭐" : 
                   project.usefulness === 2 ? "⭐⭐" : "⭐"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-olive" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs">{project.progress}%</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground"
                    >
                      <GithubIcon className="h-4 w-4" />
                    </a>
                  )}
                  {project.websiteUrl && (
                    <a 
                      href={project.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(project.id)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(project)}>
                    <EditIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectTable;
