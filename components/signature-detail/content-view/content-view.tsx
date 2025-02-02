import { Img } from "@/components/ui/img";
import { ContentType } from "@/const/content";

export const getContentView = (content?: any) => {
  if (content.type == ContentType.IMAGE) {
    const { components } = content;

    return components.map((component: any, index: number) => {
      const { id, src } = component;
      return <Img key={id} src={src} />;
    });
  }

  if (content.type === ContentType.TEXT) {
    const { components } = content;

    return components.map((component: any) => {
      const { id, text, fontSize, textColor, letterSpacing, ...rest } =
        component;

      return (
        <span
          key={id}
          style={{
            display: "inline-block",
            width: "100%",
            fontSize: `${fontSize}px`,
            color: textColor,
            letterSpacing: `${letterSpacing}px`,
            ...rest,
          }}
        >
          {text}
        </span>
      );
    });
  }

  return null;
};
