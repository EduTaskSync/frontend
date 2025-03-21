import { AuthHeader } from '@/components/AuthHeader';
import { routePageNames } from '@/constants/routes';
import { Outlet, useLocation } from 'react-router';

const AuthLayout = () => {
  const location = useLocation();
  const pathName = location.pathname;

  const currentPageName =
    routePageNames[pathName as keyof typeof routePageNames] ||
    (pathName.startsWith('/app/groups/') ? 'Project Detail' : '');

  return (
    <>
      <AuthHeader tabName={currentPageName} />
      <div className="flex flex-col gap-20 mx-100 my-10 ">
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
