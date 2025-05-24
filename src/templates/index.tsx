import { signature_a } from './signature_a';
import { signature_b } from './signature_b';
import { signature_c } from './signature_c';
import { signature_d } from './signature_d';
import { signature_e } from './signature_e';
import { signature_f } from './signature_f';
import { signature_empty_one_columns } from './signature_empty_one_columns';
import { signature_empty_two_columns } from './signature_empty_two_columns';

export const getTemplates = () => {
  return [
    signature_a(),
    signature_b(),
    signature_c(),
    signature_d(),
    signature_e(),
    signature_f(),
    signature_empty_one_columns(),
    signature_empty_two_columns(),
  ];
};

export const getTemplateBySlug = (slug: string) => {
  return getTemplates().find(
    (template) => template?.info?.templateSlug === slug,
  );
};
