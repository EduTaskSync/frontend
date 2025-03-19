import { AuthHeader } from '@/components/AuthHeader';
import { ProjectGrid } from '@/components/ProjectGrid';
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

// zod schema for add new project form
const formSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  projectImage: z.instanceof(File).optional(),
  projectSubmissionDate: z.string().min(1, 'Project submission date is required'),
});

// type for form values
type FormValues = z.infer<typeof formSchema>;

const ProjectsPage = () => {
  // state to handle opening and closing of dialog
  const [open, setOpen] = useState(false);

  // initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      projectSubmissionDate: '',
    },
  });

  const handleProjectCreation = (values: FormValues) => {
    console.log('Creating project: ', values);
    // close the dialog
    setOpen(false);
    // react-hook-form reset() sets field values to defaults, removes validation errors and clears form submit state
    form.reset();
  };
  // flex items-center justify-between mb-6    flex flex-col items-center space-y-2
  return (
    <>
    <AuthHeader tabName="Group Projects" />
      <MainContent>
          <div className="flex items-center justify-between mb-6"> 
            <h1 className="text-2xl sm:text-3xl text-purple-400 font-heading font-extrabold">
              <span className="">Group Projects</span> <br />
              <span className="text-white">FIT4321 Group 1</span>
            </h1>
          
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
              <Button className="bg-primary hover:bg-primary/90 font-heading">New Project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] font-sans">
              <DialogHeader>
                <DialogTitle className="text-xl font-heading mb-1">
                  Create <span className="text-purple-300">New Project</span>
                </DialogTitle>
                <DialogDescription>
                  Create a project to check details and collaborate with team members.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleProjectCreation)} className="space-y-6 py-4 font-sans">
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-heading font-semibold">Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project name (e.g., Assignment 1)" {...field} />
                        </FormControl>
                        <FormDescription>Choose a descriptive name for your project.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectSubmissionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-heading font-semibold">Project Submission Date</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project submission date (e.g., DD/MM/YY)" {...field} />
                        </FormControl>
                        <FormDescription>manage a deadline for your project.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectImage"
                    render={({ field: { onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="font-heading font-semibold">Project Image</FormLabel>
                        <FormControl>
                          <Input
                            className="cursor-pointer"
                            type="file"
                            accept="image/*"
                            {...fieldProps}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>Choose an image to represent your project.</FormDescription>
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
                        'Create Project'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <ProjectGrid />
      </MainContent>
    </>
  );
};

export default ProjectsPage;