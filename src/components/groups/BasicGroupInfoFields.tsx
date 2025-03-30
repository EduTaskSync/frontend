import { groupFormValues } from '@/utils/groupSchema';
import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';

interface BasicGroupInfoFieldsProps {
  control: Control<groupFormValues>;
}

export const BasicGroupInfoFields = ({ control }: BasicGroupInfoFieldsProps) => {
  return (
    <>
      {/* group name field */}
      <FormField
        control={control}
        name="groupName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-heading font-semibold mb-2">Group Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter group name (e.g., FIT2099)" {...field} />
            </FormControl>
            <FormDescription>Choose a descriptive name for your group.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* group description field */}
      <FormField
        control={control}
        name="groupDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-heading font-semibold mb-2">Group Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormDescription>You can update the group description later in the Group Details page.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
