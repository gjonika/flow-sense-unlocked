
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, List, CalendarDays, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTaskManagement, TaskWithProject } from '@/hooks/useTaskManagement';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import TaskStatsCards from '@/components/global-tasks/TaskStatsCards';
import TaskFilters from '@/components/global-tasks/TaskFilters';
import TaskList from '@/components/global-tasks/TaskList';
import TaskDetailsModal from '@/components/global-tasks/TaskDetailsModal';
import TaskEditModal from '@/components/global-tasks/TaskEditModal';
import DeadlinesCalendarTab from '@/components/global-tasks/DeadlinesCalendarTab';
import DeadlinesListTab from '@/components/global-tasks/DeadlinesListTab';

const GlobalTasks: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<TaskWithProject | null>(null);
  const [editingTask, setEditingTask] = useState<TaskWithProject | null>(null);

  const {
    allTasks,
    uniqueCategories,
    activeProjects,
    taskStats,
    handleToggleTask,
    handleSaveTaskDueDate,
    handleEditTask,
  } = useTaskManagement();

  const {
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
  } = useTaskFilters(allTasks);

  // Navigate to project on main dashboard and expand the project card
  const handleGoToProject = (projectId: string) => {
    navigate('/', { state: { expandProjectId: projectId } });
  };

  const handleViewTaskDetails = (task: TaskWithProject) => {
    setSelectedTask(task);
  };

  const handleEditTaskClick = (task: TaskWithProject) => {
    setEditingTask(task);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-subtle to-background">
      <div className="container py-6 px-4 md:py-10 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Header with Back Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Global Tasks & Deadlines</h1>
              <p className="text-muted-foreground mt-2">
                All AI-generated tasks and milestones across your projects
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <TaskStatsCards taskStats={taskStats} />

        {/* Tabs for Tasks and Deadlines */}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="deadlines-calendar" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="deadlines-list" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Deadlines
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {/* Filters */}
            <TaskFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              projectFilter={projectFilter}
              setProjectFilter={setProjectFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortOrder={sortOrder}
              handleSortToggle={handleSortToggle}
              uniqueCategories={uniqueCategories}
              activeProjects={activeProjects}
            />

            {/* Tasks List */}
            <TaskList
              filteredAndSortedTasks={filteredAndSortedTasks}
              allTasksLength={allTasks.length}
              onToggleTask={handleToggleTask}
              onViewTaskDetails={handleViewTaskDetails}
              onGoToProject={handleGoToProject}
              onSaveTaskDueDate={handleSaveTaskDueDate}
              onEditTask={handleEditTaskClick}
            />
          </TabsContent>

          <TabsContent value="deadlines-calendar" className="space-y-6">
            <DeadlinesCalendarTab />
          </TabsContent>

          <TabsContent value="deadlines-list" className="space-y-6">
            <DeadlinesListTab />
          </TabsContent>
        </Tabs>

        {/* Task Details Modal */}
        <TaskDetailsModal
          selectedTask={selectedTask}
          onClose={() => setSelectedTask(null)}
          onToggleTask={handleToggleTask}
          onGoToProject={handleGoToProject}
        />

        {/* Task Edit Modal */}
        <TaskEditModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleEditTask}
        />
      </div>
    </div>
  );
};

export default GlobalTasks;
