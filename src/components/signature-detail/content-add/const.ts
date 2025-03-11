import { ContentType } from "@/src/const/content";
import { getExampleText } from "./utils";

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
    content: "example@email.com",
    type: ContentType.EMAIL,
  },
  {
    name: "Phone",
    content: "+420 123 456 789",
    type: ContentType.PHONE,
  },
];
