export const queryKeys = {
  // for group related data queries
  groups: ['groups'] as const,
  groupList: () => [...queryKeys.groups, 'list'] as const,
  newGroup: () => [...queryKeys.groups, 'new'] as const,
  deleteGroup: (id: string) => [...queryKeys.groups, id, 'delete'] as const,
  getMembers: (groupId: string) => ['members', groupId] as const,
  editGroup: (id: string) => [...queryKeys.groups, id, 'edit'] as const,
  searchEmails: (searchTerm: string) => [...queryKeys.groups, searchTerm] as const,

  // for project related queries

  // for calendar related queries
};
