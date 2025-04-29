import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CustomError } from '@/utils/ErrorClasses';
import { getColumnsSummary, createColumn, deleteColumn } from '@/hooks/columns/columnQueryUtils.ts';
import { CreateColumnDto, ColumnSummaryListResponse, ColumnSummaryResponse } from './columnInterfaces';

// Define query keys for columns
export const columnQueryKeys = {
  all: ['columns'] as const,
  lists: () => [...columnQueryKeys.all, 'list'] as const,
  columnProjects: (projectId: string) => [...columnQueryKeys.lists(), { projectId }] as const,
  details: () => [...columnQueryKeys.all, 'detail'] as const,
};

// Main hook for columns
export const useColumns = (columnName?: string) => {
  const queryClient = useQueryClient();

  // Fetch columns for a specific project
  const fetchColumnsSummaryResponse = useQuery({
    queryKey: columnQueryKeys.columnProjects(columnName as string),
    queryFn: () => {
      //if (!projectId) {
      //  throw new Error('Project ID is required to fetch columns');
      //}
      return getColumnsSummary();
    },
    // Setting cache management
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!columnName, // Only run if projectId exists
  });

  // Create new column with optimistic updates
  const createColumnResponse = useMutation({
    // Updated to match your API function signature that takes separate params
    mutationFn: (columnData: CreateColumnDto) => {
      //if (!projectId) {
      //  throw new Error('Project ID is required to create a column');
      //}
      return createColumn(columnData);
    },

    // Optimistic update handling
    onMutate: async (newColumn) => {
      if (!columnName) {
        throw new Error('Column name is required to create a column');
      }

      const queryKey = columnQueryKeys.columnProjects(columnName);

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousColumns = queryClient.getQueryData<ColumnSummaryListResponse>(queryKey);

      // Create optimistic Column with properties matching your ColumnSummary interface
      const optimisticColumn: ColumnSummaryResponse = {
        
        columnName: newColumn.columnName,
        columnIndex: newColumn.columnIndex,
        projectId: columnQueryKeys.columnProjects.arguments,
        columnId: `temp-${Date.now()}`,
        
      };

      // Update cache with optimistic data - make sure we're using ColumnSummaryListResponse
      queryClient.setQueryData<ColumnSummaryListResponse>(queryKey, (oldData) => {
        if (!oldData) {
          return { columns: [optimisticColumn] };
        }
        return {
          columns: [...oldData.columns, optimisticColumn],
        };
      });

      return { previousColumns };
    },

    // Error handling
    onError: (err, _, context) => {
      if (context?.previousColumns && columnName) {
        queryClient.setQueryData(columnQueryKeys.columnProjects(columnName), context.previousColumns);
      }

      console.error('Failed to create column:', err);

      let errorMessage = 'Please try again later.';
      let title = 'Error';

      if (err instanceof CustomError) {
        errorMessage = err.message;
        title = err.title || 'Failed to create column';
      }

      toast.error(title, {
        description: errorMessage,
      });
    },

    // Success handling - add column to cache if needed
    onSuccess: (data:CreateColumnDto) => {
      // Check if we need to update the cache directly instead of just invalidating
      if (columnName) {
        queryClient.setQueryData<ColumnSummaryListResponse>(columnQueryKeys.columnProjects(columnName), (oldData) => {
          // If we don't have cached data, don't try to update it
          if (!oldData) return oldData;

          // Remove the optimistic entry and add the real one
          const filteredColumns = oldData.columns.filter(
            (column) => !column.projectId.toString().startsWith('temp-')
          );

          // Create a properly formatted column from the API response
          const newColumn: ColumnSummaryResponse = {
            
            columnName: data.columnName,
            columnIndex: data.columnIndex,
            projectId: `temp-${Date.now()}`,
            columnId: `temp-${Date.now()}`,
            
          };

          return {
            ...oldData,
            columns: [...filteredColumns, newColumn],
          };
        });
      }

      toast.success('Column created successfully', {
        description: `"${data.columnName}" has been created.`,
      });
    },

    // Refetch if needed for consistency
    onSettled: () => {
      if (columnName) {
        queryClient.invalidateQueries({
          queryKey: columnQueryKeys.columnProjects(columnName),
        });
      }
    },
  });

  const deleteColumnResponse = useMutation({
    mutationFn: (columnName: string) => {
      return deleteColumn(columnName);
    },

    // Optimistic update handling
    onMutate: async (columnName) => {
      if (!columnName) {
        throw new Error('Column name is required to delete a column');
      }

      const queryKey = columnQueryKeys.columnProjects(columnName);

      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous data
      const previousColumns = queryClient.getQueryData<ColumnSummaryListResponse>(queryKey);

      // Store the column being deleted for display in toast
      const columnToDelete = previousColumns?.columns.find((column) => column.columnName === columnName);

      // Optimistically remove the task from cache
      queryClient.setQueryData<ColumnSummaryListResponse>(queryKey, (oldData) => {
        if (!oldData) return { columns: [] };

        return {
          ...oldData,
          columns: oldData.columns.filter((column) => column.columnName !== columnName),
        };
      });

      return { previousColumns, columnToDelete };
    },

    // Error handling
    onError: (err, _projectId, context) => {
      // Restore previous data on error
      if (context?.previousColumns && columnName) {
        queryClient.setQueryData(columnQueryKeys.columnProjects(columnName), context.previousColumns);
      }

      console.error('Failed to delete column:', err);

      let errorMessage = 'Please try again later.';
      let title = 'Delete Failed';

      if (err instanceof CustomError) {
        errorMessage = err.message;
        title = err.title || 'Failed to delete column';
      }

      toast.error(title, {
        description: errorMessage,
      });
    },

    // Success handling
    onSuccess: (_, _projectId, context) => {
      const columnName = context?.columnToDelete?.columnName || 'Column';

      toast.success('Column deleted', {
        description: `"${columnName}" has been removed.`,
      });
    },

    // Always refetch after operation to ensure consistency
    onSettled: () => {
      if (columnName) {
        queryClient.invalidateQueries({
          queryKey: columnQueryKeys.columnProjects(columnName),
        });
      }
    },
  });

  return {
    fetchColumnsSummaryResponse,
    createColumnResponse,
    deleteColumnResponse
  };
};
