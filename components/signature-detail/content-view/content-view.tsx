import { Img } from "@/components/ui/img";
import { ContentType } from "@/const/content";

export const getContentView = (content?: any) => {
  if (content.type == ContentType.IMAGE) {
    const { components } = content;

    return components.map((component: any, index: number) => {
      const { id, src, imagePreview } = component;

      return <Img key={id} src={imagePreview || src} />;
    });
  }

  if (content.type === ContentType.TEXT) {
    const { components } = content;

    return components.map((component: any) => {
      const {
        id,
        text,
        fontSize,
        color,
        letterSpacing,
        backgroundColor,
        fontFamily,
        fontStyle,
        fontWeight,
        lineHeight,
        textAlign,
        textDecoration,
        textTransform,
      } = component;

      return (
        <span
          key={id}
          style={{
            display: "inline-block",
            width: "100%",
            fontSize: `${fontSize}px`,
            color,
            letterSpacing: `${letterSpacing}px`,
            backgroundColor,
            fontFamily,
            fontStyle,
            fontWeight,
            lineHeight,
            textAlign,
            textDecoration,
            textTransform,
          }}
        >
          {text}
        </span>
      );
    });
  }

  if (content.type === ContentType.EMAIL) {
    const { components } = content;

    const textAlign = components[0].textAlign;

    return (
      <span style={{ width: "100%", display: "inline-block", textAlign }}>
        {components.map((component: any) => {
          const {
            id,
            text,
            fontSize,
            color,
            letterSpacing,
            backgroundColor,
            fontFamily,
            fontStyle,
            fontWeight,
            lineHeight,
            textAlign,
            textDecoration,
            textTransform,
          } = component;

          const style = {
            width: "100%",
            fontSize: `${fontSize}px`,
            color,
            letterSpacing: `${letterSpacing}px`,
            backgroundColor,
            fontFamily,
            fontStyle,
            fontWeight,
            lineHeight,
            textAlign,
            textDecoration,
            textTransform,
          };

          if (!text) {
            return null;
          }

          if (component.type === ContentType.EMAIL_LINK) {
            return (
              <a key={id} href={`mailto:${text}`} target="_blank" style={style}>
                {text}
              </a>
            );
          }

          return (
            <span key={id} style={style}>
              {text}
            </span>
          );
        })}
      </span>
    );
  }

  return null;
};
