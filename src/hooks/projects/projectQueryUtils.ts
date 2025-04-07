import { CreateProjectDto, ProjectBaseResponse, ProjectSummaryListResponse } from './projectInterfaces';
import axiosConfig from '@/api/axiosConfig';
import { ApiEndPoints } from '@/constants/apiEndpoints';
import { CustomError } from '@/utils/ErrorClasses';
import axios from 'axios';

export const getProjectsSummary = async (groupId: string): Promise<ProjectSummaryListResponse> => {
  try {
    // Replace with actual API call
    const response = await axiosConfig.get<ProjectSummaryListResponse>(
      ApiEndPoints.GET_GROUP_PROJECTS_SUMMARY + `?groupId=${groupId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      //format error message
      const errorMessage = error.response?.data?.message || 'Unknown error occurred';
      throw new CustomError(errorMessage);
    }
    // For non-Axios errors
    throw new CustomError('An unexpected error occurred. Please try again later.', 'Error');
  }
};

export const createProject = async (projectData: CreateProjectDto, groupId: string): Promise<ProjectBaseResponse> => {
  try {
    const response = await axiosConfig.post<ProjectBaseResponse>(
      `${ApiEndPoints.CREATE_PROJECT}/${groupId}`,
      projectData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Unknown error occurred';
      throw new CustomError(errorMessage);
    }
    // For non-Axios errors
    throw new CustomError('An unexpected error occurred. Please try again later.', 'Error');
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const response = await axiosConfig.delete<void>(`${ApiEndPoints.DELETE_PROJECT}/${projectId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Unknown error occurred';
      throw new CustomError(errorMessage);
    }
    // For non-Axios errors
    throw new CustomError('An unexpected error occurred. Please try again later.', 'Error');
  }
};
