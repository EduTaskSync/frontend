import { ListPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { KanbanColumn } from './KanbanColumn';

export type Id = string | number;

export interface Column {
  id: Id;
  title: string;
}

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);

  const handleAddColumn = () => {
    const columnToAdd: Column = { id: nanoid(), title: `Column ${columns.length + 1}` };
    setColumns([...columns, columnToAdd]);
    console.log(columns);
  };

  const handleDeleteCol = () => {};
  return (
    <ScrollArea>
      <div className="flex">
        <Button className="font-heading cursor-pointer" onClick={handleAddColumn}>
          <ListPlus />
          Add Column
        </Button>
      </div>

      <div className="flex mt-8 gap-x-10">
        {columns.map((col) => {
          return <KanbanColumn column={col} colType="default" deleteCol={handleDeleteCol} />;
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
