import { z } from 'zod';

export const projectFormSchema = z
  .object({
    projectName: z.string().min(1, 'project name is required'),
    projectDetails: z.string().max(500, 'Keep the project description under 500 characters'),
    projectImageSource: z.enum(['predefined', 'custom']).default('predefined'),
    predefinedImage: z.string().optional(),
    customImageUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // users must enter a valid image url if they chose a custom project image
    if (data.projectImageSource === 'custom' && (!data.customImageUrl || !data.customImageUrl.startsWith('https'))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A valid https URL is required for custom images',
        path: ['customImageUrl'],
      });
    }
  });

// type for form values
export type projectFormValues = z.infer<typeof projectFormSchema>;
