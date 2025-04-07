import { z } from 'zod';

export const ProjectSchema = z.object({
  projectId: z.string().uuid(),
  projectName: z.string(),
  groupId: z.string().uuid(),
  deadline: z.date(),
  progress: z.number().min(0).max(100),
});

export const ProjectSummarySchema = ProjectSchema.pick({
  projectId: true,
  projectName: true,
  progress: true,
  deadline: true,
});

export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;
export type Project = z.infer<typeof ProjectSchema>;

export const CreateProjectSchema = ProjectSchema.omit({ projectId: true, progress: true });

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
