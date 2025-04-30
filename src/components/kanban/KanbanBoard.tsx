import { ListPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { KanbanColumn } from './KanbanColumn';
import { z } from 'zod';
import { useColumns } from '@/hooks/columns/useColumns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateColumnSchema } from '@/hooks/columns/columnInterfaces.ts';

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

// Column data
export interface ColumnData {
  columnName: string;
  columnIndex: number;
  //projectId: string;
  //columnId: string;
  
}

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  
  const { createColumnResponse } = useColumns();

  const handleCreateColumn = (data: ColumnData) => {
      //if (!Id) return;
  
      createColumnResponse.mutate({
  
        columnName: data.columnName,
        columnIndex: data.columnIndex,
        
      });
      
  };

  const handleAddColumn = (data: string) => {
      const columnToAdd: Column = { id: nanoid(), title: data, tasks: [] };
      setColumns([...columns, columnToAdd]);
      console.log(columns);
      handleCreateColumn({
        columnName: data,
        columnIndex: Number(nanoid()),
      });
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
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex font-heading cursor-pointer">
          Add Column
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuItem onClick={() => handleAddColumn("todo")}>
          📝 To Do
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddColumn("in-progress")}>
          🔄 In Progress
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddColumn("done")}>
          ✅ Done
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddColumn("blocked")}>
          ⛔ Blocked
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddColumn("default")}>
          ➕ Other
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

      <div className="flex mt-8 gap-x-10">
        {columns.map((col) => {
          return <KanbanColumn column={col} colType={col.title} deleteCol={() => handleDeleteCol(col.id)} />;
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
