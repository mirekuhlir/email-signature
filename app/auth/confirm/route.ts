import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  // The `/auth/confirm` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      // TODO - nebude potřeba možná emailRedirectTo
      /*  redirect("/signatures"); */
      redirect(next);
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
