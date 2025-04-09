import { ListPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { KanbanColumn } from './KanbanColumn';
import { useKanban } from '@/hooks/projects/kanban/useKanban';
import { useLoaderData } from 'react-router';
import { GetKanbanColumnsResponse } from '@/hooks/projects/kanban/kanbanInterfaces';
import { AddKanbanColumnDialog } from './AddKanbanColumnDialog';

interface KanbanBoardProps {
  projectId: string;
}

export const KanbanBoard = ({ projectId }: KanbanBoardProps) => {
  const initialData = useLoaderData<GetKanbanColumnsResponse>();

  const { getKanbanColumnsResponse, deleteKanbanColumnResponse, createColumnResponse } = useKanban(projectId);

  // data is available immediately upon mount due to pre-cache by the kanban loader
  //? provide initalData as default value so no need for loading states. This design pattern is called 'render-as-you-fetch'. Without the default value, the component would initially render with undefined data until the data is fetched; requiring loading state logic for smooth UX. The loader function already pre-loads the data before this component mounts, so we can set the data to the returned value to avoid redundant conditional logic inside this component
  const { data = initialData } = getKanbanColumnsResponse;

  const handleAddColumn = (columnName: string) => {
    createColumnResponse.mutate(columnName);
  };

  const handleDeleteCol = (columnId: string) => {
    deleteKanbanColumnResponse.mutate(columnId);
  };
  return (
    <ScrollArea>
      <div className="flex">
        <AddKanbanColumnDialog
          trigger={
            <Button className="font-heading cursor-pointer">
              <ListPlus />
              Add Column
            </Button>
          }
          onAddColumn={handleAddColumn}
          isSubmitting={createColumnResponse.isPending}
        />
      </div>

      <div className="flex mt-8 gap-x-10">
        {data.columns.map((col) => {
          return <KanbanColumn key={col.columnId} column={col} onDeleteCol={handleDeleteCol} />;
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
