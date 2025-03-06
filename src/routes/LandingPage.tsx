import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const LandingPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Link to='login'>Log In</Link>
    </div>
  );
};

export default LandingPage;
