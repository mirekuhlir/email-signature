import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Header } from '@/src/components/header';
import { Container } from '@/src/components/ui/container';
import { Typography } from '@/src/components/ui/typography';
import { getIsPremium } from '@/src/utils/premium';

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const isPremium = await getIsPremium(user);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header user={user} />
      <main>
        <div className="pt-24">
          <Container>
            <div className="w-full">
              <Typography variant="h3">Account</Typography>
              <div className="mt-6 p-6 bg-white rounded-sm shadow-md">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Typography className="font-semibold">Email:</Typography>
                    <Typography>{user.email}</Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography className="font-semibold">
                      Premium Status:
                    </Typography>
                    <Typography>{isPremium ? 'Active' : 'Inactive'}</Typography>
                  </div>
                  {validFrom && (
                    <div className="flex items-center gap-2">
                      <Typography className="font-semibold">
                        Valid From:
                      </Typography>
                      <Typography>
                        {new Date(validFrom).toLocaleDateString()}
                      </Typography>
                    </div>
                  )}
                  {validTo && (
                    <div className="flex items-center gap-2">
                      <Typography className="font-semibold">
                        Valid To:
                      </Typography>
                      <Typography>
                        {new Date(validTo).toLocaleDateString()}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
}
