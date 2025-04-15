import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NewTaskData, UpdatedTaskData } from '@/hooks/projects/kanban/kanbanInterfaces';
import { useParams } from 'react-router';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { LoadingButton } from '../LoadingButton';
import { useState, useEffect } from 'react';

interface KanbanTaskDetailsDialogProps {
  columnId: string;
  trigger: React.ReactNode;
  onSubmitHandler: (data: NewTaskData | UpdatedTaskData) => void;
  prefillData?: NewTaskData | UpdatedTaskData;
  isSubmitting: boolean;
  taskIndex: number;
}

const taskDetailsFormSchema = z.object({
  // empty string validation
  taskName: z.string().min(1, 'Task name is required.').max(100, 'Keep the task description under 100 characters'),
  // undefined/null value validation
  taskDeadline: z.date({ required_error: 'Task deadline is required.' }),
});

export const KanbanTaskDetailsDialog = ({
  columnId,
  trigger,
  onSubmitHandler,
  isSubmitting,
  prefillData,
  taskIndex,
}: KanbanTaskDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { projectId } = useParams();

  type FormValues = z.infer<typeof taskDetailsFormSchema>;

  //? utility function to prefill deadline date duing update: convert the date into a ISO string
  const parsePrefillDeadline = (): Date | undefined => {
    if (!prefillData || !prefillData.taskDeadline) {
      return undefined;
    }
    try {
      return new Date(prefillData.taskDeadline);
    } catch (error) {
      console.error('Failed to parse deadline date:', error);
      return undefined;
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(taskDetailsFormSchema),
    defaultValues: {
      taskName: prefillData ? prefillData.taskName : '',
      taskDeadline: parsePrefillDeadline(),
    },
  });

  useEffect(() => {
    if (prefillData) {
      form.reset({
        taskName: prefillData.taskName,
        taskDeadline: new Date(prefillData.taskDeadline),
      });
    }
  }, [form, prefillData]);

  const onSubmit = (data: FormValues) => {
    form.reset();
    setOpen(false);
    if (prefillData && 'taskId' in prefillData) {
      const updatedTaskDetails: UpdatedTaskData = {
        taskId: prefillData.taskId,
        taskName: data.taskName,
        taskDeadline: data.taskDeadline.toISOString(),
      };
      onSubmitHandler(updatedTaskDetails);
    } else {
      const taskDetails: NewTaskData = {
        taskName: data.taskName,
        projectId: projectId!,
        columnId,
        taskDeadline: data.taskDeadline.toISOString(),
        taskIndex,
      };

      onSubmitHandler(taskDetails);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset();
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto p-6 font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading mb-1">
            {prefillData ? (
              <>
                Edit <span className="text-emerald-300">{prefillData.taskName}</span> Task
              </>
            ) : (
              <>
                Create <span className="text-emerald-300">New Task</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {prefillData
              ? 'Update the task description and its deadline.'
              : 'Enter task details. You can assign the task to one or more group members.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 font-sans">
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-heading font-semibold">Task Description</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Enter a clear and concise description of the task" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>Consider breaking up the task if it's complex.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taskDeadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-heading font-semibold">Task Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          // Disable dates before today (past dates)
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Used for progress tracking and deadline notifications.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                className="font-semibold hover:cursor-pointer"
                variant="outline"
                type="button"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <LoadingButton
                isLoading={form.formState.isSubmitting || isSubmitting}
                loadingText={prefillData ? 'Editing...' : 'Creating...'}
                defaultText={prefillData ? 'Edit Task' : 'Create Task'}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
