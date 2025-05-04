import { ContentType } from "@/src/const/content";
import {
  getCustomValueTextExample,
  getEmailTextExample,
  getExampleText,
  getPhoneTextExample,
  getWebsiteTextExample,
} from "./utils";

export const CONTENT_TYPES = [
  {
    name: "text",
    content: getExampleText(),
    type: ContentType.TEXT,
  },
  {
    name: "image",
    content: "image",
    type: ContentType.IMAGE,
  },
  {
    name: "e-mail",
    content: `${getEmailTextExample().prefix}${getEmailTextExample().email}`,
    type: ContentType.EMAIL,
  },
  {
    name: "phone",
    content: `${getPhoneTextExample().prefix}${getPhoneTextExample().phone}`,
    type: ContentType.PHONE,
  },
  {
    name: "website",
    content:
      `${getWebsiteTextExample().prefix}${getWebsiteTextExample().website}`,
    type: ContentType.WEBSITE,
  },
  {
    name: "custom Value",
    content:
      `${getCustomValueTextExample().prefix}${getCustomValueTextExample().value}`,
    type: ContentType.CUSTOM_VALUE,
  },
];
