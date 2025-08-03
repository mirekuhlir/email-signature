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

  return (
    <div>
      <Container>
        <div className="flex flex-col bg-orange-200 p-4 mb-8 rounded-lg w-fit">
          <Typography variant="large">Upgrade to full version</Typography>

          <Typography variant="body">
            Pay once and use all signatures without limitations. All your
            signatures will remain yours forever.
          </Typography>

          <div className="flex justify-end">
            <StyledLink
              variant="button-orange"
              href="/pricing"
              className="mt-4 min-w-40"
              size="md"
            >
              Buy
            </StyledLink>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TrialBanner;
