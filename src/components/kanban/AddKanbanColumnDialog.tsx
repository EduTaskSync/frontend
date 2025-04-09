import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '../LoadingButton';
import { useState } from 'react';

const addKanbanColumnFormSchema = z.object({
  columnName: z
    .string()
    .min(1, 'Column name is required')
    .refine((colName) => !['To Do', 'In Progress', 'Done'].includes(colName.trim()), {
      message: 'Column name must be unique and not a default column name',
    }),
});

type FormValues = z.infer<typeof addKanbanColumnFormSchema>;

interface AddKanbanColumnDialogProps {
  trigger: React.ReactNode;
  onAddColumn: (columnName: string) => void;
  isSubmitting: boolean;
}

export const AddKanbanColumnDialog = ({ trigger, onAddColumn, isSubmitting }: AddKanbanColumnDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(addKanbanColumnFormSchema),
    defaultValues: {
      columnName: '',
    },
  });

  function onSubmit(data: FormValues) {
    setOpen(false);
    onAddColumn(data.columnName);
    form.reset();
  }

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
            Create <span className="text-emerald-300">New Column</span>
          </DialogTitle>
          <DialogDescription>Add a custom column to your Kanban board to organize tasks.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 font-sans">
            <FormField
              control={form.control}
              name="columnName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-heading font-semibold">Column Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Enter column name..." className="pl-3" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>Default column names (To Do, In Progress, Done) are not allowed.</FormDescription>
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
                loadingText="Creating..."
                defaultText="Create Column"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
