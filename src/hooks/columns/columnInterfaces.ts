import { z } from 'zod';

export const ColumnBaseSchema = z.object({
  columnName: z.string().min(1, { message: 'Task name is required' }),
  columnIndex: z.number(),
  projectId: z.string().uuid(),
  
});
export type ColumnBaseResponse = z.infer<typeof ColumnBaseSchema>;

export const ColumnSummarySchema = ColumnBaseSchema.extend({
  columnId: z.string().uuid(),
});

export type ColumnSummaryResponse = z.infer<typeof ColumnSummarySchema>;

export type ColumnSummaryListResponse = {
  columns: ColumnSummaryResponse[];
};

export const CreateColumnSchema = ColumnBaseSchema.omit({ projectId: true });

export type CreateColumnDto = z.infer<typeof CreateColumnSchema>;
