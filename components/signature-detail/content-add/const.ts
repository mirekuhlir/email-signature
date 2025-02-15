import { ContentType } from "@/const/content";
import { getExampleText, getImage } from "./utils";

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
];
