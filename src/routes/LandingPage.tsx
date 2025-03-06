import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Button variant="secondary" onClick={() => alert('Clicked!')}>
        Hello
      </Button>
    </div>
  );
};

export default LandingPage;
