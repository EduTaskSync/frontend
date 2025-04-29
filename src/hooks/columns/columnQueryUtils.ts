import { CreateColumnDto, ColumnBaseResponse, ColumnSummaryListResponse } from './columnInterfaces';
import axiosConfig from '@/api/axiosConfig';
import { ApiEndPoints } from '@/constants/apiEndpoints';
import { CustomError } from '@/utils/ErrorClasses';
import axios from 'axios';

export const getColumnsSummary = async (): Promise<ColumnSummaryListResponse> => {
  try {
    // Replace with actual API call
    const response = await axiosConfig.get<ColumnSummaryListResponse>(
      ApiEndPoints.GET_PROJECT_COLUMN //+ `?columnId=${columnId}`
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

export const createColumn = async (columnData: CreateColumnDto): Promise<ColumnBaseResponse> => {
  try {
    const response = await axiosConfig.post<ColumnBaseResponse>(
      `${ApiEndPoints.CREATE_PROJECT_COLUMN}`,
      columnData
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

export const deleteColumn = async (columnId: string): Promise<void> => {
  try {
    const response = await axiosConfig.delete<void>(`${ApiEndPoints.DELETE_PROJECT_COLUMN}/${columnId}`);
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
