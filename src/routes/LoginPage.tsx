import { Button } from '@/components/ui/button';
import { useAuth0 } from '@auth0/auth0-react';

const LoginPage = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {!isAuthenticated ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-6">Welcome to EduTaskSync</h1>
          <Button size="lg" onClick={() => loginWithRedirect()}>
            Log In
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl mb-4">Welcome, {user?.name}</h2>
          <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log out
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
