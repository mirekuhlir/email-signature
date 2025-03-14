import { signature_a } from './signature_a';

export const templates = [signature_a];

export const getTemplateBySlug = (slug: string) => {
  return templates.find((template) => template.info.templateSlug === slug);
};
