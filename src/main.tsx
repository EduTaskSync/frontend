import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import LandingPage from './routes/LandingPage.tsx';
import RootLayout from './routes/RootLayout.tsx';
import Signup from './routes/SignupPage.tsx';
import LoginPage from './routes/LoginPage.tsx';
import ErrorPage from './routes/ErrorPage.tsx';
import AuthLayout from './routes/AuthLayout.tsx';
import DashboardPage from './routes/DashboardPage.tsx';
import ProjectsPage from './routes/ProjectsPage.tsx';
import CalendarPage from './routes/CalendarPage.tsx';
import ProtectedLayout from './routes/ProtectedLayout.tsx';
import ProjectDetailPage from './routes/ProjectDetailPage.tsx';
import { ThemeProvider } from './components/ThemeProvider.tsx';
import { Auth0Provider } from '@auth0/auth0-react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'signup', element: <Signup /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
  // Protection layer
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        // UI rendering routes
        element: <AuthLayout />,
        errorElement: <ErrorPage />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          {
            path: 'projects',
            element: <ProjectsPage />,
            children: [{ path: ':projectId', element: <ProjectDetailPage /> }],
          },
          { path: 'calendar', element: <CalendarPage /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId= {import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{ redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI}}
    >
      <ThemeProvider>
        <RouterProvider router={router}></RouterProvider>
      </ThemeProvider>
    </Auth0Provider>
  </StrictMode>
);
