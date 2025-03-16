import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const LandingPage = () => {
  const { login } = useAuth();
  return (
    <div className="flex h-screen items-center justify-center">
      <h2 className="text-2xl">Landing Page</h2>

      <Button onClick={() => login()}>Log In</Button>
    </div>
  );
};

export default LandingPage;
