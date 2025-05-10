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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { LoadingButton } from '@/components/LoadingButton';
import { useEmailSearch } from '@/hooks/groups/useEmailSearch';
import { useDebounce } from '@/hooks/groups/useDebounce';
import { AutoComplete, Option } from '@/components/Autocomplete';

interface InviteMemberDialogProps {
  trigger: React.ReactNode;
  onSubmit: (values: z.infer<typeof inviteMemberFormSchema>) => void;
  isLoading?: boolean;
  isAdmin?: boolean;
}

const inviteMemberFormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

export const InviteMemberDialog = ({
  trigger,
  onSubmit,
  isLoading = false,
  isAdmin = false,
}: InviteMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<Option | undefined>();

  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 800);

  // Use the email search hook with debounced search term
  const { data, isLoading: isSearching } = useEmailSearch(debouncedSearchTerm);

  // Format the email results for the AutoComplete component
  const emailOptions: Option[] = (data?.emails || []).map((email: string) => ({
    value: email,
    label: email,
  }));

  const form = useForm<z.infer<typeof inviteMemberFormSchema>>({
    resolver: zodResolver(inviteMemberFormSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle form submission
  const handleFormSubmit = (values: z.infer<typeof inviteMemberFormSchema>) => {
    onSubmit(values);
    setOpen(false);
    form.reset();
    setSearchTerm('');
    setSelectedEmail(undefined);
  };

  // Handle input change in AutoComplete
  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    form.setValue('email', value, {
      shouldValidate: value.length > 0, // Only validate if there's input
    });
  };

  // Handle option selection in AutoComplete
  const handleOptionSelect = (option: Option) => {
    setSelectedEmail(option);
    form.setValue('email', option.value, { shouldValidate: true });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset();
          setSearchTerm('');
          setSelectedEmail(undefined);
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-6 font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading mb-1">
            Invite <span className="text-purple-300">New Member</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Send an invitation to join this group.
          </DialogDescription>
        </DialogHeader>

        {/* Form for inviting members */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4 font-sans">
            <FormField
              control={form.control}
              name="email"
              render={({ field: { onChange } }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="font-heading font-semibold">Email address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <AutoComplete
                        options={emailOptions}
                        value={selectedEmail}
                        onValueChange={(option) => {
                          handleOptionSelect(option);
                          onChange(option.value);
                        }}
                        onInputChange={(value) => {
                          handleInputChange(value);
                          onChange(value);
                        }}
                        placeholder="example@hotmail.com"
                        isLoading={isSearching}
                        disabled={isLoading}
                        emptyMessage="No matching emails found"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Enter the email address of the person you want to invite.</FormDescription>
                  {/* Add margin-top to push error message below dropdown */}
                  <div className="h-[40px] pt-2">
                    <FormMessage />
                  </div>
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
                loadingText="Sending..."
                defaultText="Send Invitation"
                disabled={!isAdmin || form.formState.isSubmitting}
                title={isAdmin ? 'Invite new member' : 'Only group admins can invite members.'}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
