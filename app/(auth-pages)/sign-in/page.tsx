import Link from "next/link";
import { SignInComponent } from "@/components/signin/signin";

export default async function Signin() {
  return (
    <>
      <h1 className="text-2xl font-medium">Sign in</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <SignInComponent />
      </div>
    </>
  );
}
