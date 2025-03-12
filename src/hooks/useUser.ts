import { CreateUserDto, CreateUserSchema, GetUserDetailsSchema, User, UserSchema } from '@/interfaces/user.interface';
import { useApiMutation, useApiQuery } from './useApi';
import { ApiEndPoints } from '@/constants/apiEndpoints';
import { UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
export function useUser() {
  const useGetUser = (options?: UseQueryOptions<User, AxiosError>) =>
    useApiQuery<User>(ApiEndPoints.GET_USER, ['user'], GetUserDetailsSchema, options);
  const useCreateUser = () =>
    useApiMutation<User, CreateUserDto>(ApiEndPoints.CREATE_USER, CreateUserSchema, UserSchema);
  return { useGetUser, useCreateUser };
}
