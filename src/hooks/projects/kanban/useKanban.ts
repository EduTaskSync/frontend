import { queryKeys } from '@/utils/queryKeyFactory';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createKanbanColumn,
  getKanbanColumnTasks,
  deleteKanbanColumn,
  getKanbanColumns,
  reorderKanbanColumns,
  updateKanbanColumn,
  deleteKanbanTask,
  createKanbanTask,
  moveKanbanTask,
  updateKanbanTask,
  assignKanbanTask,
  unassignKanbanTask,
} from './kanbanQueryUtils';
import {
  ColumnTasksResponse,
  GetKanbanColumnsResponse,
  KanbanColumn,
  Task,
  UpdatedColumnData,
  NewTaskData,
  MoveTaskData,
  TaskAssignee,
} from './kanbanInterfaces';
import { toast } from 'sonner';
import { CustomError } from '@/utils/ErrorClasses';
import { nanoid } from 'nanoid';
import { queryClient } from '@/main';

export const useKanbanColumns = (projectId: string) => {
  const getKanbanColumnsResponse = useQuery({
    queryKey: queryKeys.getKanbanColumns(projectId),
    queryFn: () => getKanbanColumns(projectId),
    // fast refetch to sync with updates from other members
    staleTime: 5000,
    // data stored in cache for 5 minutes until removed
    gcTime: 1000 * 60 * 5,
  });

  const createColumnResponse = useMutation({
    mutationFn: (columnName: string) => {
      // calculate the next index based on current columns in cache
      const previousColumns = queryClient.getQueryData<GetKanbanColumnsResponse>(queryKeys.getKanbanColumns(projectId));

      const nextColumnIndex = previousColumns?.columns.length || 0;

      return createKanbanColumn({ columnName, projectId, columnIndex: nextColumnIndex });
    },
    onMutate: async (columnName: string) => {
      const targetQueryKey = queryKeys.getKanbanColumns(projectId);

      await queryClient.cancelQueries({ queryKey: targetQueryKey });

      // get previous column data
      const previousColumns = queryClient.getQueryData<GetKanbanColumnsResponse>(targetQueryKey);

      const optimisticColumn: KanbanColumn = {
        columnId: nanoid(),
        columnName,
        columnIndex: previousColumns?.columns?.length || 0,
      };

      // Correctly preserve the data structure
      queryClient.setQueryData<GetKanbanColumnsResponse>(targetQueryKey, {
        columns: [...(previousColumns?.columns || []), optimisticColumn],
      });

      return { previousColumns };
    },
    onSuccess: (_, columnName) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.getKanbanColumns(projectId) });
      toast.success(`${columnName} added to kanban board`, {
        description: 'You can assign tasks to this column now',
      });
    },
    onError: (error, _, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(queryKeys.getKanbanColumns(projectId), context.previousColumns);
      }

      console.error('Failed to create column', error);

      let errorMessage = 'Please try again later';
      let title = 'Error';

      if (error instanceof CustomError) {
        errorMessage = error.message;
        title = error.title || 'Failed to create column';
      }

      toast.error(title, {
        description: errorMessage,
      });
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: queryKeys.getKanbanColumns(projectId) });
    },
    // retry 3 times, with a customized delay between retries
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const deleteKanbanColumnResponse = useMutation({
    mutationFn: (columnId: string) => deleteKanbanColumn(columnId),
    onMutate: async (columnId: string) => {
      const targetQueryKey = queryKeys.getKanbanColumns(projectId);
      await queryClient.cancelQueries({ queryKey: targetQueryKey });

      const previousColumns = queryClient.getQueryData<GetKanbanColumnsResponse>(targetQueryKey);

      // Correctly preserve the data structure
      queryClient.setQueryData<GetKanbanColumnsResponse>(targetQueryKey, {
        columns: previousColumns?.columns.filter((column) => column.columnId !== columnId) || [],
      });

      return { previousColumns };
    },
    onError: (error, _, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(queryKeys.getKanbanColumns(projectId), context.previousColumns);
      }

      let title = 'Error';
      let errorMessage = 'Please try again later';

      if (error instanceof CustomError) {
        title = error.title || 'Failed to delete column';
        errorMessage = error.message;
      }
      toast.error(title, { description: errorMessage });
    },
    onSuccess: () => {
      toast.success(`Column deleted successfully`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.getKanbanColumns(projectId) });
    },
  });

  const updateKanbanColumnResponse = useMutation({
    mutationFn: (updatedColumnData: UpdatedColumnData) => updateKanbanColumn(updatedColumnData),
    onMutate: async (updatedColumnData: UpdatedColumnData) => {
      const targetQueryKey = queryKeys.getKanbanColumns(projectId);
      await queryClient.cancelQueries({ queryKey: targetQueryKey });

      const previousColumns = queryClient.getQueryData<GetKanbanColumnsResponse>(targetQueryKey);

      // Find the column to update
      const updatedColumns =
        previousColumns?.columns.map((column) =>
          column.columnId === updatedColumnData.columnId
            ? { ...column, columnName: updatedColumnData.columnName }
            : column
        ) || [];

      // Correctly preserve the data structure
      queryClient.setQueryData<GetKanbanColumnsResponse>(targetQueryKey, {
        columns: updatedColumns,
      });

      return { previousColumns };
    },
    onError: (error, _, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(queryKeys.getKanbanColumns(projectId), context.previousColumns);
      }

      let title = 'Error';
      let errorMessage = 'Please try again later';

      if (error instanceof CustomError) {
        title = error.title || 'Failed to update column details';
        errorMessage = error.message;
      }
      toast.error(title, { description: errorMessage });
    },
    onSuccess: () => {
      toast.success('Column details updated successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.getKanbanColumns(projectId) });
    },
  });

  const reorderKanbanColumnsResponse = useMutation({
    mutationFn: reorderKanbanColumns,
    //! optimistic updating done locally in KanbanBoard component
    onError: (error) => {
      let title = 'Error';
      let errorMessage = 'Failed to reorder columns';

      if (error instanceof CustomError) {
        title = error.title || title;
        errorMessage = error.message;
      }

      toast.error(title, { description: errorMessage });
    },
  });

  return {
    createColumnResponse,
    getKanbanColumnsResponse,
    deleteKanbanColumnResponse,
    updateKanbanColumnResponse,
    reorderKanbanColumnsResponse,
  };
};

export const useKanbanTasks = (projectId: string, columnId: string) => {
  const getKanbanTasksResponse = useQuery({
    queryKey: queryKeys.getKanbanColumnTasks(projectId, columnId),
    queryFn: () => getKanbanColumnTasks(columnId),
    staleTime: 5 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!columnId,
  });

  const createKanbanTaskResponse = useMutation({
    mutationFn: (newTaskData: NewTaskData) => createKanbanTask(newTaskData),
    onMutate: async (newTaskData: NewTaskData) => {
      const targetQueryKey = queryKeys.getKanbanColumnTasks(projectId, columnId);

      // cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: targetQueryKey });

      // snapshot the previous tasks
      const previousTasks = queryClient.getQueryData<ColumnTasksResponse>(targetQueryKey);

      // create an optimistic task with temporary ID
      const optimisticTask: Task = {
        taskId: nanoid(),
        taskName: newTaskData.taskName,
        columnId: newTaskData.columnId,
        taskAssignees: [],
        taskDeadline: newTaskData.taskDeadline,
        taskCreationTime: new Date().toISOString(),
        // new tasks are added to the top
        taskIndex: 0,
      };

      //? arrange the tasks according to the updated task indexes
      const updatedTasks = [
        optimisticTask,
        ...(previousTasks?.tasks.map((task) => {
          return { ...task, taskIndex: task.taskIndex + 1 };
        }) || []),
      ];

      // update the cache with optimistic data
      queryClient.setQueryData<ColumnTasksResponse>(targetQueryKey, {
        tasks: updatedTasks,
      });

      return { previousTasks };
    },
    onSuccess: () => {
      toast.success('Task created successfully', {
        description: 'You can delegate the task to a group member',
      });
    },
    onError: (error, _, context) => {
      // Rollback to previous state
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.getKanbanColumnTasks(projectId, columnId), context.previousTasks);
      }

      let title = 'Error';
      let errorMessage = 'Failed to create task. Please try again later.';

      if (error instanceof CustomError) {
        title = error.title || 'Failed to create task';
        errorMessage = error.message;
      }

      toast.error(title, { description: errorMessage });
    },
    onSettled: () => {
      // invalidate and refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.getKanbanColumnTasks(projectId, columnId) });
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const deleteKanbanTaskResponse = useMutation({
    mutationFn: deleteKanbanTask,
    onMutate: (taskId) => {
      const targetQueryKey = queryKeys.getKanbanColumnTasks(projectId, columnId);
      queryClient.cancelQueries({ queryKey: targetQueryKey });

      const previousColumnTasks = queryClient.getQueryData<ColumnTasksResponse>(targetQueryKey);

      // Find the task to be deleted to know its index
      const taskToDelete = previousColumnTasks?.tasks.find((task) => task.taskId === taskId);
      if (!taskToDelete) return { previousColumnTasks };

      // Remove the deleted task and adjust indexes of tasks that come after it
      const optimisticTasks =
        previousColumnTasks?.tasks
          .filter((task) => task.taskId !== taskId)
          .map((task) => {
            // Only decrement index for tasks that were after the deleted task
            if (task.taskIndex > taskToDelete.taskIndex) {
              return { ...task, taskIndex: task.taskIndex - 1 };
            }
            return task;
          }) || [];

      // Update the cache with reindexed tasks
      queryClient.setQueryData(targetQueryKey, { tasks: optimisticTasks });
      return { previousColumnTasks };
    },
    onSuccess: () => {
      toast.success('Task deleted successfully');
    },
    onError: (error, _, context) => {
      if (context?.previousColumnTasks) {
        queryClient.setQueryData(queryKeys.getKanbanColumnTasks(projectId, columnId), {
          tasks: context.previousColumnTasks.tasks,
        });
      }

      let title = 'Error';
      let errorMessage = 'Failed to delete task. Please try again later.';

      if (error instanceof CustomError) {
        title = error.title || 'Failed to delete task'; // Fixed error message
        errorMessage = error.message;
      }

      toast.error(title, { description: errorMessage });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.getKanbanColumns(projectId) });
    },
  });

  const updateKanbanTaskResponse = useMutation({
    mutationFn: updateKanbanTask,
    onMutate: async (updatedTaskData) => {
      // Create query key for the column containing this task
      const targetQueryKey = queryKeys.getKanbanColumnTasks(projectId, columnId);

      // Cancel any outgoing refetches for this column
      await queryClient.cancelQueries({ queryKey: targetQueryKey });

      // Snapshot the previous tasks
      const previousTasks = queryClient.getQueryData<ColumnTasksResponse>(targetQueryKey);

      // Create an optimistic update - only update the taskName and taskDeadline
      const updatedTasks =
        previousTasks?.tasks.map((task) =>
          task.taskId === updatedTaskData.taskId
            ? {
                ...task,
                taskName: updatedTaskData.taskName,
                taskDeadline: updatedTaskData.taskDeadline,
              }
            : task
        ) || [];

      // Update the cache with optimistic data
      queryClient.setQueryData<ColumnTasksResponse>(targetQueryKey, {
        tasks: updatedTasks,
      });

      return { previousTasks };
    },
    onSuccess: () => {
      toast.success('Task details updated successfully');
    },
    onError: (error, _, context) => {
      // Rollback to previous state
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.getKanbanColumnTasks(projectId, columnId), context.previousTasks);
      }

      let title = 'Error';
      let errorMessage = 'Failed to update task. Please try again later.';

      if (error instanceof CustomError) {
        title = error.title || 'Failed to update task';
        errorMessage = error.message;
      }

      toast.error(title, { description: errorMessage });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getKanbanColumnTasks(projectId, columnId),
      });
    },
  });

  const assignTaskResponse = useMutation({
    mutationFn: ({ taskId, assigneeId }: { taskId: string; assigneeId: string }) =>
      assignKanbanTask(taskId, assigneeId),
    onMutate: async ({ taskId, assigneeId }) => {
      const targetQueryKey = queryKeys.getKanbanColumnTasks(projectId, columnId);
      await queryClient.cancelQueries({ queryKey: targetQueryKey });

      const previousTasks = queryClient.getQueryData<ColumnTasksResponse>(targetQueryKey);

      // Optimistically update the task with the new assignee
      const updatedTasks = previousTasks?.tasks.map((task) => {
        if (task.taskId === taskId) {
          // Create a temporary assignee object with just the ID
          const tempAssignee: TaskAssignee = {
            userId: assigneeId,
            firstName: '', // These will be populated by the server
            lastName: '', // These will be populated by the server
            profilePicture: '', // These will be populated by the server
          };
          return {
            ...task,
            taskAssignees: [...task.taskAssignees, tempAssignee],
          };
        }
        return task;
      });

      queryClient.setQueryData<ColumnTasksResponse>(targetQueryKey, {
        tasks: updatedTasks || [],
      });

      return { previousTasks };
    },
    onError: (error, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.getKanbanColumnTasks(projectId, columnId), context.previousTasks);
      }

      let title = 'Error';
      let errorMessage = 'Failed to assign task. Please try again later.';

      if (error instanceof CustomError) {
        title = error.title || 'Failed to assign task';
        errorMessage = error.message;
      }

      toast.error(title, { description: errorMessage });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getKanbanColumnTasks(projectId, columnId),
      });
    },
  });

  const unassignTaskResponse = useMutation({
    mutationFn: ({ taskId, assigneeId }: { taskId: string; assigneeId: string }) =>
      unassignKanbanTask(taskId, assigneeId),
    onMutate: async ({ taskId, assigneeId }) => {
      const targetQueryKey = queryKeys.getKanbanColumnTasks(projectId, columnId);
      await queryClient.cancelQueries({ queryKey: targetQueryKey });

      const previousTasks = queryClient.getQueryData<ColumnTasksResponse>(targetQueryKey);

      // Optimistically update the task by removing the assignee
      const updatedTasks = previousTasks?.tasks.map((task) => {
        if (task.taskId === taskId) {
          return {
            ...task,
            taskAssignees: task.taskAssignees.filter((assignee) => assignee.userId !== assigneeId),
          };
        }
        return task;
      });

      queryClient.setQueryData<ColumnTasksResponse>(targetQueryKey, {
        tasks: updatedTasks || [],
      });

      return { previousTasks };
    },
    onError: (error, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.getKanbanColumnTasks(projectId, columnId), context.previousTasks);
      }

      let title = 'Error';
      let errorMessage = 'Failed to unassign task. Please try again later.';

      if (error instanceof CustomError) {
        title = error.title || 'Failed to unassign task';
        errorMessage = error.message;
      }

      toast.error(title, { description: errorMessage });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getKanbanColumnTasks(projectId, columnId),
      });
    },
  });

  return {
    getKanbanTasksResponse,
    createKanbanTaskResponse,
    deleteKanbanTaskResponse,
    updateKanbanTaskResponse,
    assignTaskResponse,
    unassignTaskResponse,
  };
};

export const useKanbanTaskMove = () => {
  const moveTaskBetweenColumnsResponse = useMutation({
    mutationFn: moveKanbanTask,
    onMutate: async (moveData: MoveTaskData) => {
      // cancel any outgoing requests for source and target columns
      const sourceColumnKey = queryKeys.getKanbanColumnTasks(moveData.projectId, moveData.sourceColumnId);

      const targetColumnKey = queryKeys.getKanbanColumnTasks(moveData.projectId, moveData.targetColumnId);

      await queryClient.cancelQueries({ queryKey: sourceColumnKey });

      await queryClient.cancelQueries({ queryKey: targetColumnKey });

      // get current task data from both columns
      const sourceColumnTasks = queryClient.getQueryData<ColumnTasksResponse>(sourceColumnKey);

      const targetColumnTasks = queryClient.getQueryData<ColumnTasksResponse>(targetColumnKey);

      // find the task to move from the source column
      const taskToMove = sourceColumnTasks?.tasks.find((task) => task.taskId === moveData.taskId);

      // handle (unlikely) case where the task to be moved does not exist in source column
      if (!taskToMove) {
        return { sourceColumnTasks, targetColumnTasks };
      }
      // optimistically update the source column without the dragged task
      const remainingSourceTasks = sourceColumnTasks?.tasks
        .filter((task) => task.taskId !== moveData.taskId)
        .map((task, idx) => ({
          ...task,
          taskIndex: idx,
        }));

      // Update the cache with the filtered tasks
      queryClient.setQueryData(sourceColumnKey, {
        tasks: remainingSourceTasks || [],
      });

      //? calculate new indexes for target column tasks
      // create a copy of the target column tasks
      const updatedTargetTasks = [...(targetColumnTasks?.tasks || [])];

      const targetIndex = moveData.taskIndex;

      // create a optimisitc task object to display on the target column
      const optimisticTargetTask = {
        ...taskToMove,
        columnId: moveData.targetColumnId,
        taskIndex: targetIndex,
      };

      if (targetIndex === 0) {
        // insert at the beginning
        updatedTargetTasks.unshift(optimisticTargetTask);
      } else if (targetIndex >= updatedTargetTasks.length) {
        // insert at the end
        updatedTargetTasks.push(optimisticTargetTask);
      } else {
        // insert at a specific index in the middle of the array
        updatedTargetTasks.splice(targetIndex, 0, optimisticTargetTask);
      }
      //! update taskIndex properties for all the task objects
      const updatedTargetTasksWithIndexProps = updatedTargetTasks.map((task, index) => {
        return { ...task, taskIndex: index };
      });

      // optimistically update the target column with the updated task
      queryClient.setQueryData(targetColumnKey, { tasks: updatedTargetTasksWithIndexProps });

      // return previous column data for rollback
      return { sourceColumnTasks, targetColumnTasks };
    },
    onError: (error, moveData, context) => {
      // reset the tasks on the source and target columns to previous tasks
      if (context?.sourceColumnTasks && context?.targetColumnTasks) {
        queryClient.setQueryData(queryKeys.getKanbanColumnTasks(moveData.projectId, moveData.sourceColumnId), {
          tasks: context.sourceColumnTasks.tasks,
        });

        queryClient.setQueryData(queryKeys.getKanbanColumnTasks(moveData.projectId, moveData.targetColumnId), {
          tasks: context.targetColumnTasks.tasks,
        });
      }
      let title = 'Error';
      let errorMessage = 'Failed to move task';

      if (error instanceof CustomError) {
        title = error.title || 'Failed to move task';
        errorMessage = error.message;
      }
      toast.error(title, { description: errorMessage });
    },
    onSettled: (_, __, moveData) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getKanbanColumnTasks(moveData.projectId, moveData.sourceColumnId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getKanbanColumnTasks(moveData.projectId, moveData.targetColumnId),
      });
    },
  });

  return { moveTaskBetweenColumnsResponse };
};
