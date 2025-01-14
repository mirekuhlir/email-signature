import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/header/header";
import { SignaturesList } from "@/components/signatures-list/signatures-list";

export default async function Signatures() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  let { data } = await supabase
    .from("signatures")
    .select("*")
    .eq("user_id", user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header user={user} />
      <main className="flex-grow w-full pt-16">
        <SignaturesList signatures={data} />;
      </main>
    </div>
  );

  return;
}
