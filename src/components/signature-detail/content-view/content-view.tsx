/* eslint-disable @typescript-eslint/no-explicit-any */
import { Img } from '@/src/components/ui/img';
import { ContentType } from '@/src/const/content';

export const getContentView = (content?: any) => {
  if (content?.type == ContentType.IMAGE) {
    const { components } = content;

    return components.map((component: any) => {
      const { id, src, cropImagePreview } = component;

      const image = cropImagePreview || src;

      return <Img key={id} src={image} />;
    });
  }

  if (content?.type === ContentType.TEXT) {
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
      } = component;

      return (
        <span
          key={id}
          style={{
            display: 'inline-block',
            width: '100%',
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
          }}
        >
          {text}
        </span>
      );
    });
  }

  if (content?.type === ContentType.EMAIL) {
    const { components } = content;

    const textAlign = components[1].textAlign;

    return (
      <span style={{ width: '100%', display: 'inline-block', textAlign }}>
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
          } = component;

          const style = {
            width: '100%',
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
          };

          if (!text) {
            return null;
          }

          if (component.type === ContentType.EMAIL_LINK) {
            return (
              <a
                key={id}
                href={`mailto:${text}`}
                target="_blank"
                style={style}
                rel="noreferrer"
              >
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
