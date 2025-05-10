import { z } from 'zod';

export const TaskBaseSchema = z.object({
  taskId: z.string().uuid(),
  taskName: z.string().min(1, { message: 'Task name is required' }),
  taskDeadline: z.date(),
  taskCreationTime: z.date(),
  projectName: z.string(),
  projectId: z.string().uuid(),
  status: z.string(),
  groupName: z.string(),
  groupId: z.string().uuid(),
});

export type TaskBaseResponse = z.infer<typeof TaskBaseSchema>;
export type TasksListResponse = {
  tasks: TaskBaseResponse[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
};
