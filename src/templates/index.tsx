import { signature_a } from './signature_a';
import { signature_empty } from './signature_empty';

export const templates = [signature_a, signature_empty];

export const getTemplateBySlug = (slug: string) => {
  return templates.find((template) => template?.info?.templateSlug === slug);
};
