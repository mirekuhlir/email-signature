import { Typography } from '@/src/components/ui/typography';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Container } from '../ui/container';
import gmail from '@/src/asset/email-clients/gmail.png';
import outlook from '@/src/asset/email-clients/outlook.png';
import appleMail from '@/src/asset/email-clients/apple_mail.png';
import { StaticImageData } from 'next/image';

import Image from 'next/image';

type EmailClient = 'gmail' | 'outlook' | 'apple-mail';

interface InstructionItem {
  key: EmailClient;
  title: string;
  steps: string[];
  icon: StaticImageData;
}

// TODO - kopírovat mohou jen uživatele s premium účtem
export const CopyInstructionsModalContent = () => {
  const [selectedClient, setSelectedClient] = useState<EmailClient | null>(
    null,
  );

  const instructions: InstructionItem[] = [
    {
      key: 'gmail',
      title: 'Gmail',
      steps: [
        'Open Gmail and go to Settings (gear icon) → See all settings',
        'In the "General" tab, scroll to the "Signature" section',
        'Create a new signature or edit an existing one',
        'Paste your signature and click "Save Changes" at the bottom',
      ],
      icon: gmail,
    },
    {
      key: 'outlook',
      title: 'Outlook',
      steps: [
        'Open Outlook and go to File → Options → Mail → Signatures',
        'Select "New" or edit an existing signature',
        'Paste your signature and click "OK"',
      ],
      icon: outlook,
    },
    {
      key: 'apple-mail',
      title: 'Apple Mail',
      steps: [
        'Open Mail and go to Mail → Settings → Signatures',
        'Create a new signature or select an existing one',
        'Paste your signature and close the preferences window',
      ],
      icon: appleMail,
    },
  ];

  const currentInstructions = instructions.find(
    (instruction) => instruction.key === selectedClient,
  );

  return (
    <Container>
      <div className="py-4">
        <div className="space-y-5">
          <div className="flex justify-center text-center">
            <Typography variant="h4" textColor="text-brand-blue-900">
              Your signature has been copied to clipboard!
            </Typography>
          </div>
          <div className="mb-3 flex justify-center">
            <Typography variant="large" textColor="text-gray-700">
              Select your email client:
            </Typography>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3">
          {instructions.map((instruction) => (
            <div key={instruction.key}>
              <Button
                variant="modalTab"
                selected={selectedClient === instruction.key}
                onClick={() => setSelectedClient(instruction.key)}
                size="modalTab"
                buttonClassName="justify-start"
              >
                <div className="flex items-center p-2">
                  <div className="mr-2">
                    <Image
                      src={instruction.icon}
                      alt={instruction.title}
                      width={36}
                      height={36}
                    />
                  </div>
                  <div>{instruction.title}</div>
                </div>
              </Button>
            </div>
          ))}
        </div>

        {currentInstructions && (
          <div className="space-y-2 p-4 bg-gray-100 rounded-lg mt-4">
            <Typography variant="large" weight="bold" textColor="text-gray-800">
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
    </Container>
  );
};

export default CopyInstructionsModalContent;
