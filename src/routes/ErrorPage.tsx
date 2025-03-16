import { useErrorDetails } from '@/hooks/useErrorBoundary';
import { useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // get error from either router's error boundary
  const routeError = useErrorDetails();
  // check if a programmatic error led to the error page
  const stateError = location.state?.error;

  // use state error if available, otherwise use route error
  const error = stateError || routeError;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center font-heading">
      <div className="max-w-md w-full bg-background/95 backdrop-blur-md p-8 rounded-xl border border-border shadow-lg">
        <div className="p-3 bg-destructive/10 rounded-lg mb-6">
          <h1 className="text-3xl font-bold text-destructive">
            {error.statusCode ? `Error ${error.statusCode}` : 'Something went wrong'}
          </h1>
        </div>

        <p className="text-lg mb-6 font-medium text-foreground font-sans">
          {error.message || 'We encountered an unexpected error'}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button onClick={() => navigate(-1)} className="w-full sm:w-auto" variant="secondary">
            Go Back
          </Button>

          <Button variant="default" onClick={() => navigate('/')} className="w-full sm:w-auto">
            Return to Home
          </Button>
        </div>

        {/* Stack trace for development only */}
        {import.meta.env.DEV && error.stack && (
          <div className="mt-8 border border-border rounded-md overflow-hidden">
            <div className="bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">Stack Trace</div>
            <pre className="p-4 bg-muted/30 text-left text-xs overflow-auto max-h-[300px] text-foreground">
              {error.stack}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
