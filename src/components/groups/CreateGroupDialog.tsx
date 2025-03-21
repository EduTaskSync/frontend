import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { groupFormSchema, groupFormValues } from '@/utils/groupSchema';
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
import { ImagePreview } from './ImagePreview';
import { LoadingButton } from '@/components/LoadingButton';
import { useCustomUrlValidation } from '@/hooks/groups/useCustomUrlValidation';
import { GroupNameField } from './GroupNameField';
import { DefaultGroupImagesTab } from './DefaultGroupImagesTab';

// obj shape of response data for POST request
interface GroupFormData {
  groupName: string;
  imgUrl: string;
}

interface CreateGroupDialogProps {
  onCreateGroup: (formattedData: GroupFormData) => void;
  isCreating?: boolean;
}

export const CreateGroupDialog = ({ onCreateGroup, isCreating = false }: CreateGroupDialogProps) => {
  const [open, setOpen] = useState(false);

  // initialize form with react-hook-form
  const form = useForm<groupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      groupName: '',
      groupImageSource: 'predefined',
      predefinedImage: defaultGroupIcons[0].value,
      customImageUrl: '',
    },
  });

  // validate user-entered image link in real-time for instant feedback
  const { imageSource, customImageUrl } = useCustomUrlValidation(form);

  const handleSubmit = (values: groupFormValues) => {
    // use null coalescing to handle potentially undefined values more safely
    const imgUrl =
      values.groupImageSource === 'predefined'
        ? (values.predefinedImage ?? defaultGroupIcons[0].value)
        : (values.customImageUrl ?? '');

    const formattedData: GroupFormData = {
      groupName: values.groupName,
      imgUrl,
    };

    // send form data over to the backend
    onCreateGroup(formattedData);

    // close the dialog after submission
    setOpen(false);
    form.reset();

    // success toast notification
    toast.success(`${formattedData.groupName} group created successfully`, {
      description: 'You can now invite members to your group',
    });
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

      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto p-6 font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading mb-1">
            Create <span className="text-purple-300">New Group</span>
          </DialogTitle>
          <DialogDescription>Create a group to organize projects and collaborate with team members.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4 font-sans">
            <GroupNameField control={form.control} />
            <FormField
              control={form.control}
              name="groupImageSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-heading font-semibold mb-2">Group Image</FormLabel>
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
                        <DefaultGroupImagesTab control={form.control} />
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
                          defaultIcon={defaultGroupIcons[0].value}
                        />
                      </TabsContent>
                    </Tabs>
                  </FormControl>
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
              <LoadingButton
                isLoading={form.formState.isSubmitting || isCreating}
                loadingText="Creating..."
                defaultText="Create Group"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
