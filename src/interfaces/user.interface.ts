import { User } from 'lucide-react';
import { z } from 'zod';

export const UserSchema = z.object({
  userId: z.string().uuid().optional(),
  auth0Id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({ userId: true });
export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const GetUserDetailsSchema = UserSchema;
export type GetUserDetailsDto = z.infer<typeof GetUserDetailsSchema>;
