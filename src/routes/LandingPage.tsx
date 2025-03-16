import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const LandingPage = () => {
  const { login } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome to EduTaskSync</h1>
        <Button size="lg" onClick={() => login()}>
          Log In
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
