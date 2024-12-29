import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "./design-system/button";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button size="sm" variant="outline">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button size="sm">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
