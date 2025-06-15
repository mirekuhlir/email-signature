import { Typography } from '../ui/typography';
import { Container } from '../ui/container';
import StyledLink from '../ui/styled-link';
import { UserStatus } from '@/src/utils/userState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrialBanner = (user: any) => {
  const isPremium = user.userStatus === UserStatus.PREMIUM;

  return (
    <Container>
      <div className="flex flex-col bg-orange-200 p-4 mb-8 rounded-lg">
        <Typography variant="large">Upgrade to full version</Typography>

        <Typography variant="body">
          If you are satisfied, you pay a one-time fee and your signatures will
          remain yours forever.
        </Typography>
        {!isPremium && (
          <div className="flex justify-end sm:justify-start">
            <StyledLink
              variant="button-brand-blue"
              href="/pricing"
              className="mt-4"
            >
              Upgrade to full version
            </StyledLink>
          </div>
        )}
      </div>
    </Container>
  );
};

export default TrialBanner;
