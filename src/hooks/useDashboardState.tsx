
import { useState } from 'react';
import { Project, ProjectGroupBy } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';

export const useDashboardState = () => {
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAISupport, setShowAISupport] = useState(false);
  const [showPriorities, setShowPriorities] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'accordion' | 'timeline'>('accordion');
  const [groupBy, setGroupBy] = useState<ProjectGroupBy>('status');
  const isMobile = useIsMobile();

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
    // Close other panels when opening analytics to prevent UI clutter on mobile
    if (isMobile && !showAnalytics) {
      setShowAISupport(false);
      setShowPriorities(false);
    }
  };

  const toggleAISupport = () => {
    setShowAISupport(!showAISupport);
    // Close other panels when opening AI support to prevent UI clutter on mobile
    if (isMobile && !showAISupport) {
      setShowAnalytics(false);
      setShowPriorities(false);
    }
  };

  const togglePriorities = () => {
    setShowPriorities(!showPriorities);
    // Close other panels when opening priorities to prevent UI clutter on mobile
    if (isMobile && !showPriorities) {
      setShowAnalytics(false);
      setShowAISupport(false);
    }
  };

  const toggleViewMode = (newMode?: 'cards' | 'table' | 'accordion' | 'timeline') => {
    if (newMode) {
      setViewMode(newMode);
    } else {
      // Cycle through view modes: accordion -> cards -> table -> timeline -> accordion
      setViewMode(viewMode === 'accordion' ? 'cards' : 
                 viewMode === 'cards' ? 'table' : 
                 viewMode === 'table' ? 'timeline' : 'accordion');
    }
  };

  return {
    // State
    isProjectFormOpen,
    setIsProjectFormOpen,
    isImportDialogOpen,
    setIsImportDialogOpen,
    editingProject,
    setEditingProject,
    showAnalytics,
    showAISupport,
    showPriorities,
    viewMode,
    groupBy,
    setGroupBy,
    isMobile,
    // Actions
    toggleAnalytics,
    toggleAISupport,
    togglePriorities,
    toggleViewMode,
  };
};
