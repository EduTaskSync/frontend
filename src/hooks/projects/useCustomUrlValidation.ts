import { projectFormValues } from '@/utils/projectSchema';
import { useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

export const useCustomUrlValidation = (form: UseFormReturn<projectFormValues>) => {
  const { control, setError, clearErrors, formState } = form;
  // useWatch() only re-renders the specific field when it changes instead of the whole form
  const imageSource = useWatch({ control, name: 'projectImageSource' });
  const customImageUrl = useWatch({ control, name: 'customImageUrl' });

  // use a separate effect to validate custom image URL
  // this provides instant feedback as the user types instead of after the form has been submitted
  useEffect(() => {
    if (imageSource === 'custom' && customImageUrl && !customImageUrl.startsWith('https')) {
      setError('customImageUrl', {
        // type can be any string: it's an error instance identifier
        // helps react hook form realize that this error was set by the user and not mess with the schema validation logic
        type: 'manual',
        message: 'Please enter a valid URL starting with https://',
      });
    }

    // React Hook Form does not clear manual errors automatically even if they resolved; so clear manually
    // check if the customImageUrl field currently has a custom error with the type "manual"
    else if (formState.errors.customImageUrl?.type === 'manual') {
      clearErrors('customImageUrl');
    }
  }, [imageSource, customImageUrl, setError, clearErrors, formState.errors.customImageUrl?.type]);

  return { imageSource, customImageUrl };
};
