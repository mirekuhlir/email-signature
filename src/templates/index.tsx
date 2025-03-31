import { signature_a } from './signature_a';
import { signature_empty } from './signature_empty';
import { signature_empty_two_columns } from './signature_empty_two_columns';

export const templates = [
  signature_a,
  signature_empty,
  signature_empty_two_columns,
];

export const getTemplateBySlug = (slug: string) => {
  return templates.find((template) => template?.info?.templateSlug === slug);
};
