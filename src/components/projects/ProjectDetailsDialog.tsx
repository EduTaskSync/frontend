import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { projectFormSchema, projectFormValues } from '@/utils/projectSchema';
import { defaultGroupIcons } from '@/constants/general';

// UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Local components
import { ImagePreview } from '@/components/groups/ImagePreview';
import { LoadingButton } from '@/components/LoadingButton';
import { useCustomUrlValidation } from '@/hooks/projects/useCustomUrlValidation';
import { BasicProjectInfoFields } from '@/components/projects/BasicProjectInfoFields';
import { DefaultProjectImagesTab } from '@/components/projects/DefaultProjectImagesTab';
import { UpdatedProject } from '@/hooks/projects/projectInterfaces';

// obj shape of response data for POST request
export interface ProjectData {
  projectName: string;
  projectDetails: string;
  imgUrl: string;
  projectId?: string; // Optional projectId for updates
}

interface ProjectDetailsDialogProps {
  onSubmit: (formattedData: ProjectData | UpdatedProject) => void;
  isUpdating?: boolean;
  projectId?: string;
  prefillData?: UpdatedProject;
  trigger?: React.ReactNode;
}

export const ProjectDetailsDialog = ({
  onSubmit,
  isUpdating = false,
  projectId,
  prefillData,
  trigger,
}: ProjectDetailsDialogProps) => {
  const [open, setOpen] = useState(false);

  // initialize form with react-hook-form
  const form = useForm<projectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: prefillData?.projectName || '',
      projectDetails: prefillData?.projectDetails || '',
      projectImageSource: prefillData?.imgUrl.startsWith('https') ? 'custom' : 'predefined',
      predefinedImage: !prefillData?.imgUrl.startsWith('http') ? prefillData?.imgUrl : defaultGroupIcons[0].value,
      customImageUrl: prefillData?.imgUrl.startsWith('http') ? prefillData.imgUrl : '',
    },
  });

  // validate user-entered image link in real-time for instant feedback
  const { imageSource, customImageUrl } = useCustomUrlValidation(form);

  const handleSubmit = (values: projectFormValues) => {
    // use null coalescing to handle potentially undefined values more safely
    const imgUrl =
      values.projectImageSource === 'predefined'
        ? (values.predefinedImage ?? defaultGroupIcons[0].value)
        : (values.customImageUrl ?? '');

    let formattedData: ProjectData | UpdatedProject;
    if (projectId) {
      formattedData = {
        projectName: values.projectName,
        projectDetails: values.projectDetails,
        imgUrl,
        projectId,
      };
    } else {
      formattedData = {
        projectName: values.projectName,
        projectDetails: values.projectDetails,
        imgUrl,
      };
    }

    // send form data over to the backend
    onSubmit(formattedData);
    // close the dialog after submission
    setOpen(false);
    form.reset();

    if (projectId) {
      // project details edited successfully
      toast.success(`${formattedData.projectName} project details updated successfully`);
    } else {
      //new Project created successfully
      toast.success(`${formattedData.projectName} project created successfully`, {
        description: 'You can now invite members to your project',
      });
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
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary/90 font-heading hover:cursor-pointer">
            {projectId ? 'Edit Project' : 'New Project'}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto p-6 font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading mb-1">
            {projectId ? (
              <>
                Edit <span className="text-purple-300">Project Details</span>
              </>
            ) : (
              <>
                Create <span className="text-purple-300">New Project</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {projectId
              ? "Update your project's details and settings."
              : 'Create a project to organize projects and collaborate with team members.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4 font-sans">
            <BasicProjectInfoFields control={form.control} />
            <FormField
              control={form.control}
              name="projectImageSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-heading font-semibold mb-2">Project Image</FormLabel>
                  <FormControl>
                    <Tabs
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue="predefined"
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="predefined">Predefined Icons</TabsTrigger>
                        <TabsTrigger value="custom">Custom URL</TabsTrigger>
                      </TabsList>

                      <TabsContent value="predefined" className="mt-2">
                        <DefaultProjectImagesTab control={form.control} />
                      </TabsContent>

                      <TabsContent value="custom" className="mt-4 space-y-4">
                        <FormField
                          control={form.control}
                          name="customImageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Enter image URL (https://...)" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter a direct URL to an image (e.g., https://example.com/image.jpg)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Image Preview Section */}
                        <ImagePreview
                          imageSource={imageSource}
                          customImageUrl={customImageUrl as string}
                          defaultIcon={prefillData ? prefillData.imgUrl : defaultGroupIcons[0].value}
                        />
                      </TabsContent>
                    </Tabs>
                  </FormControl>
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
              >
                Cancel
              </Button>
              <LoadingButton
                isLoading={form.formState.isSubmitting || isUpdating}
                loadingText={projectId ? 'Updating...' : 'Creating...'}
                defaultText={projectId ? 'Update Project' : 'Create Project'}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
