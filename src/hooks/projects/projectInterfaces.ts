import { z } from 'zod';

export const ProjectBaseSchema = z.object({
  projectId: z.string().uuid(),
  projectName: z.string().min(1, { message: 'Project name is required' }),
  deadline: z.date().nullable(),
  creation_time: z.date().nullable(),
});
export type ProjectBaseResponse = z.infer<typeof ProjectBaseSchema>;

export const ProjectSummarySchema = ProjectBaseSchema.extend({
  progress: z.number().min(0).max(100),
});

export type ProjectSummaryResponse = z.infer<typeof ProjectSummarySchema>;

export type ProjectSummaryListResponse = {
  projects: ProjectSummaryResponse[];
};

export const CreateProjectSchema = ProjectBaseSchema.omit({ projectId: true });

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
