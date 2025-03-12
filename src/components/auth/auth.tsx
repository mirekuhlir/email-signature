'use client';
import { useState } from 'react';
import TextInput from '@/src/components/ui/text-input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createClient } from '@/src/utils/supabase/client';
import { Button } from '../ui/button';
import { Typography } from '../ui/typography';

type FormValues = {
  email: string;
};

export const Auth = () => {
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

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
        // email template redirectTo={{ .RedirectTo}}
        /*    emailRedirectTo: '', */
      },
    });

    if (error) {
      console.error(error);
    } else {
      setIsEmailSent(true);
    }

    setIsEmailSending(false);
  };

  if (isEmailSent) {
    return (
      <div className="flex flex-col p-4">
        <Typography variant="h4">Email sent</Typography>
        <Typography variant="body">
          Please check your e-mail for a verification link. Use this link to
          sign in.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6">
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

        <Button loading={isEmailSending} type="submit">
          {isEmailSending ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  );
};
