import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const { login, logout, user, isAuthenticated, isLoading } = useAuth();
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
          <Button size="lg" onClick={() => login()}>
            Log In
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl mb-4">Welcome, {user?.name}</h2>
          <Button onClick={() => logout()}>Log out</Button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
