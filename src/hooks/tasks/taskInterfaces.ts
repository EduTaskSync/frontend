import ProfilePage from '@/routes/ProfilePage';
import { z } from 'zod';

export const TaskBaseSchema = z.object({
  taskName: z.string().min(1, { message: 'Task name is required' }),
  projectId: z.string().uuid(),
  columnId: z.string().uuid(),
  taskDeadline: z.date().nullable(),
  taskIndex: z.number(),
});
export type TaskBaseResponse = z.infer<typeof TaskBaseSchema>;

export const TaskAssigneesSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().uuid(),
  lastName: z.string().uuid(),
  ProfilePicture: z.string().uuid(),
});

export const TaskSummarySchema = TaskBaseSchema.extend({
  projectName: z.string().uuid(),
  taskCreationTime: z.date().nullable(),
  taskAssignees: TaskAssigneesSchema,
  
});

export type TaskSummaryResponse = z.infer<typeof TaskSummarySchema>;

export type TaskSummaryListResponse = {
  tasks: TaskSummaryResponse[];
};

export const CreateTaskSchema = TaskBaseSchema.omit({ projectId: true });

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
