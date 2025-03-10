import { ZodIssue, ZodSchema } from 'zod';

export class ValidationError extends Error {
  errors: ZodIssue[];

  constructor(message: string, errors: ZodIssue[]) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export const validateData = <T>(schema: ZodSchema, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError('Validation failed', result.error.errors);
  }

  return result.data as T;
};
