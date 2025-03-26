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
    name: "Text",
    content: getExampleText(),
    type: ContentType.TEXT,
  },
  {
    name: "Image",
    content: "Image",
    type: ContentType.IMAGE,
  },
  {
    name: "E-mail",
    content: `${getEmailTextExample().prefix}${getEmailTextExample().email}`,
    type: ContentType.EMAIL,
  },
  {
    name: "Phone",
    content: `${getPhoneTextExample().prefix}${getPhoneTextExample().phone}`,
    type: ContentType.PHONE,
  },
  {
    name: "Website",
    content:
      `${getWebsiteTextExample().prefix}${getWebsiteTextExample().website}`,
    type: ContentType.WEBSITE,
  },
  {
    name: "Custom Value",
    content:
      `${getCustomValueTextExample().prefix}${getCustomValueTextExample().value}`,
    type: ContentType.CUSTOM_VALUE,
  },
];
