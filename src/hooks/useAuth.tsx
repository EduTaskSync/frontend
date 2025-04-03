import { useAuth0, User } from '@auth0/auth0-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axiosConfig from '@/api/axiosConfig';
import { ApiEndPoints } from '@/constants/apiEndpoints';
import { useErrorBoundary } from '@/hooks/useErrorBoundary';
import axios from 'axios';
import { AuthError } from '@/utils/ErrorClasses';

interface UseAuthResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: () => void;
  logout: () => Promise<void>;
  user?: User;
  isSessionEstablished: boolean;
}

export const useAuth = (): UseAuthResult => {
  const [error, setError] = useState<Error | null>(null);

  const [isSessionEstablished, setSessionEstablished] = useState(false);
  const queryClient = useQueryClient();
  // whenever there is an error in http communication below, user will be redirected to the error page gracefully
  useErrorBoundary(error);

  const {
    isAuthenticated,
    isLoading: auth0Loading,
    getAccessTokenSilently,
    loginWithRedirect,
    logout: auth0Logout,
    user,
  } = useAuth0();

  // Define mutation config obj for exchanging access token with server
  const { mutate, isPending: isExchanging } = useMutation({
    mutationFn: async (token: string) => {
      return axiosConfig.post(ApiEndPoints.AUTH_SESSION, {}, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => {
      setSessionEstablished(true);
      queryClient.invalidateQueries({ queryKey: ['user-check'] });
    },
    onError: (err) => {
      // If the error is from axios, get the status code
      const statusCode = axios.isAxiosError(err) && err.response ? err.response.status : 500;
      setError(new AuthError('Failed to authenticate with the server', statusCode));
      console.error('Token exchange failed:', err);
    },
  });

  // Effect to exchange token when authenticated
  useEffect(() => {
    const setupSession = async () => {
      if (isAuthenticated) {
        try {
          // audience is identical to the default config audience
          const token = await getAccessTokenSilently();
          console.log('Got access token:', token);
          mutate(token);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Authentication failed'));
          console.error('Failed to get access token:', err);
        }
      }
    };

    setupSession();
  }, [isAuthenticated, getAccessTokenSilently, mutate]);

  const login = () => {
    loginWithRedirect();
  };

  const logout = async () => {
    // Clear the HTTP-only cookie by calling backend endpoint
    try {
      await axiosConfig.post(ApiEndPoints.LOGOUT);
    } catch (err) {
      console.error('Error during logout:', err);
    }

    // Then log out from Auth0
    return auth0Logout({
      logoutParams: { returnTo: window.location.origin },
    });
  };

  return {
    isAuthenticated,
    isLoading: auth0Loading || isExchanging,
    error,
    login,
    logout,
    user,
    isSessionEstablished,
  };
};
