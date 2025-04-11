import axiosConfig from '@/api/axiosConfig';
import { ApiEndPoints } from '@/constants/apiEndpoints';
import {
  CreateKanbanColumnResponse,
  GetKanbanColumnsResponse,
  NewKanbanColumn,
  ReorderedColumnsData,
  UpdatedColumnData,
} from './kanbanInterfaces';
import axios from 'axios';
import { CustomError } from '@/utils/ErrorClasses';

export const createKanbanColumn = async (columnData: NewKanbanColumn) => {
  try {
    const response = await axiosConfig.post<CreateKanbanColumnResponse>(ApiEndPoints.KANBAN_CREATE_COLUMN, columnData);
    console.log('Column created successfully with these data:', columnData);
    return response.data;
  } catch (error) {
    console.log('Error fetching groups:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        throw new CustomError('Please check your data and try again', 'Something went wrong');
      } else if (status === 401) {
        throw new CustomError('Please log in again', 'Authentication error');
      } else if (status === 403) {
        throw new CustomError('You do not have access to this project', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('Please try again later', 'Column details not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const getKanbanColumns = async (projectId: string) => {
  try {
    const response = await axiosConfig.get<GetKanbanColumnsResponse>(ApiEndPoints.KANBAN_GET_COLUMNS, {
      params: {
        projectId,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error fetching kanban columns:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        throw new CustomError('Please check your data and try again', 'Something went wrong');
      } else if (status === 401) {
        throw new CustomError('Please log in again', 'Authentication error');
      } else if (status === 403) {
        throw new CustomError('You do not have access to this project', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('Please try again later', 'Column details not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const deleteKanbanColumn = async (columnId: string) => {
  try {
    const response = await axiosConfig.delete(ApiEndPoints.KANBAN_DELETE_COLUMN, { data: { columnId } });
    return response.data;
  } catch (error) {
    console.log('Error deleting column:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        throw new CustomError('Please check your data and try again', 'Something went wrong');
      } else if (status === 401) {
        throw new CustomError('Please log in again', 'Authentication error');
      } else if (status === 403) {
        throw new CustomError('You do not have access to this project', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('Please try again later', 'Column details not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const updateKanbanColumn = async (updatedColumnData: UpdatedColumnData) => {
  try {
    const response = await axiosConfig.post(ApiEndPoints.KANBAN_UPDATE_COLUMN, updatedColumnData);
    return response.data;
  } catch (error) {
    console.log('Error updating column:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        throw new CustomError('Please check your data and try again', 'Something went wrong');
      } else if (status === 401) {
        throw new CustomError('Please log in again', 'Authentication error');
      } else if (status === 403) {
        throw new CustomError('You do not have access to this project', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('Please try again later', 'Column details not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};

export const reorderKanbanColumns = async (reorderedKanbanColumns: ReorderedColumnsData) => {
  try {
    const response = await axiosConfig.post(ApiEndPoints.KANBAN_REORDER_COLUMNS, reorderedKanbanColumns);
    return response.data;
  } catch (error) {
    console.log('Error re-ordering columns:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        throw new CustomError('Please check your data and try again', 'Something went wrong');
      } else if (status === 401) {
        throw new CustomError('Please log in again', 'Authentication error');
      } else if (status === 403) {
        throw new CustomError('You do not have access to this project', 'Permission denied');
      } else if (status === 404) {
        throw new CustomError('Please try again later', 'Column details not found');
      } else if (status === 500) {
        throw new CustomError('Please try again later', 'Internal Server Error');
      }
    }

    // handle unknown errors
    throw new CustomError(error instanceof Error ? error.message : 'Please try again later', 'Unknown Error');
  }
};
