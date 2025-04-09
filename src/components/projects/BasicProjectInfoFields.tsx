import { projectFormValues } from '@/utils/projectSchema';
import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';

interface BasicProjectInfoFieldsProps {
  control: Control<projectFormValues>;
}

export const BasicProjectInfoFields = ({ control }: BasicProjectInfoFieldsProps) => {
  return (
    <>
      {/* project name field */}
      <FormField
        control={control}
        name="projectName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-heading font-semibold mb-2">Project Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter project name (e.g., FIT2099)" {...field} />
            </FormControl>
            <FormDescription>Choose a descriptive name for your project.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* project description field */}
      <FormField
        control={control}
        name="projectDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-heading font-semibold mb-2">Project Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormDescription>You can update the project description later in the Project Details page.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
