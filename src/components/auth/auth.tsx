'use client';
import { useState } from 'react';
import TextInput from '@/src/components/ui/text-input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createClient } from '@/src/utils/supabase/client';
import { Button } from '../ui/button';
import { Typography } from '../ui/typography';
import { useToast } from '../ui/toast';
type FormValues = {
  email: string;
};

type AuthProps = {
  text?: string;
};

export const Auth = ({ text }: AuthProps) => {
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { email } = data;

    const supabase = await createClient();

    setIsEmailSending(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        // TODO
        /*         emailRedirectTo: 'https://localhost:3000/signatures', */
        // email template redirectTo={{ .RedirectTo}}
      },
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to send email. Please try again.',
        variant: 'error',
        duration: 5000,
      });
    } else {
      setIsEmailSent(true);
    }

    setIsEmailSending(false);
  };

  if (isEmailSent) {
    return (
      <div className="flex flex-col py-4">
        <Typography variant="h4" className="leading-loose">
          Email sent
        </Typography>
        <Typography variant="body">
          Please check your e-mail for a verification link.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white p-4 pt-6">
      {text && (
        <Typography variant="h5" className="mb-4">
          {text}
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
        <TextInput
          label="Enter your e-mail"
          name="email"
          register={register}
          errors={formErrors}
          validation={{
            required: 'This field is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email',
            },
          }}
          placeholder="email@example.com"
        />

        <div className="w-full flex justify-end">
          <Button loading={isEmailSending} size="lg" type="submit">
            {isEmailSending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  );
};
