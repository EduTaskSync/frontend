import { z } from 'zod';

export const TaskBaseSchema = z.object({
  taskName: z.string().min(1, { message: 'Task name is required' }),
  projectId: z.string().uuid(),
  columnId: z.string().uuid(),
  taskDeadline: z.date().nullable(),
});
export type TaskBaseResponse = z.infer<typeof TaskBaseSchema>;

export const TaskSummarySchema = TaskBaseSchema.extend({
  projectName: z.string().uuid(),
});

export type TaskSummaryResponse = z.infer<typeof TaskSummarySchema>;

export type TaskSummaryListResponse = {
  tasks: TaskSummaryResponse[];
};

export const CreateTaskSchema = TaskBaseSchema.omit({ projectId: true });

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
