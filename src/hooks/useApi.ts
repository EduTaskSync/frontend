import { useMutation, useQuery, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ZodSchema } from 'zod';
import { validateData, ValidationError } from '../utils/validation';
import backendServer from '@/api/client';
// Generic GET request hook with validation
export const useApiQuery = <TData = unknown, TError = AxiosError>(
  endpoint: string,
  queryKey: string[],
  schema?: ZodSchema, // Optional schema for validating response
  options?: UseQueryOptions<TData, TError>,
  config?: AxiosRequestConfig
) => {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const response = await backendServer.get(endpoint, config);
      // If schema provided, validate response
      return schema ? validateData<TData>(schema, response.data) : response.data;
    },
    ...options,
  });
};

// Generic POST request hook with validatio

export const useApiMutation = <TData = unknown, TVariables = unknown, TError = AxiosError>(
  endpoint: string,
  requestSchema?: ZodSchema,
  responseSchema?: ZodSchema,
  options?: UseMutationOptions<TData, TError, TVariables>,
  config?: AxiosRequestConfig
) => {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      try {
        // Validate request data if schema provided
        const validatedData = requestSchema ? validateData(requestSchema, variables) : variables;
        const response = await backendServer.post(endpoint, validatedData, config);

        // Validate response if schema provided
        return responseSchema ? validateData<TData>(responseSchema, response.data) : response.data;
      } catch (error) {
        console.log('error', error);
        // Handle axios errors and transform them to ValidationErrors if needed
        if (axios.isAxiosError(error) && error.response?.data?.errors) {
          // Assuming your API returns validation errors in format { errors: { field: message } }
          const serverErrors = error.response.data.errors;
          throw new ValidationError(
            'Server validation failed',
            Object.entries(serverErrors).map(([field, message]) => ({
              path: [field],
              message: String(message),
              code: 'custom',
              params: { field },
            }))
          );
        }
        throw error;
      }
    },
    ...options,
  });
};
