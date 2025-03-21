import axios from 'axios';
import axiosConfig from '@/api/axiosConfig';
import { CustomError } from '@/utils/ErrorClasses';
import {
  NewGroupObj,
  GroupListResponse,
  NewGroupResponse,
  DeleteGroupObj,
  DeleteGroupResponse,
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
        throw new CustomError('Authentication error', 'Please log in again.');
      } else if (status === 403) {
        throw new CustomError('Permission denied', 'You do not have access to one or more groups.');
      } else if (status === 404) {
        throw new CustomError('Groups not found', 'Please try again later.');
      } else if (status === 500) {
        throw new CustomError('Internal Server Error', 'Please try again later.');
      }
    }

    // handle unknown errors
    throw new CustomError('Unknown Error', error instanceof Error ? error.message : 'Please try again later');
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
