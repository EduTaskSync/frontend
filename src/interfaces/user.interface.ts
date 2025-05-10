import { z } from 'zod';
export const UserSchema = z.object({
  userId: z.string().uuid(),
  auth0Id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  profilePicture: z.string().url().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({ userId: true });
export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const GetUserDetailsSchema = z.object({
  exists: z.boolean(),
  user: UserSchema.nullable(),
});
export type GetUserDetailsDto = z.infer<typeof GetUserDetailsSchema>;

export const UpdateUserSchema = z.object({
  userId: z.string().uuid(),
  auth0Id: z.string(),
  email: z.string().email(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  profilePicture: z.string().url().nullable(),
});
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
