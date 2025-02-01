import { ContentType } from "@/const/content";
import { getExampleText } from "./utils";

export const CONTENT_TYPES = [
  {
    name: "Text",
    content: getExampleText(),
    type: ContentType.TEXT,
  },
];
