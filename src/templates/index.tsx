import { signature_a } from './signature_a';
import { signature_b } from './signature_b';
import { signature_c } from './signature_c';
import { signature_empty_one_columns } from './signature_empty_one_columns';
import { signature_empty_two_columns } from './signature_empty_two_columns';

export const templates = [
  signature_a,
  signature_b,
  signature_c,
  signature_empty_one_columns,
  signature_empty_two_columns,
];

export const getTemplateBySlug = (slug: string) => {
  return templates.find((template) => template?.info?.templateSlug === slug);
};
