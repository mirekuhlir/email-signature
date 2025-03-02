'use client';
import { EmailTemplateView } from './signature-detail/content-view/signature-view';
import { templates } from '@/templates';
import { Container } from './ui/container';
import StyledLink from './ui/styled-link';

export const TemplatesExamples = () => {
  return (
    <Container>
      {templates.map((template, index) => (
        <div key={index}>
          <EmailTemplateView rows={template.rows} />
          <StyledLink
            variant="button-blue"
            href={`/signatures/example/?template=${template.templateSlug}`}
          >
            Select
          </StyledLink>
        </div>
      ))}
    </Container>
  );
};
