import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { CreateUserDto, CreateUserSchema } from '@/interfaces/user.interface';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
export function Signup() {
  const { useCreateUser } = useUser();
  const { mutate: createUser, isPending, error } = useCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserDto>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      auth0Id: 'test',
    },
  });

  const onSubmit = async (data: CreateUserDto) => {
    console.log('data', data);
    createUser(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...register('email')}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="first_name" className="text-sm font-medium">
            First Name
          </label>
          <input
            id="first_name"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...register('firstName')}
          />
          {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="last_name" className="text-sm font-medium">
            Last Name
          </label>
          <input
            id="last_name"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...register('lastName')}
          />
          {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Sign Up'}
        </Button>

        {error && (
          <div className="p-3 mt-4 text-sm rounded-md bg-red-50 text-red-600 border border-red-200">
            {error instanceof Error ? error.message : 'An error occurred'}
          </div>
        )}
      </form>
    </div>
  );
}

export default Signup;
