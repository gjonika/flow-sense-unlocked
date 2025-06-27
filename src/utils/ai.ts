
import { Project } from '@/lib/supabase';

export interface NextStepSuggestion {
  step: string;
  effort: 'low' | 'medium' | 'high';
  motivation: string;
  risk: 'low' | 'medium' | 'high';
}

export interface WeeklySprintSuggestion {
  projectName: string;
  projectId: string;
  tasks: string[];
  rationale: string;
}

export interface TaskTriageAction {
  action: 'defer' | 'delegate' | 'split' | 'drop';
  reason: string;
  timeline?: string;
}

export const suggestNextSteps = (project: Project): NextStepSuggestion => {
  // Filter out abandoned projects
  if (project.status === 'Abandoned') {
    return {
      step: 'Project archived - no actions needed',
      effort: 'low',
      motivation: 'Focus energy on active projects',
      risk: 'low'
    };
  }

  // Analyze project context for specific suggestions
  const progress = project.progress;
  const usefulness = project.usefulness;
  const isMonetized = project.isMonetized;
  const hasGithub = Boolean(project.githubUrl);
  const hasWebsite = Boolean(project.websiteUrl);
  const hasMilestones = Boolean(project.milestones && project.milestones.length > 0);

  // Generate context-aware suggestions
  if (progress < 20) {
    if (!hasGithub) {
      return {
        step: 'Set up version control and create initial project structure',
        effort: 'low',
        motivation: 'Strong foundation accelerates future development',
        risk: 'low'
      };
    }
    return {
      step: 'Define core features and create development roadmap',
      effort: 'medium',
      motivation: 'Clear direction prevents scope creep and wasted effort',
      risk: 'medium'
    };
  }

  if (progress >= 20 && progress < 50) {
    if (usefulness >= 4 && !hasMilestones) {
      return {
        step: 'Break remaining work into weekly milestones with deadlines',
        effort: 'low',
        motivation: 'High-value projects deserve structured execution',
        risk: 'low'
      };
    }
    return {
      step: 'Implement core functionality and test with target users',
      effort: 'high',
      motivation: 'Early feedback prevents costly late-stage changes',
      risk: 'medium'
    };
  }

  if (progress >= 50 && progress < 80) {
    if (!hasWebsite && isMonetized) {
      return {
        step: 'Create landing page and prepare for market validation',
        effort: 'medium',
        motivation: 'Monetized projects need marketing presence',
        risk: 'low'
      };
    }
    return {
      step: 'Focus on polish, documentation, and user experience',
      effort: 'medium',
      motivation: 'Quality finishing touches separate good from great',
      risk: 'low'
    };
  }

  if (progress >= 80) {
    if (project.status !== 'Launch' && project.status !== 'Completed') {
      return {
        step: 'Prepare launch strategy and gather initial user feedback',
        effort: 'medium',
        motivation: 'You\'re so close! Time to share your work with the world',
        risk: 'medium'
      };
    }
    return {
      step: 'Monitor metrics, gather feedback, and plan next iteration',
      effort: 'low',
      motivation: 'Successful projects evolve based on real user needs',
      risk: 'low'
    };
  }

  return {
    step: 'Review project scope and prioritize highest-impact features',
    effort: 'low',
    motivation: 'Strategic focus amplifies your efforts',
    risk: 'low'
  };
};

export const generateWeeklySprintSuggestions = (projects: Project[]): WeeklySprintSuggestion[] => {
  // Filter high-priority, low-progress active projects
  const sprintCandidates = projects
    .filter(p => p.status !== 'Abandoned' && p.status !== 'Completed')
    .filter(p => p.usefulness >= 3 && p.progress < 70)
    .sort((a, b) => b.usefulness - a.usefulness || a.progress - b.progress)
    .slice(0, 3);

  return sprintCandidates.map(project => {
    const tasks = generateTasksForProject(project);
    return {
      projectName: project.name,
      projectId: project.id,
      tasks,
      rationale: `High usefulness (${project.usefulness}/5) with ${project.progress}% progress - ready for focused sprint`
    };
  });
};

const generateTasksForProject = (project: Project): string[] => {
  const progress = project.progress;
  const hasGithub = Boolean(project.githubUrl);
  const hasWebsite = Boolean(project.websiteUrl);

  if (progress < 30) {
    return [
      hasGithub ? 'Define project architecture and dependencies' : 'Set up repository and initial codebase',
      'Create user stories and acceptance criteria',
      'Design basic UI mockups or wireframes'
    ];
  }

  if (progress < 60) {
    return [
      'Implement core feature functionality',
      'Add error handling and edge cases',
      'Create basic documentation and setup guide'
    ];
  }

  return [
    'Polish user interface and user experience',
    hasWebsite ? 'Update website with latest features' : 'Create project landing page',
    'Prepare for beta testing or launch'
  ];
};

export const suggestTaskTriage = (project: Project): TaskTriageAction | null => {
  // Only suggest triage for projects that might need it
  if (project.status === 'Abandoned' || project.status === 'Completed') {
    return null;
  }

  const daysSinceUpdate = Math.floor(
    (new Date().getTime() - new Date(project.lastUpdated).getTime()) / (1000 * 3600 * 24)
  );

  // Overdue logic based on project context
  if (daysSinceUpdate > 30 && project.progress < 20) {
    return {
      action: 'split',
      reason: 'Large scope preventing progress',
      timeline: 'Break into 2-week chunks'
    };
  }

  if (daysSinceUpdate > 14 && project.usefulness <= 2) {
    return {
      action: 'defer',
      reason: 'Low impact, opportunity cost too high',
      timeline: 'Revisit in quarterly review'
    };
  }

  if (daysSinceUpdate > 60 && project.progress < 50) {
    return {
      action: 'drop',
      reason: 'Stalled project consuming mental energy',
      timeline: 'Archive and focus on active projects'
    };
  }

  return null;
};

export const generateMotivationBlurb = (project: Project): string => {
  const progress = project.progress;
  const usefulness = project.usefulness;

  if (progress < 25) {
    if (usefulness >= 4) {
      return "🚀 This high-impact project deserves your focused attention!";
    }
    return "💡 Every expert was once a beginner - your first steps matter!";
  }

  if (progress < 50) {
    return "⚡ You're building momentum - consistency beats perfection!";
  }

  if (progress < 75) {
    return "🎯 You're in the zone! The finish line is getting closer!";
  }

  if (progress < 90) {
    return "🏆 So close to completion - time to push through!";
  }

  return "🌟 Amazing work! Consider sharing your success story!";
};
