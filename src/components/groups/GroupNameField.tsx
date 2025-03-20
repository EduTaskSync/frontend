import { groupFormValues } from '@/utils/groupSchema';
import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const GroupNameField = ({ control }: { control: Control<groupFormValues> }) => {
  return (
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
  );
};
