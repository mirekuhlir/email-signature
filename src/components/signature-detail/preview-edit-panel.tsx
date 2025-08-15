import { UserStatus } from '@/src/utils/userState';
import { Container } from '../ui/container';
import EditPanel from './edit-panel';
import { UseSignature } from './use-signature';
import { usePreviewModal } from './preview-action-panel';
import { Button } from '../ui/button';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/src/constants/mediaQueries';

const PreviewEditPanel = ({
  isSavingOrder,
  isSignedIn,
  userStatus,
}: {
  isSavingOrder: boolean;
  isSignedIn: boolean;
  userStatus: UserStatus;
}) => {
  const isMobile = useMediaQuery(MEDIA_QUERIES.MOBILE);
  const { showPreview } = usePreviewModal(isSignedIn, userStatus);

  return (
    <EditPanel>
      <Container>
        <div className="flex justify-end sm:justify-start sm:gap-8 flex-row ">
          <UseSignature
            isSavingOrder={isSavingOrder}
            isSignedIn={isSignedIn}
            userStatus={userStatus}
          />
          {isMobile && (
            <div className="ml-4">
              <Button variant="outline" onClick={showPreview}>
                Preview
              </Button>
            </div>
          )}
        </div>
      </Container>
    </EditPanel>
  );
};

export default PreviewEditPanel;
