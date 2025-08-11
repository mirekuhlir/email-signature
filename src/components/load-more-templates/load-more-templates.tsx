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
  const [allLoaded, setAllLoaded] = useState(false);
  const hasMore = !allLoaded && remainingTemplates.length > 0;

  const loadMore = () => {
    setVisibleTemplates((prev) => [...prev, ...remainingTemplates]);
    setAllLoaded(true);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 max-w-6xl mx-auto items-end">
        {visibleTemplates.map((template, index) => (
          <div key={index} className="flex flex-col items-center">
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
