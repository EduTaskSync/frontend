import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import LandingPage from './routes/LandingPage.tsx';
import RootLayout from './routes/RootLayout.tsx';
import ErrorPage from './routes/ErrorPage.tsx';
import AuthLayout from './routes/AuthLayout.tsx';
import DashboardPage from './routes/DashboardPage.tsx';
import GroupsPage from './routes/GroupsPage.tsx';
import CalendarPage from './routes/CalendarPage.tsx';
import ProtectedLayout from './routes/ProtectedLayout.tsx';
import GroupDetailPage from './routes/GroupDetailPage.tsx';
import { ThemeProvider } from './components/ThemeProvider.tsx';
import { Auth0Provider } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProgressiveSignup } from './routes/SignupPage.tsx';
import ProjectsPage from './routes/ProjectsPage.tsx';
import ProjectDetailPage from './routes/ProjectDetailPage.tsx';
import MemberDetailPage from './routes/MemberDetailPage.tsx';
import { Toaster } from '@/components/ui/sonner';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <ProjectsPage /> }],  //LandingPage
  },
  // Protection layer
  {
    path: '/app',
    element: <ProtectedLayout />, 
    children: [
      {
        // UI rendering routes
        element: <AuthLayout />,
        children: [
          { path: 'signup', element: <ProgressiveSignup /> }, 
          { path: 'profile', element: <div>Profile</div> },
          { path: 'dashboard', element: <DashboardPage /> },
          {
            path: 'groups',
            element: <GroupsPage />,
            children: [{ path: ':groupId', element: <GroupDetailPage /> }],
          },
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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        }}
      >
        <ThemeProvider>
          <RouterProvider router={router}></RouterProvider>
          <Toaster />
        </ThemeProvider>
      </Auth0Provider>
    </QueryClientProvider>
  </StrictMode>
);
