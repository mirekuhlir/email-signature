import { Typography } from '../ui/typography';
import { Container } from '../ui/container';
import StyledLink from '../ui/styled-link';
import { getUserStatus, UserStatus } from '@/src/utils/userState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrialBanner = (user: any) => {
  const userStatus = getUserStatus(user);

  if (userStatus === UserStatus.PREMIUM) {
    return null;
  }

  console.warn('userStatus', userStatus);

  return (
    <Container>
      <div className="flex flex-col bg-orange-200 p-4 mb-8 rounded-lg">
        <Typography variant="large">Upgrade to full version</Typography>

        <Typography variant="body">
          You are using the free version of the app. If you are satisfied, you
          pay a one-time fee and your signatures will remain yours forever.
        </Typography>

        <div className="flex justify-end sm:justify-start">
          <StyledLink
            variant="button-brand-blue"
            href="/pricing"
            className="mt-4"
          >
            Upgrade to full version
          </StyledLink>
        </div>
      </div>
    </Container>
  );
};

export default TrialBanner;
