import { queryKeys } from '@/utils/queryKeyFactory';
import { createKanbanColumn, getKanbanColumns } from './kanbanQueryUtils';
import { queryClient } from '@/main';
import { LoaderFunctionArgs } from 'react-router';

export const KanbanColumnsLoader = async ({ params }: LoaderFunctionArgs) => {
  // get projectId from params
  const { projectId } = params;

  // projectID parameter missing in the URL - throw error to trigger router's error boundary
  if (!projectId) {
    throw new Response('Project ID is required to view the Kanban board', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  try {
    const existingColumnData = await getKanbanColumns(projectId);

    if (existingColumnData.columns?.length > 0) {
      queryClient.setQueryData(queryKeys.getKanbanColumns(projectId), existingColumnData);
      return existingColumnData;
    }

    // no columns exist, so create three default columns
    await createKanbanColumn({ columnName: 'To Do', projectId });
    await createKanbanColumn({ columnName: 'In Progress', projectId });
    await createKanbanColumn({ columnName: 'Done', projectId });

    const newColumns = await getKanbanColumns(projectId);
    queryClient.setQueryData(queryKeys.getKanbanColumns(projectId), newColumns);

    return newColumns;
  } catch (error) {
    console.error('Error in kanban loader:', error);
    //! this error will be handled in the Kanban Board component
    return { columns: [] };
  }
};
