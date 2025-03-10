import { Outlet, Navigate } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner } from '@/components/ui/spinner';

const ProtectedLayout = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  // mask auth0 SDK setup interval with loading state on UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  // restrict access to protected routes: redirect to login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // user has been authenticated successfully, show user's dashboard
  return <Outlet />;
};

export default ProtectedLayout;
