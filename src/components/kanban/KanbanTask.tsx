import { ListPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useState } from 'react';
import { KanbanColumn } from './KanbanColumn';


export interface Task {
  taskName: string;
  taskDeadline: Date | null;
}

export const KanbanTask = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = () => {
    const taskToAdd: Task = { taskName: '', taskDeadline: null };
    setTasks([...tasks, taskToAdd]);
    console.log(tasks);
  };

  const handleDeleteCol = () => {};
  
  return (
    <ScrollArea>
      <div className="flex">
        <Button className="font-heading cursor-pointer" onClick={handleAddTask}>
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
