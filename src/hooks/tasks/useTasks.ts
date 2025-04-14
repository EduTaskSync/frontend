import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CustomError } from '@/utils/ErrorClasses';
import { getTasksSummary, createTask, deleteTask } from '@/hooks/tasks/taskQueryUtils.ts';
import { CreateTaskDto, TaskSummaryListResponse, TaskSummaryResponse } from './taskInterfaces';

// Define query keys for tasks
export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  taskProjects: (columnId: string) => [...taskQueryKeys.lists(), { columnId }] as const,
  details: () => [...taskQueryKeys.all, 'detail'] as const,
};

// Main hook for tasks
export const useTasks = (columnId?: string) => {
  const queryClient = useQueryClient();

  // Fetch tasks for a specific project
  const fetchTasksSummaryResponse = useQuery({
    queryKey: taskQueryKeys.taskProjects(columnId as string),
    queryFn: () => {
      //if (!columnId) {
      //  throw new Error('Column ID is required to fetch tasks');
      //}
      return getTasksSummary();
    },
    // Setting cache management
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!columnId, // Only run if groupId exists
  });

  // Create new task with optimistic updates
  const createTaskResponse = useMutation({
    // Updated to match your API function signature that takes separate params
    mutationFn: (taskData: CreateTaskDto) => {
      //if (!columnId) {
      //  throw new Error('Column ID is required to create a task');
      //}
      return createTask(taskData);
    },

    // Optimistic update handling
    onMutate: async (newTask) => {
      if (!columnId) {
        throw new Error('Column ID is required to create a task');
      }

      const queryKey = taskQueryKeys.taskProjects(columnId);

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<TaskSummaryListResponse>(queryKey);

      // Create optimistic task with properties matching your TaskSummary interface
      const optimisticTask: TaskSummaryResponse = {
        
        taskName: newTask.taskName,
        projectId: `temp-${Date.now()}`,
        columnId: newTask.columnId,
        taskDeadline: newTask.taskDeadline,
        projectName: `temp-${Date.now()}`,
        
      };

      // Update cache with optimistic data - make sure we're using TaskSummaryListResponse
      queryClient.setQueryData<TaskSummaryListResponse>(queryKey, (oldData) => {
        if (!oldData) {
          return { tasks: [optimisticTask] };
        }
        return {
          tasks: [...oldData.tasks, optimisticTask],
        };
      });

      return { previousTasks };
    },

    // Error handling
    onError: (err, _, context) => {
      if (context?.previousTasks && columnId) {
        queryClient.setQueryData(taskQueryKeys.taskProjects(columnId), context.previousTasks);
      }

      console.error('Failed to create task:', err);

      let errorMessage = 'Please try again later.';
      let title = 'Error';

      if (err instanceof CustomError) {
        errorMessage = err.message;
        title = err.title || 'Failed to create task';
      }

      toast.error(title, {
        description: errorMessage,
      });
    },

    // Success handling - add task to cache if needed
    onSuccess: (data:CreateTaskDto) => {
      // Check if we need to update the cache directly instead of just invalidating
      if (columnId) {
        queryClient.setQueryData<TaskSummaryListResponse>(taskQueryKeys.taskProjects(columnId), (oldData) => {
          // If we don't have cached data, don't try to update it
          if (!oldData) return oldData;

          // Remove the optimistic entry and add the real one
          const filteredTasks = oldData.tasks.filter(
            (task) => !task.projectId.toString().startsWith('temp-')
          );

          // Create a properly formatted task from the API response
          const newTask: TaskSummaryResponse = {
            
            taskName: data.taskName,
            projectId: `temp-${Date.now()}`,
            columnId: columnId,
            taskDeadline: data.taskDeadline,
            projectName: `temp-${Date.now()}`,
          };

          return {
            ...oldData,
            tasks: [...filteredTasks, newTask],
          };
        });
      }

      toast.success('Task created successfully', {
        description: `"${data.taskName}" has been created.`,
      });
    },

    // Refetch if needed for consistency
    onSettled: () => {
      if (columnId) {
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.taskProjects(columnId),
        });
      }
    },
  });

  const deleteTaskResponse = useMutation({
    mutationFn: (columnId: string) => {
      return deleteTask(columnId);
    },

    // Optimistic update handling
    onMutate: async (columnId) => {
      if (!columnId) {
        throw new Error('Column ID is required to delete a task');
      }

      const queryKey = taskQueryKeys.taskProjects(columnId);

      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous data
      const previousTasks = queryClient.getQueryData<TaskSummaryListResponse>(queryKey);

      // Store the task being deleted for display in toast
      const taskToDelete = previousTasks?.tasks.find((task) => task.columnId === columnId);

      // Optimistically remove the task from cache
      queryClient.setQueryData<TaskSummaryListResponse>(queryKey, (oldData) => {
        if (!oldData) return { tasks: [] };

        return {
          ...oldData,
          projects: oldData.tasks.filter((task) => task.columnId !== columnId),
        };
      });

      return { previousTasks, taskToDelete };
    },

    // Error handling
    onError: (err, _projectId, context) => {
      // Restore previous data on error
      if (context?.previousTasks && columnId) {
        queryClient.setQueryData(taskQueryKeys.taskProjects(columnId), context.previousTasks);
      }

      console.error('Failed to delete task:', err);

      let errorMessage = 'Please try again later.';
      let title = 'Delete Failed';

      if (err instanceof CustomError) {
        errorMessage = err.message;
        title = err.title || 'Failed to delete task';
      }

      toast.error(title, {
        description: errorMessage,
      });
    },

    // Success handling
    onSuccess: (_, _projectId, context) => {
      const taskName = context?.taskToDelete?.taskName || 'Task';

      toast.success('Task deleted', {
        description: `"${taskName}" has been removed.`,
      });
    },

    // Always refetch after operation to ensure consistency
    onSettled: () => {
      if (columnId) {
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.taskProjects(columnId),
        });
      }
    },
  });

  return {
    fetchTasksSummaryResponse,
    createTaskResponse,
    deleteTaskResponse,
  };
};
