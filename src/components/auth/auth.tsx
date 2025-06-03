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
  title?: string;
  description?: string;
};

export const Auth = ({ title, description }: AuthProps) => {
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState('');

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
        data: {
          language: 'en',
        },
        /*         emailRedirectTo: 'https://localhost:3000/signatures', */
      },
    });

    setEmail(email);

    if (error) {
      toast({
        title: 'Error',
        description:
          'Failed to send e-mail. Please try again a few minutes later.',
        variant: 'error',
        duration: 0,
      });
    } else {
      setIsEmailSent(true);
    }

    setIsEmailSending(false);
  };

  return (
    <div className="flex flex-col bg-white pt-4 min-h-[250px]">
      {isEmailSent ? (
        <div className="flex flex-col justify-center items-center flex-1">
          <Typography
            variant="h4"
            className="leading-loose"
            textColor="text-brand-blue-900"
          >
            E-mail sent
          </Typography>
          <Typography variant="body">
            Please check your e-mail <span className="font-bold">{email}</span>{' '}
            for a sign in link.
          </Typography>
        </div>
      ) : (
        <>
          {title && (
            <Typography
              variant="h4"
              className="leading-loose"
              textColor="text-brand-blue-900"
            >
              {title}
            </Typography>
          )}
          {description && (
            <Typography variant="body" className="mb-4">
              {description}
            </Typography>
          )}
          <div className="flex flex-col justify-center  flex-1">
            {!title && (
              <Typography variant="h5" className="mb-4">
                Please enter your e-mail to sign in.
              </Typography>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
              <TextInput
                isAutoFocus={true}
                label="E-mail"
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
        </>
      )}
    </div>
  );
};
