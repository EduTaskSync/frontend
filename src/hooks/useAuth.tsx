import { useAuth0, User } from '@auth0/auth0-react';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axiosConfig from '@/api/axiosConfig';
import { ApiEndPoints } from '@/constants/apiEndpoints';

interface UseAuthResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: () => void;
  logout: () => Promise<void>;
  user?: User;
}

export const useAuth = (): UseAuthResult => {
  const [error, setError] = useState<Error | null>(null);
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
    onError: (err) => {
      setError(new Error('Failed to authenticate with the server'));
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
  };
};
