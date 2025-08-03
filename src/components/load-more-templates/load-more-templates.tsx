/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { EmailTemplateView } from '@/src/components/signature-detail/content-view/signature-view';
import { getTemplatesMainPage } from '@/src/templates';
import { Button } from '@/src/components/ui/button';
import StyledLink from '@/src/components/ui/styled-link';

interface LoadMoreTemplatesProps {
  initialTemplates: any[];
}

export function LoadMoreTemplates({
  initialTemplates,
}: LoadMoreTemplatesProps) {
  const [visibleTemplates, setVisibleTemplates] =
    useState<any[]>(initialTemplates);

  const allTemplates = getTemplatesMainPage();
  // Get templates that are not already shown initially
  const remainingTemplates = allTemplates.filter(
    (template) =>
      !initialTemplates.some(
        (initial) => initial.info?.templateSlug === template.info?.templateSlug,
      ),
  );

  const [loadedFromRemaining, setLoadedFromRemaining] = useState(0);
  const hasMore = loadedFromRemaining < remainingTemplates.length;

  const loadMore = () => {
    const nextBatch = remainingTemplates.slice(
      loadedFromRemaining,
      loadedFromRemaining + 3,
    );
    setVisibleTemplates((prev) => [...prev, ...nextBatch]);
    setLoadedFromRemaining((prev) => prev + 3);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 justify-items-center max-w-6xl mx-auto">
        {visibleTemplates.map((template, index) => (
          <div key={index}>
            <EmailTemplateView rows={template.rows} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMore} variant="brandBlue" size="lg">
            Show more
          </Button>
        </div>
      )}
      {!hasMore && (
        <div className="flex justify-center mt-8">
          <StyledLink variant="button-orange" size="lg" href="/signatures">
            Create your signature
          </StyledLink>
        </div>
      )}
    </div>
  );
}
