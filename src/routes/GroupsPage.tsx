import { AuthHeader } from '@/components/AuthHeader';
import { GroupGrid } from '@/components/GroupGrid';
import { MainContent } from '@/components/MainContent';
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
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// zod schema for add new group form
const formSchema = z.object({
  groupName: z.string().min(1, 'Group name is required'),
  groupImage: z.instanceof(File).optional(),
});

// type for form values
type FormValues = z.infer<typeof formSchema>;

const GroupsPage = () => {
  // state to handle opening and closing of dialog
  const [open, setOpen] = useState(false);

  // initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: '',
    },
  });

  const handleGroupCreation = (values: FormValues) => {
    console.log('Creating group: ', values);
    // close the dialog
    setOpen(false);
    // react-hook-form reset() sets field values to defaults, removes validation errors and clears form submit state
    form.reset();

    //todo data fetching to backend
  };

  return (
    <>
      <AuthHeader tabName="Groups" />
      <MainContent>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl text-purple-400 font-heading font-extrabold">My Groups</h1>
          {/* using controlled variant */}
          <Dialog
            open={open}
            onOpenChange={(isOpen) => {
              // resetting form for the scenario where user doesn't submit and closes dialog instead
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
                <DialogDescription>
                  Create a group to organize projects and collaborate with team members.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleGroupCreation)} className="space-y-6 py-4 font-sans">
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
                    <Button type="submit" className="font-semibold" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? (
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
        </div>
        <GroupGrid />
      </MainContent>
    </>
  );
};

export default GroupsPage;
