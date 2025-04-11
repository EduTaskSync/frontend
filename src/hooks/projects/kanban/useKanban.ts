import { queryKeys } from '@/utils/queryKeyFactory';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createKanbanColumn,
  deleteKanbanColumn,
  getKanbanColumns,
  reorderKanbanColumns,
  updateKanbanColumn,
} from './kanbanQueryUtils';
import { GetKanbanColumnsResponse, KanbanColumn, UpdatedColumnData } from './kanbanInterfaces';
import { toast } from 'sonner';
import { CustomError } from '@/utils/ErrorClasses';
import { nanoid } from 'nanoid';
import { queryClient } from '@/main';

export const useKanban = (projectId: string) => {
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.getKanbanColumns(projectId) });
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
