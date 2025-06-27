
import { useState, useMemo } from 'react';
import { TaskWithProject } from './useTaskManagement';

type SortOrder = 'asc' | 'desc' | 'none';

export const useTaskFilters = (allTasks: TaskWithProject[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = allTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.projectName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
      const matchesProject = projectFilter === 'all' || task.projectId === projectFilter;
      const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'completed' && task.completed) ||
                          (statusFilter === 'pending' && !task.completed);

      return matchesSearch && matchesPriority && matchesCategory && matchesProject && matchesStatus;
    });

    // Sort completed tasks to bottom with animation
    const completedTasks = filtered.filter(task => task.completed);
    const pendingTasks = filtered.filter(task => !task.completed);

    // Apply sorting if selected
    if (sortOrder !== 'none') {
      const sortFn = (a: TaskWithProject, b: TaskWithProject) => {
        const aValue = a.title.toLowerCase();
        const bValue = b.title.toLowerCase();
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      };
      
      pendingTasks.sort(sortFn);
      completedTasks.sort(sortFn);
    }

    return [...pendingTasks, ...completedTasks];
  }, [allTasks, searchQuery, priorityFilter, categoryFilter, projectFilter, statusFilter, sortOrder]);

  const handleSortToggle = () => {
    if (sortOrder === 'none') {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('none');
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    projectFilter,
    setProjectFilter,
    statusFilter,
    setStatusFilter,
    sortOrder,
    filteredAndSortedTasks,
    handleSortToggle,
  };
};
