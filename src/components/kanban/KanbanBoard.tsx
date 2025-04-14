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
  tasks: TaskData[];
}

// Task data
export interface TaskData {
  taskName: string;
  //projectId: string;
  //columnId: Id;
  taskDeadline: Date | null;
  //projectName: string;
}

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);

  const handleAddColumn = () => {
    const columnToAdd: Column = { id: nanoid(), title: `Column ${columns.length + 1}`, tasks: [] };
    setColumns([...columns, columnToAdd]);
    console.log(columns);
  };

  // delete a column
  const handleDeleteCol = (colId: Id) => {
    setColumns((prev) => prev.filter((col) => col.id !== colId));
  };
  
  // reorder columns
  const handleReorderCol = (from: number, to: number) => {
    if (from === to) return;

    const updatedColumns = [...columns];
    const [moved] = updatedColumns.splice(from, 1);
    updatedColumns.splice(to, 0, moved);

    setColumns(updatedColumns);
  }

  // update columns
  const handleUpdateCol = () => {
    const updatedColumns = [...columns];
    setColumns(updatedColumns);
  }

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
          return <KanbanColumn column={col} colType="default" deleteCol={() => handleDeleteCol(col.id)} />;
        })}
      </div>


      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
