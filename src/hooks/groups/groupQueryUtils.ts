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
  AddGroupMemberObj,
  SearchEmailObj,
  GroupDetailsResponse,
  EditUserGroup,
} from './groupInterfaces';
import { ApiEndPoints } from '@/constants/apiEndpoints';

// GET http request for user's assigned groups
export const getGroups = async () => {
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

      if (status === 400) {
        throw new CustomError('Please check your data and try again', 'Something went wrong');
      } else if (status === 401) {
        throw new CustomError('Please log in again', 'Authentication error');
      } else if (status === 403) {
        throw new CustomError('You do not have access to one or more groups', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('Please try again later', 'Groups not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const createNewGroup = async (newGroup: NewGroupObj) => {
  try {
    const response = await axiosConfig.post<NewGroupResponse>(ApiEndPoints.CREATE_GROUP, newGroup);
    return response.data;
  } catch (error) {
    console.log('Error creating new group:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        throw new CustomError('Please check your input and try again.', 'Something went wrong');
      } else if (status === 401) {
        throw new CustomError('Please log in again', 'Authentication error');
      } else if (status === 403) {
        throw new CustomError('You do not have permission to create groups', 'Permission denied');
      } else if (status === 500) {
        throw new CustomError('Please try again later', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const deleteGroup = async (deleteGroupObj: DeleteGroupObj) => {
  try {
    const response = await axiosConfig.delete<DeleteGroupResponse>(ApiEndPoints.DELETE_GROUP, {
      data: { groupId: deleteGroupObj.groupId },
    });
    return response.data;
  } catch (error) {
    console.log('Error deleting group:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        throw new CustomError('Make sure all projects are deleted', 'Bad Request');
      } else if (status === 401) {
        throw new CustomError('A group can only be deleted by an admin', 'Admin privileges required');
      } else if (status === 403) {
        throw new CustomError('You do not have permission to delete this group', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('The group you are trying to delete cannot be found', 'Group not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
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

      if (status === 400) {
        throw new CustomError('Invalid group ID format', 'Something went wrong');
      } else if (status === 401) {
        throw new CustomError('Please log in again', 'Authentication error');
      } else if (status === 403) {
        throw new CustomError('You do not have permission to view members', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('Please try again later', 'Members not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const editGroupDetails = async (updatedGroup: UpdatedGroup) => {
  try {
    const response = await axiosConfig.put(ApiEndPoints.UPDATE_GROUP, updatedGroup);
    return response.data;
  } catch (error) {
    console.log('Error updating group details:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        throw new CustomError('Please check your input and try again', 'Something went wrong');
      } else if (status === 401) {
        throw new CustomError('Group details can only be updated by an admin', 'Admin privileges required');
      } else if (status === 403) {
        throw new CustomError('You do not have permission to edit this group', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('The group you are trying to edit cannot be found', 'Group not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const getGroupDetails = async (groupId: string) => {
  try {
    const response = await axiosConfig.get<GroupDetailsResponse>(ApiEndPoints.GET_GROUP_DETAILS, {
      params: {
        groupId,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error fetching group details:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        throw new CustomError('Please try again later', 'Something went wrong');
      } else if (status === 401) {
        throw new CustomError('Please log in again', 'Authentication error');
      } else if (status === 403) {
        throw new CustomError('You do not have permission to view group details', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('Please try again later', 'Group details not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const addGroupMember = async (memberDetails: AddGroupMemberObj) => {
  try {
    const response = await axiosConfig.post(ApiEndPoints.INVITE_GROUP_MEMBER, memberDetails);
    return response.data;
  } catch (error) {
    console.log('Error inviting group member:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        const errorMessage = error.response?.data?.message || 'This user is already a member.';
        throw new CustomError(errorMessage, 'Duplicate member');
      } else if (status === 401) {
        throw new CustomError('Please contact a group admin', 'Admin privileges required');
      } else if (status === 403) {
        throw new CustomError('You do not have permission to invite members', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('Please try again later', 'User with given email does not exist');
      } else if (status === 500) {
        throw new CustomError('Please try again later', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const searchUserByEmail = async (searchEmail: SearchEmailObj) => {
  try {
    const response = await axiosConfig.get(ApiEndPoints.SEARCH_USER_EMAIL, {
      params: {
        email: searchEmail.email,
        limit: searchEmail.limit ?? 5,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error searching for users:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        throw new CustomError('Invalid email format', 'Bad Request');
      } else if (status === 401) {
        throw new CustomError('Please log in again', 'Authentication error');
      } else if (status === 403) {
        throw new CustomError('You do not have permission to search users', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('No user exists with given email', 'User not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const editGroupUser = async (editUserGroup: EditUserGroup) => {
  try {
    const response = await axiosConfig.patch(ApiEndPoints.EDIT_USER_GROUP, editUserGroup);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new CustomError(error.message, 'Error updating user group');
    }
    throw new CustomError('An unknown error occurred', 'Unknown Error');
  }
};

export const promoteGroupMember = async (groupId: string, userId: string) => {
  try {
    const response = await axiosConfig.post(ApiEndPoints.PROMOTE_GROUP_MEMBER, {
      groupId,
      userId,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new CustomError(error.message, 'Error promoting group member');
    }
    throw new CustomError('An unknown error occurred', 'Unknown Error');
  }
};

export const removeGroupMember = async (groupId: string, userId: string) => {
  try {
    const response = await axiosConfig.post(ApiEndPoints.REMOVE_GROUP_MEMBER, {
      groupId,
      userId,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new CustomError(error.message, 'Error removing group member');
    }
    throw new CustomError('An unknown error occurred', 'Unknown Error');
  }
};
