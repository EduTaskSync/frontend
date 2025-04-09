import { projectFormValues } from '@/utils/projectSchema';
import { Control } from 'react-hook-form';
import { FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { defaultGroupIcons } from '@/constants/general';

export const DefaultProjectImagesTab = ({ control }: { control: Control<projectFormValues> }) => {
  return (
    <FormField
      control={control}
      name="predefinedImage"
      render={({ field }) => (
        <div className="grid grid-cols-4 gap-3">
          {defaultGroupIcons.map((icon) => (
            <div
              key={icon.value}
              onClick={() => field.onChange(icon.value)}
              className={cn(
                'cursor-pointer rounded-md overflow-hidden border-2 transition-all',
                field.value === icon.value
                  ? 'border-primary ring-2 ring-purple-300'
                  : 'border-border hover:border-purple-300/80'
              )}
            >
              <img src={icon.src} alt={icon.alt} className="w-full h-16 object-cover" />
            </div>
          ))}
        </div>
      )}
    />
  );
};
