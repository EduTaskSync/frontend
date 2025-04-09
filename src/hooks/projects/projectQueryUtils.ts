import axios from 'axios';
import axiosConfig from '@/api/axiosConfig';
import { CustomError } from '@/utils/ErrorClasses';
import {
  NewProjectObj,
  ProjectListResponse,
  NewProjectResponse,
  DeleteProjectObj,
  DeleteProjectResponse,
  GetProjectMembersResponse,
  UpdatedProject,
} from './projectInterfaces';
import { ApiEndPoints } from '@/constants/apiEndpoints';

// GET http request for user's assigned projects
export const getAllProjects = async () => {
  try {
    const response = await axiosConfig.get<ProjectListResponse>(ApiEndPoints.GET_PROJECTS);
    // axios automatically parses JSON so need to use response.json()
    return response.data;
  } catch (error) {
    console.log('Error fetching projects:', error);

    // axios rejects rejected Promises with its own error wrapper so this check is needed
    // it includes these properties: response (server response object) and message (string message describing error)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        throw new CustomError('Please log in again.', 'Authentication error');
      } else if (status === 403) {
        throw new CustomError('You do not have access to one or more grojects.', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('Please try again later.', 'Grojects not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later.', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const createNewProject = async (newProject: NewProjectObj) => {
  const response = await axiosConfig.post<NewProjectResponse>(ApiEndPoints.CREATE_PROJECT, newProject);
  return response.data;
};

export const deleteProject = async (deleteProjectObj: DeleteProjectObj) => {
  const response = await axiosConfig.delete<DeleteProjectResponse>(ApiEndPoints.DELETE_PROJECT, {
    data: { projectId: deleteProjectObj.projectId },
  });
  return response.data;
};

export const getProjectMembers = async (projectId: string) => {
  try {
    const response = await axiosConfig.get<GetProjectMembersResponse>(ApiEndPoints.GET_PROJECT_USERS, {
      params: {
        project_uuid: projectId,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error fetching project member data:', error);

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

export const editProjectDetails = async (updatedProject: UpdatedProject) => {
  await axiosConfig.post(ApiEndPoints.UPDATE_PROJECT, updatedProject);
};
