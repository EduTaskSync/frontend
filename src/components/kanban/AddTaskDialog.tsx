// UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LoadingButton } from '@/components/LoadingButton';
import { FolderKanban } from 'lucide-react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Id, TaskData } from './KanbanBoard';
import { CreateTaskSchema } from '@/hooks/tasks/taskInterfaces.ts';

// task data for POST request
export interface TaskPostData {
  taskName: string;
  projectId: Id;
  columnId: Id;
  taskDeadline: Date | null;
}

interface AddTaskDialogProps {
  trigger: React.ReactNode;
  onSubmit: (values: z.infer<typeof CreateTaskSchema>) => void;
  columnId: Id;
  isLoading?: boolean;
}

//interface AddTaskDialogProps {
//  columnId: Id;
//  onAddTask?: (task: TaskData) => void;
//}

export const AddTaskDialog = ({trigger, onSubmit, isLoading = false,
}: AddTaskDialogProps) => 
{
  const [open, setOpen] = useState(false);

  //const [taskDeadline, setTaskDeadline] = useState<Date | null>(null);
  //const [calendarOpen, setCalendarOpen] = useState(false);

  // initialize form with react-hook-form
  const form = useForm<z.infer<typeof CreateTaskSchema>>({
      resolver: zodResolver(CreateTaskSchema),
      defaultValues: {
        taskName: '',
        taskDeadline: null,
      },
  });

  

  // Handle form submission
  const handleFormSubmit = (values: z.infer<typeof CreateTaskSchema>) => {
    
    onSubmit(values);
    setOpen(false);
    form.reset({
        taskName: '',
        taskDeadline: null,
    });
  };

  return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            form.reset({
              taskName: '',
              taskDeadline: null,
            });
          }
          setOpen(isOpen);
        }}
      >
        
        <DialogTrigger asChild>{trigger}</DialogTrigger>  
        <DialogContent className="sm:max-w-[500px] p-6 font-sans">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading mb-1">
              Create <span className="text-emerald-300">New Task</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
                { 'Add a new task to this project.' }
            </DialogDescription>
          </DialogHeader>

          {/* Form for adding task */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4 font-sans">
              {/* task name field - unchanged */}
              <FormField
                control={form.control}
                name="taskName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="font-heading font-semibold">Task</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-[9px] text-gray-400">
                          <FolderKanban className="h-5 w-5" />
                        </div>
                        <Input
                          placeholder="FIT3162 Task"
                          className="pl-10"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Enter a descriptive for your task.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          
              {/* Deadline field - add disabled to calendar button */}
              <FormField
                control={form.control}
                name="taskDeadline"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="font-heading font-semibold">Deadline</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-10 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                              disabled={isLoading}
                            >
                              <div className="absolute left-3 top-[9px] text-gray-400">
                                <CalendarIcon className="h-5 w-5" />
                              </div>
                              {field.value ? format(field.value, 'PPP') : <span>Select deadline date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent 
                            className="flex justify-center items-center p-4" 
                            align="center" side="top" sideOffset={-100} portal={false}>
                            <Calendar
                              mode="single"
                              selected={field.value || undefined} // Convert null to undefined for the calendar
                              onSelect={(date) => {
                                field.onChange(date || null);
                                field.onBlur();
                              }} // Convert undefined to null when selecting
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </FormControl>
                    <FormDescription>Set a deadline for your task (optional).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
           
              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                  className="font-semibold hover:cursor-pointer"
                >
                  Cancel
                </Button>
                <LoadingButton
                  isLoading={isLoading || form.formState.isSubmitting}
                  loadingText="Creating..."
                  defaultText="Create task"
                  //disabled={!isLoading}
                  tooltipText={ 'Create new task'}
                  tooltipSide="top"
                  onClick={() => setOpen(false)}
                />
              </DialogFooter>
            </form>
          </Form>

        </DialogContent>
      </Dialog>
  )
}