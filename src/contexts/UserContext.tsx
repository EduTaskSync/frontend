import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { User } from '@/interfaces/user.interface';
import { Spinner } from '@/components/ui/spinner';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  refetchUser: () => void;
  exists: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  refetchUser: () => {},
  exists: false,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: auth0User, isLoading: auth0Loading, isSessionEstablished } = useAuth();
  const { useGetUser } = useUser();

  const {
    data: userCheckResult,
    isLoading: userLoading,
    refetch,
  } = useGetUser({
    queryKey: ['user-check', auth0User?.sub],
    enabled: !auth0Loading && !!auth0User?.sub && isSessionEstablished,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const userExists = userCheckResult?.exists || false;
  const backendUser = userCheckResult?.user || null;

  const value = {
    user: backendUser ? { ...backendUser, picture: auth0User?.picture } : null,
    isLoading: auth0Loading || userLoading,
    refetchUser: refetch,
    exists: userExists,
  };

  if (auth0Loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner size="large" />
        <p className="mt-4">Loading authentication...</p>
      </div>
    );
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
