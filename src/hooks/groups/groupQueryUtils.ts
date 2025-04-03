import axios from 'axios';
import axiosConfig from '@/api/axiosConfig';
import { CustomError } from '@/utils/ErrorClasses';
import {
  NewGroupObj,
  GroupListResponse,
  NewGroupResponse,
  DeleteGroupObj,
  DeleteGroupResponse,
  GetGroupMembersResponse,
  UpdatedGroup,
} from './groupInterfaces';
import { ApiEndPoints } from '@/constants/apiEndpoints';

// GET http request for user's assigned groups
export const getAllGroups = async () => {
  try {
    const response = await axiosConfig.get<GroupListResponse>(ApiEndPoints.GET_GROUPS);
    // axios automatically parses JSON so need to use response.json()
    return response.data;
  } catch (error) {
    console.log('Error fetching groups:', error);

    // axios rejects rejected Promises with its own error wrapper so this check is needed
    // it includes these properties: response (server response object) and message (string message describing error)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        throw new CustomError('Please log in again.', 'Authentication error');
      } else if (status === 403) {
        throw new CustomError('You do not have access to one or more groups.', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('Please try again later.', 'Groups not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later.', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const createNewGroup = async (newGroup: NewGroupObj) => {
  const response = await axiosConfig.post<NewGroupResponse>(ApiEndPoints.CREATE_GROUP, newGroup);
  return response.data;
};

export const deleteGroup = async (deleteGroupObj: DeleteGroupObj) => {
  const response = await axiosConfig.delete<DeleteGroupResponse>(ApiEndPoints.DELETE_GROUP, {
    data: { groupId: deleteGroupObj.groupId },
  });
  return response.data;
};

export const getGroupMembers = async (groupId: string) => {
  try {
    const response = await axiosConfig.get<GetGroupMembersResponse>(ApiEndPoints.GET_GROUP_USERS, {
      params: {
        group_uuid: groupId,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error fetching group member data:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        throw new CustomError('Please log in again.', 'Authentication error');
      } else if (status === 403) {
        throw new CustomError('You do not have permission to view members.', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('Please try again later.', 'Members not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later.', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const editGroupDetails = async (updatedGroup: UpdatedGroup) => {
  await axiosConfig.post(ApiEndPoints.UPDATE_GROUP, updatedGroup);
};
