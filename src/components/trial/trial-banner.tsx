import { Typography } from '../ui/typography';
import { Container } from '../ui/container';
import { TRIAL_LENGTH_IN_DAYS } from '@/supabase/functions/_shared/const';
import StyledLink from '../ui/styled-link';

// Function to calculate remaining trial days
const calculateRemainingTrialDays = (emailConfirmedAt: string): number => {
  if (!emailConfirmedAt) {
    return TRIAL_LENGTH_IN_DAYS;
  }

  const confirmedDate = new Date(emailConfirmedAt);
  const currentDate = new Date();
  const trialEndDate = new Date(confirmedDate);

  // Add TRIAL_LENGTH_IN_DAYS days to the confirmed date
  trialEndDate.setDate(confirmedDate.getDate() + TRIAL_LENGTH_IN_DAYS);

  // Calculate difference in milliseconds
  const timeDifference = trialEndDate.getTime() - currentDate.getTime();

  // Convert to days and round up
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Return 0 if trial has expired, otherwise return remaining days
  return Math.max(0, daysDifference);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrialBanner = (user: any) => {
  // Calculate remaining trial days
  const remainingTrialDays = calculateRemainingTrialDays(
    user?.email_confirmed_at,
  );

  return (
    <Container>
      <div className="flex flex-col bg-orange-200 p-4 mb-8 rounded-lg">
        {remainingTrialDays === 0 && (
          <Typography variant="large">Your trial has expired.</Typography>
        )}

        <Typography variant="large">Try all features for free</Typography>

        <Typography variant="body">
          If you are satisfied, you pay a one-time fee and your signatures will
          remain yours forever.
        </Typography>
        {remainingTrialDays >= 0 && (
          <div className="flex justify-end sm:justify-start">
            <StyledLink
              variant="button-brand-blue"
              href="/pricing"
              className="mt-4"
            >
              Upgrade to premium
            </StyledLink>
          </div>
        )}
      </div>
    </Container>
  );
};

export default TrialBanner;
