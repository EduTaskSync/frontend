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
import { useEffect, useState } from 'react';
import { UpdatedColumnData } from '@/hooks/projects/kanban/kanbanInterfaces';

const kanbanColumnFormSchema = z.object({
  columnName: z
    .string()
    .min(1, 'Column name is required')
    .max(15, 'Keep the column name short')
    .refine((colName) => !['To Do', 'In Progress', 'Done'].includes(colName.trim()), {
      message: 'Column name must be unique and not a default column name',
    }),
});

type FormValues = z.infer<typeof kanbanColumnFormSchema>;

interface KanbanColumnDetailsDialogProps {
  trigger: React.ReactNode;
  submitHandler: (data: string | UpdatedColumnData) => void;
  prefillColData?: UpdatedColumnData;
  isSubmitting: boolean;
}

export const KanbanColumnDetailsDialog = ({
  trigger,
  submitHandler,
  isSubmitting,
  prefillColData,
}: KanbanColumnDetailsDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(kanbanColumnFormSchema),
    defaultValues: {
      columnName: prefillColData?.columnName ?? '',
    },
  });

  // update the columnName default value when column name changes
  useEffect(() => {
    if (prefillColData) {
      // reset the form with the new values when prefillColData chaanges
      form.reset({
        columnName: prefillColData.columnName,
      });
    }
  }, [prefillColData, form]);

  function onSubmit(data: FormValues) {
    setOpen(false);
    if (prefillColData) {
      submitHandler({ ...prefillColData, columnName: data.columnName });
    } else {
      submitHandler(data.columnName);
    }

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
            <DialogTitle className="text-xl font-heading mb-1">
              {prefillColData ? (
                <>
                  Edit <span className="text-emerald-300">{prefillColData.columnName}</span> Column
                </>
              ) : (
                <>
                  Create <span className="text-emerald-300">New Column</span>
                </>
              )}
            </DialogTitle>
          </DialogTitle>
          <DialogDescription>
            {prefillColData
              ? 'Enter a new column name.'
              : `Add a custom column to your Kanban board to organize tasks.`}
          </DialogDescription>
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
                loadingText={prefillColData ? 'Editing...' : 'Creating...'}
                defaultText={prefillColData ? 'Edit Column' : 'Create Column'}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
