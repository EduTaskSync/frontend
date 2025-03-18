import { Spinner } from '@/components/ui/spinner';
import { routes } from '@/constants/routes';
import { UserProvider } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router';

const ProtectedLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner size="large" />
        <p className="mt-4">Authentication </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.landingPage} />;
  }
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
};

export default ProtectedLayout;
