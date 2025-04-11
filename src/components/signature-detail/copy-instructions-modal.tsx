import { Typography } from '@/src/components/ui/typography';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';

type EmailClient = 'gmail' | 'outlook' | 'apple-mail';

// TODO - kopírovat mohou jen uživatele s premium účtem
export const CopyInstructionsModalContent = () => {
  const [selectedClient, setSelectedClient] = useState<EmailClient>('gmail');

  const instructions: Record<EmailClient, { title: string; steps: string[] }> =
    {
      gmail: {
        title: 'Gmail',
        steps: [
          'Open Gmail and go to Settings (gear icon) → See all settings',
          'In the "General" tab, scroll to the "Signature" section',
          'Create a new signature or edit an existing one',
          'Paste your signature and click "Save Changes" at the bottom',
        ],
      },
      outlook: {
        title: 'Outlook',
        steps: [
          'Open Outlook and go to File → Options → Mail → Signatures',
          'Select "New" or edit an existing signature',
          'Paste your signature and click "OK"',
        ],
      },
      'apple-mail': {
        title: 'Apple Mail',
        steps: [
          'Open Mail and go to Mail → Settings → Signatures',
          'Create a new signature or select an existing one',
          'Paste your signature and close the preferences window',
        ],
      },
    };

  const currentInstructions = instructions[selectedClient];

  return (
    <div className="py-4 space-y-6">
      <div className="space-y-1">
        <Typography variant="h3" textColor="text-gray-700">
          Your signature has been copied to clipboard!
        </Typography>
        <Typography variant="large" textColor="text-gray-700">
          Follow these steps for your email client:
        </Typography>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 pb-2 mb-4">
        {(Object.keys(instructions) as EmailClient[]).map((clientKey) => (
          <Button
            key={clientKey}
            variant={selectedClient === clientKey ? 'blue' : 'outline'}
            onClick={() => setSelectedClient(clientKey)}
            size="md"
          >
            {instructions[clientKey].title}
          </Button>
        ))}
      </div>

      {currentInstructions && (
        <div className="space-y-2 p-4 bg-gray-100 rounded-lg">
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
