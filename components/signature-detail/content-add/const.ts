import { ContentType } from "@/const/content";
import { getExampleText } from "./utils";

// TODO - lokalizace a popisek?
export const CONTENT_TYPES = [
  {
    name: "Text",
    content: getExampleText(),
    type: ContentType.TEXT,
  },
];
