import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { LoadingButton } from '@/components/LoadingButton';
import { FolderKanban } from 'lucide-react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CreateProjectSchema } from '@/hooks/projects/projectInterfaces';

interface AddProjectDialogProps {
  trigger: React.ReactNode;
  onSubmit: (values: z.infer<typeof CreateProjectSchema>) => void;
  groupId: string;
  isLoading?: boolean;
}

export const AddProjectDialog = ({ trigger, onSubmit, isLoading = false }: AddProjectDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof CreateProjectSchema>>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      projectName: '',
      deadline: null,
    },
  });

  // Handle form submission
  const handleFormSubmit = (values: z.infer<typeof CreateProjectSchema>) => {
    onSubmit(values);
    setOpen(false);
    form.reset({
      projectName: '',
      deadline: null,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset({
            projectName: '',
            deadline: null,
          });
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-6 font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading mb-1">
            Create <span className="text-emerald-300">New Project</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">Add a new project to this group.</DialogDescription>
        </DialogHeader>

        {/* Form for adding projects */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4 font-sans">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="font-heading font-semibold">Project Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-3 top-[9px] text-gray-400">
                        <FolderKanban className="h-5 w-5" />
                      </div>
                      <Input placeholder="FIT3162 Final Project" className="pl-10" {...field} disabled={isLoading} />
                    </div>
                  </FormControl>
                  <FormDescription>Enter a descriptive name for your project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
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
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="flex flex-col">
                            <div className="p-2 border-b flex justify-between items-center">
                              <span className="text-sm font-medium">Select date</span>
                              {field.value && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 py-0 text-xs"
                                  onClick={() => field.onChange(null)}
                                >
                                  Clear
                                </Button>
                              )}
                            </div>
                            <Calendar
                              mode="single"
                              selected={field.value || undefined} // Convert null to undefined for the calendar
                              onSelect={(date) => field.onChange(date || null)} // Convert undefined to null when selecting
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormDescription>Set a deadline for your project (optional).</FormDescription>
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
                defaultText="Create Project"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
