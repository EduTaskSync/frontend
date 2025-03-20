import { z } from 'zod';

export const groupFormSchema = z
  .object({
    groupName: z.string().min(1, 'Group name is required'),
    groupImageSource: z.enum(['predefined', 'custom']).default('predefined'),
    predefinedImage: z.string().optional(),
    customImageUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // users must enter a valid image url if they chose a custom group image
    if (data.groupImageSource === 'custom' && (!data.customImageUrl || !data.customImageUrl.startsWith('https'))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A valid https URL is required for custom images',
        path: ['customImageUrl'],
      });
    }
  });

// type for form values
export type groupFormValues = z.infer<typeof groupFormSchema>;
