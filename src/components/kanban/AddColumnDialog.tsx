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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Id, Column} from './KanbanBoard';
import { CreateColumnSchema } from '@/hooks/columns/columnInterfaces.ts';
import { nanoid } from 'nanoid';

// Column data for POST request
export interface ColumnPostData {
  columnName: string;
  columnIndex: number;
  projectId: string;
  columnId: Id;
}

interface AddColumnDialogProps {
  trigger: React.ReactNode;
  onSubmit: (values: z.infer<typeof CreateColumnSchema>) => void;
  projectId: Id;
  isLoading?: boolean;
}


export const AddColumnDialog = ({trigger, onSubmit, isLoading = false,
}: AddColumnDialogProps) => 
{
  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState<Column[]>([]);

  //const [taskDeadline, setTaskDeadline] = useState<Date | null>(null);
  //const [calendarOpen, setCalendarOpen] = useState(false);

  // initialize form with react-hook-form
  const form = useForm<z.infer<typeof CreateColumnSchema>>({
      resolver: zodResolver(CreateColumnSchema),
      defaultValues: {
        columnName: '',
        columnIndex: 0,
      },
      
  });

  

  // Handle form submission
  const handleFormSubmit = (values: z.infer<typeof CreateColumnSchema>) => {
    
    onSubmit(values);
    setOpen(false);
    form.reset({
      columnName: '',
      columnIndex: 0,
    });
  };

  const handleAddColumn = (values: z.infer<typeof CreateColumnSchema>) => {
      const columnToAdd: Column = { id: nanoid(), title: `Column ${columns.length + 1}`, tasks: [] };
      setColumns([...columns, columnToAdd]);
      console.log(columns);
    };

  return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            form.reset({
              columnName: '',
              columnIndex: 0,
            });
          }
          setOpen(isOpen);
        }}
      >
        
        <DialogTrigger asChild>{trigger}</DialogTrigger>  
        <DialogContent className="sm:max-w-[500px] p-6 font-sans">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading mb-1">
              Create <span className="text-emerald-300">New Column</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
                { 'Add a new column to this project.' }
            </DialogDescription>
          </DialogHeader>

          {/* Form for adding column */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4 font-sans">
              {/* column name field - unchanged */}
              <FormField
                control={form.control}
                name="columnName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="font-heading font-semibold">Column</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-[9px] text-gray-400">
                          <FolderKanban className="h-5 w-5" />
                        </div>
                        <Input
                          placeholder="Todo"
                          className="pl-10"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Enter a descriptive for your column.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          
              {/* column Index field -unchanged */}
              <FormField
                control={form.control}
                name="columnIndex"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="font-heading font-semibold">Column Index</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-[9px] text-gray-400">
                          <FolderKanban className="h-5 w-5" />
                        </div>
                        <Input
                          placeholder="0"
                          className="pl-10"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Set an index for your column (optional).</FormDescription>
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
                  defaultText="Create column"
                  //disabled={!isLoading}
                  tooltipText={ 'Create new column'}
                  tooltipSide="top"
                  onClick={() => handleAddColumn(form.getValues())}
                />
              </DialogFooter>
            </form>
          </Form>

        </DialogContent>
      </Dialog>
  )
}