import axiosConfig from '@/api/axiosConfig';
import { TasksListResponse } from './taskInterface';
import { ApiEndPoints } from '@/constants/apiEndpoints';

export interface TasksQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  dateFilter?: string;
  groupId?: string | null;
  sortOrder?: string;
}

export const getUserAssignedTasks = async (params: TasksQueryParams = {}) => {
  const response = await axiosConfig.get<TasksListResponse>(ApiEndPoints.GET_ASIGNED_TASKS, {
    params: {
      page: params.page,
      limit: params.limit,
      status: params.status !== 'All' ? params.status : undefined,
      dateFilter: params.dateFilter !== 'all' ? params.dateFilter : undefined,
      groupId: params.groupId || undefined,
      sortOrder: params.sortOrder,
    },
  });
  console.log(response.data);

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error('Failed to fetch assigned tasks');
  }
};
