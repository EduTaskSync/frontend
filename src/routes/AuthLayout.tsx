import { Outlet } from 'react-router';
const AuthLayout = () => {
  return (
    <>
      <div className="flex flex-col gap-20 mx-100 my-10 ">
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
