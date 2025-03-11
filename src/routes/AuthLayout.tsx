import { Outlet } from 'react-router';
import { Dock } from '@/components/Dock';
const AuthLayout = () => {
  return (
    <>
      <div className="flex flex-col gap-20 mx-100 my-10 ">
        <Outlet />
        <Dock />
      </div>
    </>
  );
};

export default AuthLayout;
