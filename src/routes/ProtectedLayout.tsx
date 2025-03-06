import { Outlet, Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // replace attempted entry (protected route) in History API with /login to prevent an endless loop if user clicks on back button in succession after successive login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
};

export default ProtectedLayout;
