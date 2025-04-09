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
  newProject: () => [...queryKeys.projects, 'new'] as const,
  deleteProject: (id: string) => [...queryKeys.projects, id, 'delete'] as const,
  //getMembers: (projectId: string) => ['members', projectId] as const,
  editProject: (id: string) => [...queryKeys.projects, id, 'edit'] as const,

  
  // for calendar related queries
};
