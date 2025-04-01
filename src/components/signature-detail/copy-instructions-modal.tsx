import { Typography } from '@/src/components/ui/typography';

// TODO - kopírovat mohou jen uživatele s premium účtem
export const CopyInstructionsModalContent = () => {
  return (
    <div className="py-4 space-y-6">
      <div className="space-y-1">
        <Typography variant="h3" textColor="text-gray-700">
          Your signature has been copied to clipboard!
        </Typography>
        <Typography variant="large" textColor="text-gray-700">
          Here&apos;s what to do next:
        </Typography>
      </div>

      <div className="space-y-2 p-4 bg-gray-100 rounded-lg">
        <Typography variant="body" weight="bold" textColor="text-gray-800">
          Gmail:
        </Typography>
        <Typography variant="body" textColor="text-gray-700">
          1. Open Gmail and go to Settings (gear icon) → See all settings
        </Typography>
        <Typography variant="body" textColor="text-gray-700">
          2. In the &quot;General&quot; tab, scroll to the &quot;Signature&quot;
          section
        </Typography>
        <Typography variant="body" textColor="text-gray-700">
          3. Create a new signature or edit an existing one
        </Typography>
        <Typography variant="body" textColor="text-gray-700">
          4. Paste your signature and click &quot;Save Changes&quot; at the
          bottom
        </Typography>
      </div>

      <div className="space-y-2 p-4 bg-gray-100 rounded-lg">
        <Typography variant="body" weight="bold" textColor="text-gray-800">
          Outlook:
        </Typography>
        <Typography variant="body" textColor="text-gray-700">
          1. Open Outlook and go to File → Options → Mail → Signatures
        </Typography>
        <Typography variant="body" textColor="text-gray-700">
          2. Select &quot;New&quot; or edit an existing signature
        </Typography>
        <Typography variant="body" textColor="text-gray-700">
          3. Paste your signature and click &quot;OK&quot;
        </Typography>
      </div>

      <div className="space-y-2 p-4 bg-gray-100 rounded-lg">
        <Typography variant="body" weight="bold" textColor="text-gray-800">
          Apple Mail:
        </Typography>
        <Typography variant="body" textColor="text-gray-700">
          1. Open Mail and go to Mail → Settings → Signatures
        </Typography>
        <Typography variant="body" textColor="text-gray-700">
          2. Create a new signature or select an existing one
        </Typography>
        <Typography variant="body" textColor="text-gray-700">
          3. Paste your signature and close the preferences window
        </Typography>
      </div>
    </div>
  );
};

export default CopyInstructionsModalContent;
