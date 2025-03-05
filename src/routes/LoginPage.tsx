import { useLocation, useNavigate } from "react-router";
import { LoginForm } from "../components/LoginForm";
const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // handle login through redirects
  const redirectTo = location.state?.from?.pathname;

  const handleLogin = () => {
    //TODO authenticate user backend
    // successful login; navigate to attempted protected route and remove login route from the History API so that the user cannot go back to login page
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoginForm /> 
    </div>
  );
};
export default LoginPage;
