import { queryKeys } from '@/utils/queryKeyFactory';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { createKanbanColumn, getKanbanColumns } from './kanbanQueryUtils';
import { GetKanbanColumnsResponse, KanbanColumn } from './kanbanInterfaces';
import { toast } from 'sonner';
import { CustomError } from '@/utils/ErrorClasses';
import { nanoid } from 'nanoid';

export const useKanban = (projectId: string) => {
  const queryClient = useQueryClient();

  const getKanbanColumnsResponse = useQuery({
    queryKey: queryKeys.getKanbanColumns(projectId),
    queryFn: () => getKanbanColumns(projectId),
    // fast refetch to sync with updates from other members
    staleTime: 5000,
    gcTime: 5000,
  });

  const createColumnResponse = useMutation({
    mutationFn: (columnName: string) => createKanbanColumn({ columnName, projectId }),
    onMutate: async (columnName: string) => {
      const targetQueryKey = queryKeys.getKanbanColumns(projectId);

      await queryClient.cancelQueries({ queryKey: targetQueryKey });

      // get previous column data
      const previousColumns = queryClient.getQueryData<GetKanbanColumnsResponse>(targetQueryKey);

      const optimitsticColumn: KanbanColumn = {
        columnId: nanoid(),
        columnName,
        columnIndex: previousColumns?.columns?.length || 0,
      };

      // handle empty columns
      queryClient.setQueryData(targetQueryKey, [...(previousColumns?.columns || []), optimitsticColumn]);

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

  return { createColumnResponse, getKanbanColumnsResponse };
};
