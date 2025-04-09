import { useEffect } from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';

// object schema to ensure thrown errors follow a consistent shape
interface ErrorObj {
  statusCode?: number;
  message: string;
  stack?: string;
  name?: string;
}

// custom hook to handle errors caught by react router's error boundaries
export const useErrorDetails = (): ErrorObj => {
  // retrieve the error from the route that threw it
  const error = useRouteError();

  // handle react router specific errors
  if (isRouteErrorResponse(error)) {
    return {
      statusCode: error.status,
      message: error.statusText || error.data?.message || 'Route error occurred',
    };
  }

  // handle JS Error() objects thrown by components or dependacies such as axios or tanstack query and include the stacktrace
  if (error instanceof Error) {
    return {
      message: error.message || 'An unknown error occurred',
      // will be undefined if the stack isnt available
      stack: error.stack,
    };
  }

  // handle unknown/unexpected error types
  return {
    message: 'An unexpected error occurred',
  };
};

// custom hook to handle programmatic errors that react router cannot catch by redirecting to the error page
export const useErrorBoundary = (error: Error | null) => {
  const navigate = useNavigate();

  // useEffect so that error handling function will be run whenever a new error is thrown and redirect the user to the error page
  useEffect(() => {
    if (error) {
      navigate('/error', {
        // pass error object to the error route that can later be extracted using useLocation()
        state: {
          error: {
            message: error.message,
            name: error.name,
            stack: error.stack,
          },
        },
        // replace current history entry
        replace: true,
      });
    }
  }, [error, navigate]); // rerun function when error or navigate function changes
};
