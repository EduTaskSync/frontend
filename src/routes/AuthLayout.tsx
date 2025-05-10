import { AuthHeader } from '@/components/AuthHeader';
import { routePageNames } from '@/constants/routes';
import { Outlet, useLocation } from 'react-router';

const AuthLayout = () => {
  const location = useLocation();
  const pathName = location.pathname;

  const currentPageName =
    routePageNames[pathName as keyof typeof routePageNames] ||
    (pathName.startsWith('/app/groups/') ? 'Group Details' : '');

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <AuthHeader tabName={currentPageName} />
      <div className="w-full flex justify-center px-4 sm:px-6">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-[1920px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
