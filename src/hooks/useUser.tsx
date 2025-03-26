import {
  CreateUserDto,
  CreateUserSchema,
  GetUserDetailsDto,
  GetUserDetailsSchema,
  User,
  UserSchema,
} from '@/interfaces/user.interface';
import { useApiMutation, useApiQuery } from './useApi';
import { ApiEndPoints } from '@/constants/apiEndpoints';
import { UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export function useUser() {
  const useGetUser = (options?: UseQueryOptions<GetUserDetailsDto, AxiosError>) =>
    useApiQuery<GetUserDetailsDto>(ApiEndPoints.GET_USER, ['user'], GetUserDetailsSchema, options);
  const useCreateUser = () =>
    useApiMutation<User, CreateUserDto>(ApiEndPoints.CREATE_USER, CreateUserSchema, UserSchema);
  const useUpdateUser = () =>
    useApiMutation<User, CreateUserDto>(ApiEndPoints.UPDATE_USER, CreateUserSchema, UserSchema);
  return { useGetUser, useCreateUser, useUpdateUser };
}
