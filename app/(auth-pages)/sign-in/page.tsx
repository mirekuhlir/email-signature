import { Auth } from '@/src/components/auth/auth';

export default async function Signin() {
  return (
    <>
      <h1 className="text-2xl font-medium">Sign in</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Auth />
      </div>
    </>
  );
}
