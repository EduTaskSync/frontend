import { CreateTaskDto, TaskBaseResponse, TaskSummaryListResponse } from './taskInterfaces';
import axiosConfig from '@/api/axiosConfig';
import { ApiEndPoints } from '@/constants/apiEndpoints';
import { CustomError } from '@/utils/ErrorClasses';
import axios from 'axios';

export const getTasksSummary = async (): Promise<TaskSummaryListResponse> => {
  try {
    // Replace with actual API call
    const response = await axiosConfig.get<TaskSummaryListResponse>(
      ApiEndPoints.GET_PROJECT_COLUMN_TASK //+ `?columnId=${columnId}`
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

export const createTask = async (taskData: CreateTaskDto): Promise<TaskBaseResponse> => {
  try {
    const response = await axiosConfig.post<TaskBaseResponse>(
      `${ApiEndPoints.CREATE_PROJECT_TASK}`,
      taskData
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

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const response = await axiosConfig.delete<void>(`${ApiEndPoints.DELETE_PROJECT_TASK}/${taskId}`);
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
