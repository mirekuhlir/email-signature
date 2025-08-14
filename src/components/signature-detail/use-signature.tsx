import { UserStatus } from '@/src/utils/userState';
import { Button } from '../ui/button';
import { useModal } from '../ui/modal-system';
import { copySignatureToClipboard } from './content-view/utils';

import CopyInstructionsModalContent from './copy-instructions-modal';
import { useAuthModal } from '@/src/hooks/useAuthModal';

type UseSignatureProps = {
  isSavingOrder: boolean;
  isSignedIn: boolean;
  userStatus: UserStatus;
};

export const UseSignature = ({
  isSavingOrder,
  isSignedIn,
  userStatus,
}: UseSignatureProps) => {
  const { modal } = useModal();

  const showCopyInstructionsModal = () => {
    modal({
      content: <CopyInstructionsModalContent />,
      size: 'fullscreen',
      isZeroPadding: true,
    });
  };

  const { showAuthModal } = useAuthModal();

  return (
    <>
      <Button
        size="md"
        variant="blue"
        buttonClassName="min-w-35"
        disabled={isSavingOrder}
        onClick={() => {
          if (isSignedIn) {
            copySignatureToClipboard(userStatus, () => {
              showCopyInstructionsModal();
            });
          } else {
            showAuthModal({
              title: 'Sign in to use your signature',
              description:
                'To use your signature in email, you need to sign up first.',
            });
          }
        }}
      >
        Use signature
      </Button>
    </>
  );
};
