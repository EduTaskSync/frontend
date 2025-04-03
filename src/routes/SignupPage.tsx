import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { routes } from '@/constants/routes';
import { useUserContext } from '@/contexts/UserContext';
import { InfoIcon } from 'lucide-react';
import { SignupForm } from '@/components/SignupForm';

export function ProgressiveSignup() {
  const { user: backendUser, isLoading: backendUserLoading, exists: userExists } = useUserContext();
  const { user: auth0User, isLoading: auth0Loading } = useAuth();

  const navigate = useNavigate();
  const [isFormReady, setIsFormReady] = useState(false);

  const hasCheckedUserStatus = !backendUserLoading && !auth0Loading;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (hasCheckedUserStatus) {
      // If user exists, redirect immediately
      if (backendUser || userExists) {
        navigate(routes.dashboard, { replace: true });
      } else {
        // Otherwise, set a minimum loading time of 1.5 seconds before showing form
        timer = setTimeout(() => {
          setIsFormReady(true);
        }, 1500);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [hasCheckedUserStatus, backendUser, userExists, navigate]);
  // Update form values when Auth0 user data is loaded

  // IMPORTANT: Show a loading state until we know for sure we need the signup form
  if (auth0Loading || backendUserLoading || !isFormReady || (hasCheckedUserStatus && (backendUser || userExists))) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner size="large" />
        <p className="mt-4 text-lg font-medium">Preparing your account...</p>
        <p className="mt-2 text-sm text-muted-foreground">This will only take a moment</p>
      </div>
    );
  }
  // Show error if Auth0 user is not available
  if (!auth0User) {
    return (
      <div className="w-full max-w-md mx-auto p-6 space-y-6">
        <div className="p-4 bg-destructive/5 text-destructive rounded-md border border-destructive/20">
          <div className="flex gap-2">
            <InfoIcon className="h-5 w-5 text-destructive shrink-0" />
            <p>Unable to load your authentication information. Please try logging in again.</p>
          </div>
        </div>
        <Button onClick={() => (window.location.href = '/login')} className="w-full">
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <SignupForm auth0User={auth0User} />
    </div>
  );
}
