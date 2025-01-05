import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Typography } from "@/components/ui/typography";
import { Header } from "@/components/header/header";

export default async function Signatures() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-grow w-full pt-16">
        <Typography variant="h1">Signatures</Typography>
      </main>
    </div>
  );
}
