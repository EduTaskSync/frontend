import { Button } from '@/components/ui/button';
import { useAuth0 } from '@auth0/auth0-react';

const Signup = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div> Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-w-full min-h-full">
      {!isAuthenticated ? (
        <Button onClick={() => loginWithRedirect()}>Log In</Button>
      ) : (
        <>
          <h2> Welcome, {user?.name}</h2>
          <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log out</Button>
        </>
      )}
    </div>
  );
};

export default Signup;
