/* eslint-disable @typescript-eslint/no-explicit-any */
import { Img } from '@/src/components/ui/img';
import { ContentType } from '@/src/const/content';

const formatTextWithLineBreaks = (text?: string) => {
  if (!text) return null;
  return text
    ?.replace(/\r\n|\r/g, '\n')
    .split('\n')
    .map((line: string, index: number, array: string[]) => (
      <span key={index} style={{ whiteSpace: 'pre-wrap' }}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
};

export const getContentView = (content?: any) => {
  if (content?.type == ContentType.IMAGE) {
    const { components } = content;

    return components.map((component: any) => {
      const { id, src, cropImagePreview, link, margin } = component;

      const image = cropImagePreview || src;
      let imageSrc = image;

      if (
        imageSrc &&
        typeof imageSrc === 'string' &&
        imageSrc.trim() !== '' &&
        imageSrc.toLowerCase().endsWith('.png')
      ) {
        // cache busting for reload image when image filename is the same
        imageSrc = `${imageSrc}?t=${Date.now()}`;
      }

      const imgElement = (
        <Img
          key={id}
          src={imageSrc}
          style={{
            margin: margin,
          }}
        />
      );

      if (link) {
        return (
          <a
            key={id}
            href={link}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block',
              textDecoration: 'none',
            }}
          >
            {imgElement}
          </a>
        );
      }

      return imgElement;
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
        fontFamily,
        fontStyle,
        fontWeight,
        lineHeight,
        textDecoration,
        textAlign,
      } = component;

      const formattedText = formatTextWithLineBreaks(text);

      return (
        <span
          key={id}
          style={{
            display: 'inline-block',
            width: '100%',
            fontSize: fontSize,
            color,
            letterSpacing: letterSpacing,
            fontFamily,
            fontStyle,
            fontWeight,
            lineHeight,
            textDecoration,
            /*      wordBreak: 'break-all', */
            textAlign,
            whiteSpace: 'pre-wrap',
          }}
        >
          {formattedText}
        </span>
      );
    });
  }

  if (content?.type === ContentType.EMAIL) {
    const { components } = content;
    const textAlign = components[1].textAlign;

    return (
      <span
        style={{
          width: '100%',
          display: 'inline-block',
          textAlign,
        }}
      >
        {components.map((component: any) => {
          const {
            id,
            text,
            fontSize,
            color,
            letterSpacing,
            fontFamily,
            fontStyle,
            fontWeight,
            lineHeight,
            textDecoration,
            textAlign,
          } = component;

          const style = {
            width: '100%',
            fontSize: fontSize,
            color,
            letterSpacing: letterSpacing,
            fontFamily,
            fontStyle,
            fontWeight,
            lineHeight,
            textDecoration,
            textAlign,
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
                style={{
                  ...style,
                  wordBreak: 'break-all',
                }}
                rel="noreferrer"
              >
                {text}
              </a>
            );
          }

          return (
            <span key={id} style={style}>
              {formatTextWithLineBreaks(text)}
            </span>
          );
        })}
      </span>
    );
  }

  if (content?.type === ContentType.PHONE) {
    const { components } = content;
    const textAlign = components[1].textAlign;

    return (
      <span
        style={{
          width: '100%',
          display: 'inline-block',
          textAlign,
        }}
      >
        {components.map((component: any) => {
          const {
            id,
            text,
            fontSize,
            color,
            letterSpacing,
            fontFamily,
            fontStyle,
            fontWeight,
            lineHeight,
            textDecoration,
            textAlign,
          } = component;

          const style = {
            width: '100%',
            fontSize: fontSize,
            color,
            letterSpacing: letterSpacing,
            fontFamily,
            fontStyle,
            fontWeight,
            lineHeight,
            textDecoration,
            textAlign,
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
                style={{
                  ...style,
                  wordBreak: 'break-all',
                }}
                rel="noreferrer"
              >
                {text}
              </a>
            );
          }

          return (
            <span key={id} style={style}>
              {formatTextWithLineBreaks(text)}
            </span>
          );
        })}
      </span>
    );
  }

  if (content?.type === ContentType.WEBSITE) {
    const { components } = content;
    const textAlign = components[1].textAlign;

    return (
      <span
        style={{
          width: '100%',
          display: 'inline-block',
          textAlign,
        }}
      >
        {components.map((component: any) => {
          const {
            id,
            text,
            link,
            fontSize,
            color,
            letterSpacing,
            fontFamily,
            fontStyle,
            fontWeight,
            lineHeight,
            textDecoration,
            textAlign,
          } = component;

          const style = {
            width: '100%',
            fontSize: fontSize,
            color,
            letterSpacing: letterSpacing,
            fontFamily,
            fontStyle,
            fontWeight,
            lineHeight,
            textDecoration,
            textAlign,
          };

          if (!text) {
            return null;
          }

          if (component.type === ContentType.WEBSITE_LINK) {
            let href = link || text;

            if (!/^https?:\/\//i.test(href)) {
              href = `https://${href}`;
            }

            return (
              <a
                key={id}
                href={href}
                target="_blank"
                style={{
                  ...style,
                  wordBreak: 'break-all',
                }}
                rel="noreferrer"
              >
                {text}
              </a>
            );
          }

          return (
            <span key={id} style={style}>
              {formatTextWithLineBreaks(text)}
            </span>
          );
        })}
      </span>
    );
  }

  if (content?.type === ContentType.CUSTOM_VALUE) {
    const { components } = content;
    const textAlign = components[1].textAlign;

    return (
      <span
        style={{
          width: '100%',
          display: 'inline-block',
          textAlign,
        }}
      >
        {components.map((component: any) => {
          const {
            id,
            text,
            fontSize,
            color,
            letterSpacing,
            fontFamily,
            fontStyle,
            fontWeight,
            lineHeight,
            textDecoration,
            textAlign,
          } = component;

          const style = {
            width: '100%',
            fontSize: fontSize,
            color,
            letterSpacing: letterSpacing,
            fontFamily,
            fontStyle,
            fontWeight,
            lineHeight,
            textDecoration,
            wordBreak: 'break-all' as React.CSSProperties['wordBreak'],
            textAlign,
          };

          if (!text) {
            return null;
          }

          return (
            <span key={id} style={style}>
              {formatTextWithLineBreaks(text)}
            </span>
          );
        })}
      </span>
    );
  }

  return null;
};
