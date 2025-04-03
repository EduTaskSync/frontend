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

  // for calendar related queries
};
