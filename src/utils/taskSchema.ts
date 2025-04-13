import { z } from 'zod';

export const taskFormSchema = z
  .object({
    taskName: z.string().min(1, 'project name is required'),
    taskDeadline: z.date().nullable(),
  })

// type for form values
export type taskFormValues = z.infer<typeof taskFormSchema>;
