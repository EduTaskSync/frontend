import { useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { CountdownTimer } from '../CountdownTimer';
import { Task } from '@/hooks/projects/kanban/kanbanInterfaces';

interface DeleteKanbanTaskDialogProps {
  onDeleteTask: (taskId: string) => void;
  task: Task;
  isSubmitting: boolean;
  trigger?: React.ReactNode;
}

export const DeleteKanbanTaskDialog = ({ trigger, onDeleteTask, task, isSubmitting }: DeleteKanbanTaskDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const confirmDelete = () => {
    setIsOpen(false);

    // Cancel any existing timeout first
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
    }

    // Create a timeout that will execute the delete after the toast duration
    const timeoutId = setTimeout(() => {
      onDeleteTask(task.taskId);
      deleteTimeoutRef.current = null;
    }, 4000); // Match sonner's default 4 second duration

    // Store the timeout ID in the ref
    deleteTimeoutRef.current = timeoutId;

    // Show toast with undo button
    toast.warning(`Deleting "${task.taskName}"`, {
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
            toast.info(`Deletion of "${task.taskName}" canceled`);
          }
        },
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className="max-w-md shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-xl">
            <span className="text-destructive">Delete</span> Task
          </AlertDialogTitle>

          <div className="text-base mb-3">
            Are you sure you want to delete <span className="font-semibold text-foreground">"{task.taskName}"</span>?
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-md">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-destructive">•</span>
                  <span>This task will be permanently removed</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-destructive">•</span>
                  <span>You can undo this action for a few seconds after confirmation</span>
                </div>
              </div>
            </div>
          </div>

          <AlertDialogDescription className="sr-only">Delete task confirmation dialog</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 space-x-3">
          <AlertDialogCancel className="hover:bg-background/80 transition-colors">Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={confirmDelete}
            disabled={isSubmitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer shadow transition-all duration-200 hover:shadow-md"
          >
            Delete Task
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
