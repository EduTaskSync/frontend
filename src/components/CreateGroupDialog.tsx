import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

// zod schema for add new group form
const formSchema = z.object({
  groupName: z.string().min(1, 'Group name is required'),
  groupImage: z.instanceof(File).optional(),
});

// type for form values
export type FormValues = z.infer<typeof formSchema>;

interface CreateGroupDialogProps {
  onCreateGroup: (values: FormValues) => void;
  isCreating?: boolean;
}

export const CreateGroupDialog = ({ onCreateGroup, isCreating = false }: CreateGroupDialogProps) => {
  const [open, setOpen] = useState(false);

  // initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    onCreateGroup(values);
    // Don't close the dialog here - let the parent component decide
    // when to close it based on success/failure of the operation
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
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 font-heading">New Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading mb-1">
            Create <span className="text-purple-300">New Group</span>
          </DialogTitle>
          <DialogDescription>Create a group to organize projects and collaborate with team members.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4 font-sans">
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-heading font-semibold">Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name (e.g., FIT2099)" {...field} />
                  </FormControl>
                  <FormDescription>Choose a descriptive name for your group.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="groupImage"
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="font-heading font-semibold">Group Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                      {...fieldProps}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>Choose an image to represent your group.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                className="font-semibold"
                variant="outline"
                type="button"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="font-semibold" disabled={form.formState.isSubmitting || isCreating}>
                {form.formState.isSubmitting || isCreating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Group'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
