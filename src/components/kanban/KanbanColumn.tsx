import { Column, TaskData } from './KanbanBoard';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ClipboardPlus, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Id } from './KanbanBoard';
import { AddTaskDialog } from './AddTaskDialog';
import { useState } from 'react';


interface KanbanColumnProps {
  column: Column;
  colType: string;
  deleteCol: (colId: Id) => void;
}

const getColumnStyle = (colType: string) => {
  switch (colType) {
    case 'todo':
      return {
        headerClass: 'bg-blue-500/10 border-b-blue-500/20 text-blue-500',
        borderClass: 'border-t-blue-500/30',
        gradientClass: 'from-blue-500/5 to-transparent',
      };
    case 'in-progress':
      return {
        headerClass: 'bg-amber-500/10 border-b-amber-500/20 text-amber-500',
        borderClass: 'border-t-amber-500/30',
        gradientClass: 'from-amber-500/5 to-transparent',
      };
    case 'done':
      return {
        headerClass: 'bg-emerald-500/10 border-b-emerald-500/20 text-emerald-500',
        borderClass: 'border-t-emerald-500/30',
        gradientClass: 'from-emerald-500/5 to-transparent',
      };
    case 'blocked':
      return {
        headerClass: 'bg-destructive/10 border-b-destructive/20 text-destructive',
        borderClass: 'border-t-destructive/30',
        gradientClass: 'from-destructive/5 to-transparent',
      };
    default:
      return {
        headerClass: 'bg-primary/10 border-b-primary/20 text-primary',
        borderClass: 'border-t-primary/30',
        gradientClass: 'from-primary/5 to-transparent',
      };
  }
};

export const KanbanColumn = ({ column, colType, deleteCol }: KanbanColumnProps) => {
  
  const { borderClass, gradientClass, headerClass } = getColumnStyle(colType);
  const [localColumn, setLocalColumn] = useState<Column>(column);

  const handleAddTask = (task: TaskData) => {
    
    setLocalColumn((prev) => ({
      ...prev,
      tasks: [...prev.tasks, task],
    }));
    console.log(task);
  };

  return (
    <Card className="flex flex-col h-[500px] w-[300px] border border-border shadow-sm overflow-hidden rounded-xl bg-card ">
      <CardHeader className={cn(headerClass, 'p-3 mx-5 border rounded-xl flex flex-row items-center justify-between')}>
        <Badge variant="destructive" className="font-heading text-sm">
          {' '}
          4
        </Badge>
        <CardTitle className=" font-heading text-xl">{column.title}</CardTitle>
        <Trash2 color="white" onClick={() => deleteCol(column.id)} />
      </CardHeader>

      <CardContent>
        <p>Card Content</p>
      </CardContent>

      <CardFooter
        className={cn(
          borderClass,
          gradientClass,
          'flex flex-col items-center border-t bg-gradient-to-b p-4 gap-4'
        )}
      >
        <AddTaskDialog columnId={column.id} onAddTask={handleAddTask} />

        <div className="w-full space-y-2">
            {localColumn.tasks.map((task, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded">
                <p className="font-semibold">{task.taskName}</p>
                {task.taskDeadline && (
                  <p className="text-sm text-gray-400">
                      Deadline: {new Date(task.taskDeadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
        </div>
      </CardFooter>
    </Card>
  );
};
