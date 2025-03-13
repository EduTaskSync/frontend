import { Outlet, Navigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { User } from '@/interfaces/user.interface';

const ProtectedLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const { useGetUser } = useUser();
  const { data: userData, isLoading: userLoading } = useGetUser({
    enabled: isAuthenticated,
    queryKey: ['user'],
  });
  if (isLoading || userLoading) {
    <div className="flex items-center justify-center h-screen">
      <Spinner size="large" />
    </div>;
  }

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);
  console.log('isAuthenticated', isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && !user) {
    return <Navigate to="/signup" />;
  }
  return <Outlet />;
};

export default ProtectedLayout;
