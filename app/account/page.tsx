import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Typography } from '@/src/components/ui/typography';
import { getUserStatus, UserStatus } from '@/src/utils/userState';
import StyledLink from '@/src/components/ui/styled-link';
import { PageLayout } from '@/src/components/layout/page';

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const validFrom = user.app_metadata.premium?.validFrom;
  const validTo = user.app_metadata.premium?.validTo;

  const userStatus = await getUserStatus(user);

  return (
    <PageLayout user={user} title="Account">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Typography className="font-semibold">Email:</Typography>
          <Typography>{user.email}</Typography>
        </div>
        <div className="flex items-center gap-2">
          <Typography className="font-semibold">Full version:</Typography>
          <Typography>
            {userStatus === UserStatus.PREMIUM ? 'Active' : 'Inactive'}
          </Typography>
        </div>
        {userStatus === UserStatus.TRIAL && (
          <div className="flex justify-end sm:justify-start">
            <StyledLink
              variant="button-orange"
              href="/pricing"
              className="mt-4 min-w-40"
            >
              Buy Full Version
            </StyledLink>
          </div>
        )}
        {validFrom && (
          <div className="flex items-center gap-2">
            <Typography className="font-semibold">Valid From:</Typography>
            <Typography>{new Date(validFrom).toLocaleDateString()}</Typography>
          </div>
        )}
        {validTo && (
          <div className="flex items-center gap-2">
            <Typography className="font-semibold">Valid To:</Typography>
            <Typography>{new Date(validTo).toLocaleDateString()}</Typography>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
