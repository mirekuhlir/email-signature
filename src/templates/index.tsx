import { signature_a } from './signature_a';
import { signature_b } from './signature_b';
import { signature_c } from './signature_c';
import { signature_d } from './signature_d';
import { signature_e } from './signature_e';
import { signature_f } from './signature_f';
import { signature_g } from './signature_g';
import { signature_h } from './signature_h';
import { signature_i } from './signature_i';
import { signature_j } from './signature_j';
import { signature_k } from './signature_k';
import { signature_l } from './signature_l';
import { signature_empty_one_columns } from './signature_empty_one_columns';
import { signature_empty_two_columns } from './signature_empty_two_columns';

export const getTemplates = () => {
  return [
    signature_empty_one_columns(),
    signature_empty_two_columns(),
    signature_i(),
    signature_a(),
    signature_d(),
    signature_b(),
    signature_c(),
    signature_e(),
    signature_f(),
    signature_g(),
    signature_h(),
    signature_j(),
    signature_k(),
    signature_l(),
  ];
};

export const getTemplatesMainPage = () => {
  return [
    signature_i(),
    signature_a(),
    signature_d(),
    signature_b(),
    signature_e(),
    signature_f(),
    signature_c(),
    signature_j(),
    signature_g(),
    signature_h(),
    signature_k(),
    signature_l(),
  ];
};

export const getTemplateBySlug = (slug: string) => {
  const template = getTemplates().find(
    (template) => template?.info?.templateSlug === slug,
  );
  if (!template) {
    return signature_empty_one_columns();
  }

  return template;
};

export const templatesSlugs = [
  'signature-a',
  'signature-b',
  'signature-c',
  'signature-d',
  'signature-e',
  'signature-f',
  'signature-g',
  'signature-h',
  'signature-i',
  'signature-j',
  'signature-k',
  'signature-empty-one-columns',
  'signature-empty-two-columns',
];
