import { TasksQueryParams } from '@/hooks/dashboard/dashboardQueryUtils';

export const queryKeys = {
  // for group related data queries
  groups: ['groups'] as const,
  groupList: () => [...queryKeys.groups, 'list'] as const,
  newGroup: () => [...queryKeys.groups, 'new'] as const,
  deleteGroup: (id: string) => [...queryKeys.groups, id, 'delete'] as const,
  getGroupDetails: (id: string) => [...queryKeys.groups, id, 'details'],
  getMembers: (groupId: string) => [...queryKeys.groups, groupId, 'members'] as const,
  editGroup: (id: string) => [...queryKeys.groups, id, 'edit'] as const,
  searchEmails: (searchTerm: string) => [...queryKeys.groups, searchTerm] as const,

  // for project related queries
  projects: ['projects'] as const,
  projectList: () => [...queryKeys.projects, 'list'] as const,
  getGroupProjects: (groupId: string) => [...queryKeys.projectList(), { groupId }] as const,
  getProjectDetails: () => [...queryKeys.projects, 'detail'] as const,

  // kanban keys
  getKanbanColumns: (projectId: string) => [...queryKeys.projects, projectId, 'columns'],
  getKanbanColumnTasks: (projectId: string, columnId: string) => [
    ...queryKeys.getKanbanColumns(projectId),
    columnId,
    'tasks',
  ],

  //for dashboard related queries
  dashboard: {
    all: ['dashboard'] as const,
    tasks: () => [...queryKeys.dashboard.all, 'tasks'] as const,
    assignedTasks: (params?: TasksQueryParams) => ['dashboard', 'assignedTasks', params],
    tasksByStatus: (status: string) => [...queryKeys.dashboard.tasks(), 'status', status] as const,
    overdueTasks: () => [...queryKeys.dashboard.tasks(), 'overdue'] as const,
    tasksByDueDate: (dateRange: string) => [...queryKeys.dashboard.tasks(), 'dueDate', dateRange] as const,
    groupTasks: (groupId: string) => [...queryKeys.dashboard.tasks(), 'group', groupId] as const,

    // For pagination
    paginatedTasks: (page: number, limit: number) =>
      [...queryKeys.dashboard.tasks(), 'paginated', { page, limit }] as const,
  },

  // for calendar related queries
};
