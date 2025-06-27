
export const DEFAULT_TAGS = [
  // Technology & Development
  'web-development',
  'mobile-app',
  'backend',
  'frontend',
  'fullstack',
  'api',
  'database',
  'ai-ml',
  'blockchain',
  'devops',
  
  // Languages & Frameworks
  'react',
  'typescript',
  'javascript',
  'python',
  'nodejs',
  'nextjs',
  'vue',
  'angular',
  'flutter',
  'swift',
  
  // Project Types
  'saas',
  'ecommerce',
  'portfolio',
  'blog',
  'cms',
  'dashboard',
  'landing-page',
  'tool',
  'game',
  'automation',
  
  // Business & Marketing
  'startup',
  'side-project',
  'freelance',
  'client-work',
  'mvp',
  'prototype',
  'research',
  'marketing',
  'analytics',
  'seo',
  
  // Learning & Education
  'tutorial',
  'course',
  'learning',
  'documentation',
  'open-source',
  'experiment',
  'hackathon',
  'challenge',
  
  // Status & Priority
  'urgent',
  'low-priority',
  'high-priority',
  'archived',
  'maintenance',
  'refactor',
  'bug-fix',
  'feature',
  'enhancement',
  'security'
];

export const getTagSuggestions = (input: string): string[] => {
  if (!input.trim()) return DEFAULT_TAGS.slice(0, 10); // Show first 10 by default
  
  const lowercaseInput = input.toLowerCase();
  return DEFAULT_TAGS.filter(tag => 
    tag.toLowerCase().includes(lowercaseInput)
  ).slice(0, 8); // Limit to 8 suggestions
};
