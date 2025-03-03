import { SignInComponent } from '@/src/components/signin';

export default async function Signin() {
  return (
    <>
      <h1 className="text-2xl font-medium">Sign in</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <SignInComponent />
      </div>
      {/*  TODO - nabídnout možnost uživateli, aby si mohl zkusit aplikaci i bez přihlášení  */}
    </>
  );
}
