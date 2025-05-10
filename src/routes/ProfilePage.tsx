import { useUserContext } from '@/contexts/UserContext';
import { MainContent } from '@/components/MainContent';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UpdateUserSchema, type UpdateUserDto } from '@/interfaces/user.interface';
import { LoadingButton } from '@/components/LoadingButton';
import { toast } from 'sonner';
import { InfoIcon } from 'lucide-react';
import AvatarSelector from '@/components/profile/AvatarSelector';
import { cn } from '@/lib/utils';
import { ApiEndPoints } from '@/constants/apiEndpoints';
import axiosConfig from '@/api/axiosConfig';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, refetchUser } = useUserContext();
  const [isPending, setIsPending] = useState(false);
  const form = useForm<UpdateUserDto>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      userId: user?.userId || '',
      auth0Id: user?.auth0Id || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      profilePicture: user?.profilePicture || null,
    },
  });

  const onSubmit = async (values: UpdateUserDto) => {
    setIsPending(true);
    if (!user) {
      toast.error('User not found');
      console.error('User not found');
      setIsPending(false);
      return;
    }

    try {
      await axiosConfig.put(ApiEndPoints.UPDATE_USER, {
        ...values,
        userId: user.userId,
        auth0Id: user.auth0Id,
        email: user.email,
      });
      toast.success('Profile updated successfully');
      refetchUser();
      setIsPending(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
      setIsPending(false);
    }
  };

  if (!user) {
    return (
      <MainContent>
        <div className="flex items-center justify-center h-full">
          <p>Loading user data...</p>
        </div>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <div className="max-w-2xl mx-auto py-8">
        <div className="p-[2px] border border-border rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md">
          <div className="rounded-[calc(0.75rem-1px)] bg-background p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center font-heading">Profile Settings</h2>

            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex gap-2 items-start">
                <InfoIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm">Update your profile information below.</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium font-heading">Profile Picture</label>
                  <AvatarSelector
                    initialImage={user.profilePicture || undefined}
                    selected={form.watch('profilePicture')}
                    onChange={(url) => form.setValue('profilePicture', url, { shouldValidate: true })}
                    seed={user.email}
                  />
                  {form.formState.errors.profilePicture && (
                    <p className="text-sm text-destructive">{form.formState.errors.profilePicture.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium font-heading">
                    Email
                  </label>
                  <Input id="email" type="email" value={user.email} className="bg-muted" readOnly disabled />
                  <p className="text-xs text-muted-foreground">
                    Email address is provided by your authentication provider
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium font-heading">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    className={cn(form.formState.errors.firstName && 'border-destructive')}
                    {...form.register('firstName')}
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium font-heading">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    className={cn(form.formState.errors.lastName && 'border-destructive')}
                    {...form.register('lastName')}
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                  )}
                </div>

                <LoadingButton
                  isLoading={isPending}
                  loadingText="Saving..."
                  defaultText="Save Changes"
                  type="submit"
                  className="w-full font-heading"
                />
              </form>
            </Form>
          </div>
        </div>
      </div>
    </MainContent>
  );
}
