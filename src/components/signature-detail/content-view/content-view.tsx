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
        padding,
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
            padding,
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
    const padding = components[0].padding;

    return (
      <span
        style={{ width: '100%', display: 'inline-block', textAlign, padding }}
      >
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

  if (content?.type === ContentType.PHONE) {
    const { components } = content;

    const textAlign = components[1].textAlign;
    const padding = components[0].padding;

    return (
      <span
        style={{ width: '100%', display: 'inline-block', textAlign, padding }}
      >
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

          if (component.type === ContentType.PHONE_LINK) {
            return (
              <a
                key={id}
                href={`tel:${text.replace(/\s+/g, '')}`}
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

  if (content?.type === ContentType.WEBSITE) {
    const { components } = content;

    const textAlign = components[1].textAlign;
    const padding = components[0].padding;

    return (
      <span
        style={{ width: '100%', display: 'inline-block', textAlign, padding }}
      >
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

          if (component.type === ContentType.WEBSITE_LINK) {
            return (
              <a
                key={id}
                href={text.startsWith('http') ? text : `https://${text}`}
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

  if (content?.type === ContentType.CUSTOM_VALUE) {
    const { components } = content;

    const textAlign = components[1].textAlign;
    const padding = components[0].padding;

    return (
      <span
        style={{ width: '100%', display: 'inline-block', textAlign, padding }}
      >
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

          return (
            <span key={id} style={style}>
              {text}
            </span>
          );
        })}
      </span>
    );
  }

  if (content?.type === ContentType.BUTTON) {
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
        padding,
        borderRadius,
        url,
      } = component;

      const style = {
        display: 'inline-block',
        fontSize: `${fontSize}px`,
        color: color || 'rgb(255, 255, 255)',
        letterSpacing: `${letterSpacing}px`,
        backgroundColor: backgroundColor || 'rgb(0, 0, 0)',
        fontFamily,
        fontStyle,
        fontWeight,
        lineHeight,
        textAlign: textAlign || 'center',
        textDecoration: textDecoration || 'none',
        padding: padding || '8px 16px',
        borderRadius: borderRadius || '4px',
        cursor: 'pointer',
      };

      if (!text) {
        return null;
      }

      return (
        <a
          key={id}
          href={url?.startsWith('http') ? url : `https://${url || ''}`}
          target="_blank"
          style={style}
          rel="noreferrer"
        >
          {text}
        </a>
      );
    });
  }

  return null;
};
