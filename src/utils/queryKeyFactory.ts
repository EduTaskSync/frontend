export const queryKeys = {
  // for group related data queries
  groups: ['groups'] as const,
  groupList: () => [...queryKeys.groups, 'list'] as const,
  newGroup: () => [...queryKeys.groups, 'new'] as const,
  deleteGroup: (id: string) => [...queryKeys.groups, id, 'delete'] as const,
  getMembers: (groupId: string) => ['members', groupId] as const,
  editGroup: (id: string) => [...queryKeys.groups, id, 'edit'] as const,

  // for project related queries
  projects: ['projects'] as const,
  projectList: () => [...queryKeys.projects, 'list'] as const,
  newProject: () => [...queryKeys.projects, 'new'] as const,
  deleteProject: (id: string) => [...queryKeys.projects, id, 'delete'] as const,
  //getMembers: (projectId: string) => ['members', projectId] as const,
  editProject: (id: string) => [...queryKeys.projects, id, 'edit'] as const,

  
  // for calendar related queries
};
