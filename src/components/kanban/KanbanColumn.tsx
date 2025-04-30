import { Column, ColumnData, TaskData } from './KanbanBoard';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ClipboardPlus, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Id } from './KanbanBoard';
import { TaskCard } from './TaskCard';
import { AddTaskDialog } from './AddTaskDialog';
import { useState, useRef } from 'react';
import { useTasks } from '@/hooks/tasks/useTasks';
import { TaskList } from '@/components/kanban/TaskList';
import { toast } from 'sonner';
import { CountdownTimer } from '../CountdownTimer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { createTaskResponse, deleteTaskResponse } = useTasks();
  // Use useRef to track the timeout for deletion
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCreateTask = (data: TaskData) => {
    //if (!Id) return;

    createTaskResponse.mutate({

      taskName: data.taskName,
      //projectId: data.projectId,
      columnId: localColumn.id.toString(),
      taskDeadline: data.taskDeadline,
      //projectName: data.taskName,
    });
    handleAddTask(data);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to project page
    e.stopPropagation(); // Prevent event bubbling
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    //if (!isAdmin) {
    //  toast.error('You do not have permission to delete this task');
    //  return;
    //}
    setShowDeleteDialog(false);
    deleteCol(column.title)

    // Cancel any existing timeout first
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
    }

    // Create a timeout that will execute the delete after the toast duration
    const timeoutId = setTimeout(() => {
      deleteTaskResponse.mutate(column.title);
      // Clear the reference after executing
      deleteTimeoutRef.current = null;
    }, 4000); // Match sonner's default 4 second duration

    // Store the timeout ID in the ref
    deleteTimeoutRef.current = timeoutId;

    // Show toast with undo button
    toast.warning(`Deleting ${column.title}`, {
      description: (
        <div>
          <p>This task will be deleted in a few seconds</p>
          <CountdownTimer duration={4000} />
        </div>
      ),
      duration: 4000,
      action: {
        label: 'Undo',
        onClick: () => {
          // Clear the timeout if user clicks undo
          if (deleteTimeoutRef.current) {
            clearTimeout(deleteTimeoutRef.current);
            deleteTimeoutRef.current = null;
            toast.info(`Deletion of ${column.title} canceled`);
          }
        },
      },
    });
  };

  const handleAddTask = (task: TaskData) => {
    
    setLocalColumn((prev) => ({
      ...prev,
      tasks: [...prev.tasks, task],
    }));
    console.log(task);
  };

  const handleDeleteTask = (index: number) => {
    setLocalColumn((prev: Column) => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }));
  };

  const handleEditTask = (index: number) => {
    const task = localColumn.tasks[index];
    alert(`EDIT：\nTASK：${task.taskName}\nDEALINE：${task.taskDeadline ? new Date(task.taskDeadline).toLocaleDateString() : ''}`);
    
  };

  return (
    <Card className="flex flex-col h-[500px] w-[300px] border border-border shadow-sm overflow-hidden rounded-xl bg-card ">
      <CardHeader className={cn(headerClass, 'p-3 mx-5 border rounded-xl flex flex-row items-center justify-between')}>
        <Badge variant="destructive" className="font-heading text-sm">
          {' '}
          4
        </Badge>
        <CardTitle className=" font-heading text-xl">{column.title}</CardTitle>
        <Trash2 color="white" onClick={handleDeleteClick} />
        <span className="sr-only">Delete Task</span>
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
        <AddTaskDialog
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="p-2 font-heading justify-start text-muted-foreground hover:text-foreground gap-2"
            >
              <ClipboardPlus className="h-4 w-4" />
                Add Task
            </Button>
          }
            onSubmit={handleCreateTask}
            columnId ={column.id || ''}
            isLoading={false}
        />

        {/* Delete confirmation dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="max-w-md shadow-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-heading text-xl">
                <span className="text-emerald-300">Delete Column</span>
              </AlertDialogTitle>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-destructive/20 to-transparent"></div>
              <AlertDialogDescription className="font-sans text-base">
                <div className="mb-3">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-foreground">"{column.title}"</span>?
                </div>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-md">
                  <div className="flex items-start gap-2 mt-1">
                    <span className="text-destructive mt-0.5">•</span>
                      All tasks and resources will be permanently removed
                  </div>
                  <div className="flex items-start gap-2 mt-1">
                    <span className="text-destructive mt-0.5">•</span>
                      You can undo this action for a few seconds after confirmation
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="font-heading mt-4 space-x-3">
              <AlertDialogCancel className="hover:bg-background/80 transition-colors">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer shadow transition-all duration-200 hover:shadow-md"
              >
                Delete Column
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div>
          <TaskList />
        </div>
      </CardFooter>
    </Card>
  );
};
