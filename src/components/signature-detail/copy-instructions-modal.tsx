import { Typography } from '@/src/components/ui/typography';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { EmailIos } from '@/src/icons/EmailiOS';

type EmailClient = 'gmail' | 'outlook' | 'apple-mail';

// TODO - kopírovat mohou jen uživatele s premium účtem
export const CopyInstructionsModalContent = () => {
  const [selectedClient, setSelectedClient] = useState<EmailClient | null>(
    null,
  );

  const instructions: Record<
    EmailClient,
    { title: string; steps: string[]; icon: React.ReactNode }
  > = {
    gmail: {
      title: 'Gmail',
      steps: [
        'Open Gmail and go to Settings (gear icon) → See all settings',
        'In the "General" tab, scroll to the "Signature" section',
        'Create a new signature or edit an existing one',
        'Paste your signature and click "Save Changes" at the bottom',
      ],
      icon: <EmailIos />,
    },
    outlook: {
      title: 'Outlook',
      steps: [
        'Open Outlook and go to File → Options → Mail → Signatures',
        'Select "New" or edit an existing signature',
        'Paste your signature and click "OK"',
      ],
      icon: <EmailIos />,
    },
    'apple-mail': {
      title: 'Apple Mail',
      steps: [
        'Open Mail and go to Mail → Settings → Signatures',
        'Create a new signature or select an existing one',
        'Paste your signature and close the preferences window',
      ],
      icon: <EmailIos />,
    },
  };

  const currentInstructions = selectedClient
    ? instructions[selectedClient]
    : null;

  return (
    <div className="py-4 space-y-6">
      <div className="space-y-4">
        <Typography variant="h4" textColor="text-gray-700">
          Your signature has been copied to clipboard!
        </Typography>
        <Typography variant="large" textColor="text-gray-700">
          Select your email client:
        </Typography>
      </div>

      <div className="inline-flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
        {(Object.keys(instructions) as EmailClient[]).map((clientKey) => (
          <div key={clientKey}>
            <Button
              variant="modalTab"
              selected={selectedClient === clientKey}
              onClick={() => setSelectedClient(clientKey)}
              size="modalTab"
              buttonClassName="justify-start"
            >
              <div className="flex items-center p-2">
                <div className="mr-1">{instructions[clientKey].icon}</div>
                <div>{instructions[clientKey].title}</div>
              </div>
            </Button>
          </div>
        ))}
      </div>

      {currentInstructions && (
        <div className="space-y-2 p-4 bg-gray-100 rounded-lg mt-4">
          <Typography variant="h4" weight="bold" textColor="text-gray-800">
            {currentInstructions.title}:
          </Typography>
          {currentInstructions.steps.map((step, index) => (
            <Typography key={index} variant="body" textColor="text-gray-700">
              {index + 1}. {step}
            </Typography>
          ))}
        </div>
      )}
    </div>
  );
};

export default CopyInstructionsModalContent;
