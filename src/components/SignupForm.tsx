import { useUserContext } from '@/contexts/UserContext';
import { useUser } from '@/hooks/useUser';
import { CreateUserDto, CreateUserSchema } from '@/interfaces/user.interface';
import { User } from '@auth0/auth0-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { InfoIcon } from 'lucide-react';
import { routes } from '@/constants/routes';
import AvatarSelector from './profile/AvatarSelector';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function SignupForm({ auth0User }: { auth0User: User }) {
  const { refetchUser } = useUserContext();
  const navigate = useNavigate();
  const { useCreateUser } = useUser();
  const { mutate: createUser, isPending, error: createError } = useCreateUser();
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

  // Form submission handler
  const onSubmit = async (data: CreateUserDto) => {
    console.log('Submitting user data:', data);
    createUser(data, {
      onSuccess: () => {
        refetchUser();
        reset();
        navigate(routes.dashboard, { replace: true });
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
  return (
    <div className="p-[2px]  border border-border rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md">
      <div className="rounded-[calc(0.75rem-1px)] bg-background p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center font-heading">Complete Your Profile</h2>

        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex gap-2 items-start">
            <InfoIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm">Welcome! Please complete your profile to continue.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium font-heading">Profile Picture</label>

            <AvatarSelector
              initialImage={auth0User.picture || undefined}
              selected={profilePicture}
              onChange={handleAvatarChange}
              seed={auth0User.email || auth0User.sub || 'default'}
            />

            {/* Hidden input to register with React Hook Form */}
            <input type="hidden" {...register('profilePicture')} />

            {errors.profilePicture && <p className="text-sm text-destructive">{errors.profilePicture.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium font-heading">
              Email
            </label>
            <Input
              id="email"
              type="email"
              className={cn('bg-muted', errors.email && 'border-destructive')}
              {...register('email')}
              readOnly
              disabled
            />
            <p className="text-xs text-muted-foreground">Email address is provided by your authentication provider</p>
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium font-heading">
              First Name
            </label>
            <Input id="firstName" className={errors.firstName ? 'border-destructive' : ''} {...register('firstName')} />
            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium font-heading">
              Last Name
            </label>
            <Input id="lastName" className={errors.lastName ? 'border-destructive' : ''} {...register('lastName')} />
            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
          </div>

          <Button type="submit" className="w-full font-heading" disabled={isPending}>
            {isPending ? 'Creating Account...' : 'Complete Sign Up'}
          </Button>

          {createError && (
            <div className="p-3 mt-4 rounded-md bg-destructive/5 text-destructive border border-destructive/20">
              <div className="flex gap-2">
                <InfoIcon className="h-5 w-5 text-destructive shrink-0" />
                <p className="text-sm">
                  {createError instanceof Error ? createError.message : 'An error occurred while creating your account'}
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
