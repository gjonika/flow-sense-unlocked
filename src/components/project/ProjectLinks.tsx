
import React from 'react';
import { GithubIcon, LinkIcon } from 'lucide-react';

interface ProjectLinksProps {
  githubUrl?: string | null;
  websiteUrl?: string | null;
}

const ProjectLinks: React.FC<ProjectLinksProps> = ({ githubUrl, websiteUrl }) => {
  // Check if either URL exists and is not empty
  const hasGithubUrl = Boolean(githubUrl && githubUrl.trim() !== '');
  const hasWebsiteUrl = Boolean(websiteUrl && websiteUrl.trim() !== '');
  
  // If neither URL is available, don't render anything
  if (!hasGithubUrl && !hasWebsiteUrl) return null;
  
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {hasGithubUrl && (
        <a 
          href={githubUrl!} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md px-2 py-1 text-gray-700 transition-colors"
        >
          <GithubIcon size={14} />
          <span>GitHub</span>
        </a>
      )}
      {hasWebsiteUrl && (
        <a 
          href={websiteUrl!} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md px-2 py-1 text-gray-700 transition-colors"
        >
          <LinkIcon size={14} />
          <span>Website</span>
        </a>
      )}
    </div>
  );
};

export default ProjectLinks;
