import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { CreateUserDto, CreateUserSchema } from '@/interfaces/user.interface';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { routes } from '@/constants/routes';
import { useUserContext } from '@/contexts/UserContext';
import AvatarSelector from '@/components/profile/AvatarSelector';

export function ProgressiveSignup() {
  const { user: backendUser, isLoading: backendUserLoading, refetchUser } = useUserContext();
  const { user: auth0User, isLoading: auth0Loading } = useAuth();
  const { useCreateUser } = useUser();
  const navigate = useNavigate();

  // For creating the user
  const { mutate: createUser, isPending, error: createError, isSuccess } = useCreateUser();

  // Form setup with React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateUserDto>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: auth0User?.email || '',
      firstName: auth0User?.given_name || auth0User?.name?.split(' ')[0] || '',
      lastName: auth0User?.family_name || auth0User?.name?.split(' ').slice(1).join(' ') || '',
      auth0Id: auth0User?.sub || '',
      profilePicture: auth0User?.picture || '',
    },
  });

  // Watch the profile picture value to pass to AvatarSelector
  const profilePicture = watch('profilePicture');
  // Update form values when Auth0 user data is loaded
  useEffect(() => {
    if (!auth0Loading && auth0User) {
      // Now we can safely use auth0User properties
      reset({
        email: auth0User.email || '',
        firstName: auth0User.given_name || auth0User.name?.split(' ')[0] || '',
        lastName: auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || '',
        auth0Id: auth0User.sub || '',
        profilePicture: auth0User.picture || '',
      });
    }
  }, [auth0Loading, auth0User, reset]);

  // Redirect to dashboard if user exists or was just created
  useEffect(() => {
    if (backendUser || isSuccess) {
      navigate(routes.dashboard);
    }
  }, [backendUser, isSuccess, navigate]);

  // Form submission handler
  const onSubmit = async (data: CreateUserDto) => {
    console.log('Submitting user data:', data);
    createUser(data, {
      onSuccess: () => {
        reset();
        refetchUser();
        navigate(routes.dashboard);
      },
    });
  };

  // Handler for avatar selection
  const handleAvatarChange = (url: string) => {
    setValue('profilePicture', url, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Loading state
  if (auth0Loading || backendUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner size="large" />
        <p className="mt-4">Checking your account...</p>
      </div>
    );
  }

  // Show error if Auth0 user is not available
  if (!auth0User) {
    return (
      <div className="w-full max-w-md mx-auto p-6 space-y-6">
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
          Unable to load your authentication information. Please try logging in again.
        </div>
        <Button onClick={() => (window.location.href = '/login')}>Return to Login</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Complete Your Profile</h2>

      <div className="p-4 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
        Welcome! Please complete your profile to continue.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium">Profile Picture</label>

          <AvatarSelector
            initialImage={auth0User.picture || undefined}
            selected={profilePicture}
            onChange={handleAvatarChange}
            seed={auth0User.email || auth0User.sub || 'default'}
          />

          {/* Hidden input to register with React Hook Form */}
          <input type="hidden" {...register('profilePicture')} />

          {errors.profilePicture && <p className="text-sm text-red-500">{errors.profilePicture.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 border-gray-300 focus:outline-none"
            {...register('email')}
            readOnly
            disabled
          />
          <p className="text-xs text-gray-500">Email address is provided by your authentication provider</p>
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <input
            id="firstName"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...register('firstName')}
          />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...register('lastName')}
          />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Creating Account...' : 'Complete Sign Up'}
        </Button>

        {createError && (
          <div className="p-3 mt-4 text-sm rounded-md bg-red-50 text-red-600 border border-red-200">
            {createError instanceof Error ? createError.message : 'An error occurred while creating your account'}
          </div>
        )}
      </form>
    </div>
  );
}
