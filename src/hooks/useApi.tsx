import { useMutation, useQuery, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ZodSchema } from 'zod';
import { validateData, ValidationError } from '../utils/validation';
import axiosConfig from '@/api/axiosConfig';
import { useErrorBoundary } from '@/hooks/useErrorBoundary';
import { useState } from 'react';

// Generic GET request hook with validation
export const useApiQuery = <TData = unknown, TError = AxiosError>(
  endpoint: string,
  queryKey: string[],
  schema?: ZodSchema, // Optional schema for validating response
  options?: UseQueryOptions<TData, TError>,
  config?: AxiosRequestConfig
) => {
  // Add state for error handling
  const [error, setError] = useState<Error | null>(null);

  // Use your error boundary hook to handle errors
  useErrorBoundary(error);

  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await axiosConfig.get(endpoint, config);
        // If schema provided, validate response
        return schema ? validateData<TData>(schema, response.data) : response.data;
      } catch (err) {
        // Set error to trigger the error boundary
        const apiError = err instanceof Error ? err : new Error('API request failed');
        setError(apiError);
        throw err;
      }
    },
    ...options,
  });
};

// Generic POST request hook with validation
export const useApiMutation = <TData = unknown, TVariables = unknown, TError = AxiosError>(
  endpoint: string,
  requestSchema?: ZodSchema,
  responseSchema?: ZodSchema,
  options?: UseMutationOptions<TData, TError, TVariables>,
  config?: AxiosRequestConfig
) => {
  // Add state for error handling
  const [error, setError] = useState<Error | null>(null);

  // Use your error boundary hook
  useErrorBoundary(error);

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      try {
        // Validate request data if schema provided
        const validatedData = requestSchema ? validateData(requestSchema, variables) : variables;
        const response = await axiosConfig.post(endpoint, validatedData, config);

        // Validate response if schema provided
        return responseSchema ? validateData<TData>(responseSchema, response.data) : response.data;
      } catch (err) {
        console.log('error', err);

        // Handle axios errors and transform them to ValidationErrors if needed
        if (axios.isAxiosError(err) && err.response?.data?.errors) {
          // API returns validation errors in format { errors: { field: message } }
          const serverErrors = err.response.data.errors;
          const validationError = new ValidationError(
            'Server validation failed',
            Object.entries(serverErrors).map(([field, message]) => ({
              path: [field],
              message: String(message),
              code: 'custom',
              params: { field },
            }))
          );

          // Only set validation errors if they're critical and should redirect
          if (err.response.status >= 500) {
            setError(validationError);
          }

          throw validationError;
        }

        // For non-validation errors, set the error to trigger the boundary
        const apiError = err instanceof Error ? err : new Error('API mutation failed');
        setError(apiError);
        throw err;
      }
    },
    ...options,
  });
};
