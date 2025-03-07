import { Outlet } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

const ProtectedLayout = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);


  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedLayout;
