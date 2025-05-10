import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserAssignedTasks, TasksQueryParams } from './dashboardQueryUtils';
import { TaskBaseResponse } from './taskInterface';
import { queryKeys } from '@/utils/queryKeyFactory';

export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'All';
export type SortOrder = 'asc' | 'desc';
export type DateFilter = 'all' | 'overdue' | 'today' | 'upcoming' | 'done';

interface UseDashboardOptions {
  initialPage?: number;
  limit?: number;
  initialStatus?: TaskStatus;
  initialDateFilter?: DateFilter;
  initialGroupId?: string | null;
  initialSortOrder?: SortOrder;
  searchQuery?: string;
}

export const useDashboard = (options: UseDashboardOptions = {}) => {
  // Default options
  const {
    initialPage = 0,
    limit = 10,
    initialStatus = 'All',
    initialDateFilter = 'all',
    initialGroupId = null,
    initialSortOrder = 'asc',
    searchQuery = '',
  } = options;

  // State for filters and pagination
  const [page, setPage] = useState(initialPage);
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [dateFilter, setDateFilter] = useState<DateFilter>(initialDateFilter);
  const [groupId, setGroupId] = useState<string | null>(initialGroupId);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

  // Create query params object - only include groupId for server-side filtering
  const queryParams = useMemo<TasksQueryParams>(
    () => ({
      // Pass only groupId to API, other filters are client-side
      page,
      limit,
      groupId,
    }),
    [page, limit, groupId]
  );

  // Main query to fetch user tasks with pagination
  const {
    data: tasksData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: queryKeys.dashboard.assignedTasks(queryParams),
    queryFn: () => getUserAssignedTasks(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Get raw tasks from API response
  const rawTasks = useMemo(() => {
    return tasksData?.tasks || [];
  }, [tasksData]);

  // Helper function to determine if a task is overdue
  const isOverdue = (task: TaskBaseResponse) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDeadline = new Date(task.taskDeadline);
    return taskDeadline < today && task.status !== 'Done';
  };

  // Helper function to determine if a task is due today
  const isDueToday = (task: TaskBaseResponse) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDeadline = new Date(task.taskDeadline);
    const taskDateNoTime = new Date(taskDeadline);
    taskDateNoTime.setHours(0, 0, 0, 0);

    return taskDateNoTime.getTime() === today.getTime();
  };

  // Helper function to check if task is upcoming (future date)
  const isUpcoming = (task: TaskBaseResponse) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDeadline = new Date(task.taskDeadline);
    const taskDateNoTime = new Date(taskDeadline);
    taskDateNoTime.setHours(0, 0, 0, 0);

    return taskDateNoTime > today && task.status !== 'Done';
  };

  // Apply client-side filtering to the tasks
  const filteredTasks = useMemo(() => {
    // Start with all tasks from API
    let filtered = [...rawTasks];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((task) => task.taskName.toLowerCase().includes(query));
    }

    // Apply status filter
    if (status !== 'All') {
      filtered = filtered.filter((task) => task.status === status);
    }

    // Apply date filter
    switch (dateFilter) {
      case 'overdue':
        filtered = filtered.filter((task) => isOverdue(task));
        break;
      case 'today':
        filtered = filtered.filter((task) => isDueToday(task));
        break;
      case 'upcoming':
        filtered = filtered.filter((task) => isUpcoming(task));
        break;
      case 'done':
        filtered = filtered.filter((task) => task.status === 'Done');
        break;
      // 'all' shows everything, no filter needed
    }

    // Priority sorting based on due date urgency
    return filtered.sort((a, b) => {
      // When using default sort (asc), prioritize tasks by:
      // 1. Overdue tasks first
      // 2. Due today second
      // 3. Then normal date sorting

      const dateA = new Date(a.taskDeadline).getTime();
      const dateB = new Date(b.taskDeadline).getTime();

      if (sortOrder === 'asc') {
        // First sort by urgency priority
        if (isOverdue(a) && !isOverdue(b)) return -1;
        if (!isOverdue(a) && isOverdue(b)) return 1;
        if (isDueToday(a) && !isDueToday(b)) return -1;
        if (!isDueToday(a) && isDueToday(b)) return 1;

        // Then sort by date
        return dateA - dateB;
      } else {
        // In desc mode, still prioritize overdue and today, but with later dates first
        if (isOverdue(a) && !isOverdue(b)) return -1;
        if (!isOverdue(a) && isOverdue(b)) return 1;
        if (isDueToday(a) && !isDueToday(b)) return -1;
        if (!isDueToday(a) && isDueToday(b)) return 1;

        // Then reverse date order
        return dateB - dateA;
      }
    });
  }, [rawTasks, status, dateFilter, sortOrder, searchQuery]);

  // Pagination metadata based on filtered tasks
  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const currentPage = Math.min(page, totalPages);

  // Calculate the visible tasks based on current page
  const tasks = useMemo(() => {
    const startIndex = currentPage * limit;
    const endIndex = startIndex + limit;
    return filteredTasks.slice(startIndex, endIndex);
  }, [filteredTasks, currentPage, limit]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setPage(0);
  }, [status, dateFilter, sortOrder, searchQuery]);

  // Statistics for dashboard
  const taskStats = useMemo(() => {
    const completed = rawTasks.filter((task) => task.status === 'Done').length;
    const overdue = rawTasks.filter((task) => isOverdue(task)).length;
    const dueToday = rawTasks.filter((task) => isDueToday(task)).length;

    return {
      total: rawTasks.length,
      completed,
      overdue,
      dueToday,
      completionRate: rawTasks.length ? (completed / rawTasks.length) * 100 : 0,
    };
  }, [rawTasks]);

  return {
    // Data
    tasks, // Filtered, sorted, and paginated tasks
    filteredTasks, // All filtered and sorted tasks
    totalTasks: totalItems,
    totalPages,
    currentPage,

    // Loading states
    isLoading,
    isRefetching,
    isError,
    error,

    // Pagination controls
    page,
    setPage,
    limit,

    // Filter controls
    status,
    setStatus,
    dateFilter,
    setDateFilter,
    groupId,
    setGroupId,

    // Sort controls
    sortOrder,
    setSortOrder,

    // Actions
    refetch,

    // Statistics
    taskStats,

    // Utility functions
    isOverdue,
    isDueToday,

    // Reset all filters and pagination
    resetFilters: () => {
      setStatus('All');
      setDateFilter('all');
      setGroupId(null);
      setPage(0);
      setSortOrder('asc');
    },
  };
};
