"use client";
import TextInput from "@/components/ui/text-input";
import { useForm, SubmitHandler } from "react-hook-form";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";

export const SignInComponent = () => {
  type FormValues = {
    email: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const email = data.email;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        // email template redirectTo={{ .RedirectTo}}
        /*    emailRedirectTo: '', */
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <TextInput
          label="Email"
          name="email"
          register={register}
          errors={errors}
          validation={{
            required: "This field is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email",
            },
          }}
          placeholder="email@example.com"
        />

        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};
