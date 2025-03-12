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
    content: "+1 212 555 4567",
    type: ContentType.PHONE,
  },
  {
    name: "Website",
    content: "www.example.com",
    type: ContentType.WEBSITE,
  },
];
