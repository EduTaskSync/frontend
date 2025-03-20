import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/utils/queryKeyFactory';
import { GroupListResponse, GroupsObj } from './groupInterfaces';
import { getAllGroups, createNewGroup, deleteGroup } from './groupQueryUtils';
import { toast } from 'sonner';
import axios from 'axios';

// Custom hook that encapsulates all group-related API operations
export const useGroups = () => {
  // needed for making certain cached data stale so that they are updated after mutations by targeting their query key
  const queryClient = useQueryClient();

  // fetch user's allocated groups
  const fetchGroupsResponse = useQuery({
    queryKey: queryKeys.groupList(),
    queryFn: getAllGroups,
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
        groupMembers: [],
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
    onError: (err, newGroup, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(queryKeys.groupList(), context.previousGroups);
      }

      console.error('Failed to create group:', err);

      // specific error messaging based on error type
      let errorMessage = 'Please try again later.';
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
        } else if (err.response.status === 403) {
          errorMessage = "You don't have permission to create groups.";
        }
      }

      toast.error('Failed to create group', {
        description: errorMessage,
      });
    },
    onSettled: () => {
      // refetch after error or success to ensure we always have the correct data
      queryClient.invalidateQueries({ queryKey: queryKeys.groupList() });
    },
    //debugging purposes
    onSuccess: (data) => {
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
    onError: (err, deleteGroupObj, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(queryKeys.groupList(), context.previousGroups);
      }

      console.error('Failed to delete group:', err);

      // specific error messaging based on error type
      let errorMessage = 'Please try again later.';

      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          errorMessage = 'This group has ongoing projects.';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
        } else if (err.response.status === 403) {
          errorMessage = "You don't have permission to delete this group.";
        } else if (err.response.status === 404) {
          errorMessage = 'Group not found. It may have been already deleted.';
        } else if (err.response.status === 409) {
          errorMessage = 'This group has active assignments. Use force delete if you want to remove it anyway.';
        }
      }

      toast.error('Failed to delete group', {
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

  return {
    fetchGroupsResponse,
    createGroupResponse,
    deleteGroupResponse,
  };
};
