import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys } from '@/utils/queryKeyFactory';
import { EditUserGroup, GroupListResponse, GroupsObj } from './groupInterfaces';
import {
  getGroups,
  createNewGroup,
  deleteGroup,
  getGroupMembers,
  editGroupDetails,
  addGroupMember,
  getGroupDetails,
  editGroupUser,
} from './groupQueryUtils';
import { toast } from 'sonner';
import { CustomError } from '@/utils/ErrorClasses';
import { queryClient } from '@/main';

// Custom hook that encapsulates all group-related API operations
export const useGroups = (groupId?: string) => {
  // fetch user's allocated groups
  const fetchGroupsResponse = useQuery({
    queryKey: queryKeys.groupList(),
    queryFn: getGroups,
    // after 10 seconds data will be considered stale and queryFn will be executed again
    // within the staleTime limit, data wont be refreshed even if the window loses focus/component remounts
    staleTime: 5 * 60 * 1000, // 5 mins
    // time fetched data is stored in the cache before being removed
    gcTime: 10 * 60 * 1000, // 10 mins
  });

  const createGroupResponse = useMutation({
    mutationFn: createNewGroup,
    // optimistic update, this function will be run before the server response
    onMutate: async (newGroup) => {
      const targetQueryKeyArr = queryKeys.groupList();

      // cancel outgoing group fetch requests so that they dont overwrite the optimisitic update
      await queryClient.cancelQueries({ queryKey: targetQueryKeyArr });

      // store a snapshot of the previous data
      const previousGroups = queryClient.getQueryData<GroupListResponse>(targetQueryKeyArr);

      // create temp optimistic group obj with correct shape
      const optimisticGroup: GroupsObj = {
        groupId: `temp-${Date.now()}`,
        groupName: newGroup.groupName,
        groupMembers: 1,
        imgUrl: newGroup.imgUrl,
        groupIsHidden: false,
        projectCount: 0,
        isRequestUserAdmin: true,
        createdAt: new Date(),
      };

      // immediately update cached group list
      queryClient.setQueryData<GroupListResponse>(targetQueryKeyArr, (oldData) => {
        // no cached groups exsits, so add new group in appropriate obj shape
        if (!oldData) {
          return { groups: [optimisticGroup] };
        }

        // cached data exists so append new to previous data in an immutable way
        return { groups: [...oldData.groups, optimisticGroup] };
      });
      // return previous data if the server responses with error
      // this is passed to the 'context' parameter in OnError
      return { previousGroups };
    },

    // rollback changes if mutation fails
    onError: (err, _, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(queryKeys.groupList(), context.previousGroups);
      }

      console.error('Failed to create group:', err);

      let errorMessage = 'Please try again later.';
      let title = 'Error';

      if (err instanceof CustomError) {
        errorMessage = err.message;
        title = err.title || 'Failed to create group';
      }

      toast.error(title, {
        description: errorMessage,
      });
    },
    onSettled: () => {
      // refetch after error or success to ensure we always have the correct data
      queryClient.invalidateQueries({ queryKey: queryKeys.groupList() });
    },
    onSuccess: (data, variables) => {
      toast.success('Group created successfully', {
        description: `"${variables.groupName}" has been created. You can now invite members.`,
      });
      console.log('Group created successfully:', data);
    },
  });

  const deleteGroupResponse = useMutation({
    mutationFn: deleteGroup,

    onMutate: async (deleteGroupObj) => {
      const targetQueryKeyArr = queryKeys.groupList();

      // cancel outgoing group fetch requests so they don't overwrite the optimistic update
      await queryClient.cancelQueries({ queryKey: targetQueryKeyArr });

      // store a snapshot of the previous data
      const previousGroups = queryClient.getQueryData<GroupListResponse>(targetQueryKeyArr);

      // immediately update cached group list by filtering out the deleted group
      queryClient.setQueryData<GroupListResponse>(targetQueryKeyArr, (oldData) => {
        if (!oldData) return { groups: [] };

        return {
          groups: oldData.groups.filter((group) => group.groupId !== deleteGroupObj.groupId),
        };
      });

      // return previous data if the server responds with error
      return { previousGroups };
    },

    // rollback changes if mutation fails
    onError: (err, _, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(queryKeys.groupList(), context.previousGroups);
      }

      console.error('Failed to delete group:', err);

      let errorMessage = 'Please try again later.';
      let title = 'Error';

      if (err instanceof CustomError) {
        errorMessage = err.message;
        title = err.title || 'Failed to delete group';
      }

      toast.error(title, {
        description: errorMessage,
      });
    },

    onSettled: () => {
      // refetch after error or success to ensure we always have the correct data
      queryClient.invalidateQueries({ queryKey: queryKeys.groupList() });
    },

    onSuccess: (data) => {
      toast.success('Group deleted successfully');
      console.log('Group deleted successfully:', data);
    },
  });

  const getGroupMembersResponse = useQuery({
    queryKey: queryKeys.getMembers(groupId as string),
    queryFn: () => {
      if (!groupId) {
        throw new Error('Group ID is required to fetch members');
      }
      return getGroupMembers(groupId);
    },
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, // 10 mins
  });

  const getGroupDetailsResponse = useQuery({
    queryKey: queryKeys.getGroupDetails(groupId as string),
    queryFn: () => {
      if (!groupId) {
        throw new Error('Group ID is required to fetch group details');
      }
      return getGroupDetails(groupId);
    },
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, // 10 mins
  });

  const editGroupDetailsResponse = useMutation({
    mutationFn: editGroupDetails,
    // Add optimistic updates
    onMutate: async (updatedGroup) => {
      if (!groupId) {
        throw new Error('Group ID is required to update group details');
      }

      // Target query keys for both details and list views
      const detailsQueryKey = queryKeys.getGroupDetails(groupId);
      const listQueryKey = queryKeys.groupList();

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: detailsQueryKey });
      await queryClient.cancelQueries({ queryKey: listQueryKey });

      // Snapshot previous values
      const previousDetails = queryClient.getQueryData(detailsQueryKey);
      const previousGroups = queryClient.getQueryData<GroupListResponse>(listQueryKey);

      // Optimistically update group details
      queryClient.setQueryData(detailsQueryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          groupName: updatedGroup.groupName,
          groupDescription: updatedGroup.groupDetails,
          groupImage: updatedGroup.imgUrl,
          groupIsHidden: updatedGroup.groupIsHidden,
        };
      });

      // Optimistically update the group in the list view
      queryClient.setQueryData<GroupListResponse>(listQueryKey, (oldData) => {
        if (!oldData) return { groups: [] };

        return {
          groups: oldData.groups.map((group) => {
            if (group.groupId === updatedGroup.groupId) {
              return {
                ...group,
                groupName: updatedGroup.groupName,
                imgUrl: updatedGroup.imgUrl,
              };
            }
            return group;
          }),
        };
      });

      // Return previous values for rollback
      return { previousDetails, previousGroups };
    },

    onError: (err, _, context) => {
      console.error('Failed to edit group:', err);

      // Rollback to previous state on error
      if (context?.previousDetails) {
        queryClient.setQueryData(queryKeys.getGroupDetails(groupId as string), context.previousDetails);
      }

      if (context?.previousGroups) {
        queryClient.setQueryData(queryKeys.groupList(), context.previousGroups);
      }

      let errorMessage = 'Please try again later.';
      let title = 'Error';

      if (err instanceof CustomError) {
        errorMessage = err.message;
        title = err.title || 'Failed to edit group';
      }

      toast.error(title, {
        description: errorMessage,
      });
    },

    onSuccess: (_, variables) => {
      // Show success toast
      toast.success('Group details updated successfully', {
        description: `"${variables.groupName}" has been updated`,
      });
    },

    onSettled: () => {
      // Invalidate all related queries to ensure consistent state
      if (groupId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.getGroupDetails(groupId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.groupList(),
        });
      }
    },
  });

  const inviteGroupMemberResponse = useMutation({
    mutationFn: addGroupMember,
    onMutate: async () => {
      if (!groupId) {
        throw new Error('Group ID is required to invite members');
      }

      const targetQueryKeyArr = queryKeys.getMembers(groupId);

      // Cancel outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: targetQueryKeyArr });

      // Snapshot the previous members data
      const previousMembers = queryClient.getQueryData(targetQueryKeyArr);

      // Since users are auto-added, we don't need to update the optimistic UI here
      // as we'll invalidate and refetch in onSettled

      return { previousMembers };
    },

    onError: (err, _, context) => {
      // Revert to the previous members data if available
      if (context?.previousMembers) {
        queryClient.setQueryData(queryKeys.getMembers(groupId as string), context.previousMembers);
      }

      console.error('Failed to invite member:', err);

      let errorMessage = 'Please try again later.';
      let title = 'Error';

      if (err instanceof CustomError) {
        errorMessage = err.message;
        title = err.title || 'Failed to add member';
      }

      toast.error(title, {
        description: errorMessage,
      });
    },

    onSuccess: () => {
      toast.success('Member added to group successfully');
    },

    onSettled: async () => {
      if (groupId) {
        // Invalidate and force refetch both queries
        await queryClient.invalidateQueries({
          queryKey: queryKeys.getMembers(groupId),
          // force refetch active queries
          refetchType: 'active',
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.getGroupDetails(groupId),
          refetchType: 'active',
        });
      }
    },
  });

  const updateGroupVisibilityResponse = useMutation({
    mutationFn: editGroupUser,

    onMutate: async ({ groupId, groupIsHidden }: EditUserGroup) => {
      if (!groupId) {
        throw new Error('Group ID is required to update visibility');
      }

      // Target query keys for both details and list views
      const detailsQueryKey = queryKeys.getGroupDetails(groupId);
      const listQueryKey = queryKeys.groupList();

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: detailsQueryKey });
      await queryClient.cancelQueries({ queryKey: listQueryKey });

      // Snapshot previous values
      const previousDetails = queryClient.getQueryData(detailsQueryKey);
      const previousGroups = queryClient.getQueryData<GroupListResponse>(listQueryKey);

      // Optimistically update the group in the list view
      queryClient.setQueryData<GroupListResponse>(listQueryKey, (oldData) => {
        if (!oldData) return { groups: [] };

        return {
          groups: oldData.groups.map((group) => {
            if (group.groupId === groupId) {
              return {
                ...group,
                groupIsHidden: groupIsHidden,
              };
            }
            return group;
          }),
        };
      });

      // Return previous values for rollback
      return { previousDetails, previousGroups };
    },

    onError: (err, variables, context) => {
      // Rollback to previous state on error
      if (context?.previousDetails) {
        queryClient.setQueryData(queryKeys.getGroupDetails(variables.groupId), context.previousDetails);
      }

      if (context?.previousGroups) {
        queryClient.setQueryData(queryKeys.groupList(), context.previousGroups);
      }

      console.error('Failed to update group visibility:', err);

      let errorMessage = 'Please try again later.';
      let title = 'Error';

      if (err instanceof CustomError) {
        errorMessage = err.message;
        title = err.title || 'Failed to update group visibility';
      }

      toast.error(title, {
        description: errorMessage,
      });
    },

    onSuccess: (_, variables) => {
      // Show success toast
      toast.success(variables.groupIsHidden ? 'Group hidden successfully' : 'Group visibility restored', {
        description: variables.groupIsHidden
          ? 'The group is now hidden from dashboard view'
          : 'The group is now visible on the dashboard',
      });
    },

    onSettled: (_, __, variables) => {
      // Invalidate all related queries to ensure consistent state
      queryClient.invalidateQueries({
        queryKey: queryKeys.getGroupDetails(variables.groupId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupList(),
      });
    },
  });

  return {
    fetchGroupsResponse,
    createGroupResponse,
    deleteGroupResponse,
    getGroupDetailsResponse,
    getGroupMembersResponse,
    editGroupDetailsResponse,
    inviteGroupMemberResponse,
    updateGroupVisibilityResponse,
  };
};
