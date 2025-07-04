import { ContentType } from '@/src/const/content';
import {
  getCustomValueTextExample,
  getEmailTextExample,
  getExampleText,
  getPhoneTextExample,
  getWebsiteTextExample,
} from './utils';

export const CONTENT_TYPES = [
  {
    name: 'text',
    description: 'Can be name, title, company, department, slogan, etc.',
    content: getExampleText(),
    type: ContentType.TEXT,
  },
  {
    name: 'image',
    description: 'Can be photo, logo, avatar, banner, icon, etc.',
    content: 'image',
    type: ContentType.IMAGE,
  },
  {
    name: 'email',
    description: 'Any email address (e.g. john@company.com).',
    content: `${getEmailTextExample().prefix}${getEmailTextExample().email}`,
    type: ContentType.EMAIL,
  },
  {
    name: 'phone',
    description: 'Any phone number (e.g. +1 123 456 7890).',
    content: `${getPhoneTextExample().prefix}${getPhoneTextExample().phone}`,
    type: ContentType.PHONE,
  },
  {
    name: 'website',
    description:
      'Any website or link (e.g. company website, Instagram, LinkedIn, Facebook, etc.).',
    content: `${getWebsiteTextExample().prefix}${getWebsiteTextExample().website}`,
    type: ContentType.WEBSITE,
  },
  {
    name: 'text with prefix',
    description:
      'Text that consists of two parts. Each part can have its own style (color, font size, font weight, etc.). For example, your name and position on one line, each in a different color.',
    content: `${getCustomValueTextExample().prefix}${getCustomValueTextExample().value}`,
    type: ContentType.CUSTOM_VALUE,
  },
];
