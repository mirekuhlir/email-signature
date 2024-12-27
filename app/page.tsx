import AuthButton from "@/components/header-auth";

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <AuthButton />
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        Index
      </main>
    </>
  );
}
