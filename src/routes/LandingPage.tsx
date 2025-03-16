import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { routes } from '@/constants/routes';

const LandingPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Link to={routes.login}>
        <Button>Log In</Button>
      </Link>
    </div>
  );
};

export default LandingPage;
