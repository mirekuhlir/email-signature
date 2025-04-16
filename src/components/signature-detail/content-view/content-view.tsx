/* eslint-disable @typescript-eslint/no-explicit-any */
import { Img } from '@/src/components/ui/img';
import { ContentType } from '@/src/const/content';
import { Fragment } from 'react';

const formatTextWithLineBreaks = (text?: string) => {
  return text

    ?.replace(/\r\n|\r/g, '\n')
    .split('\n')
    .map((line: string, index: number, array: string[]) => (
      <Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </Fragment>
    ));
};

export const getContentView = (content?: any) => {
  if (content?.type == ContentType.IMAGE) {
    const { components } = content;

    return components.map((component: any) => {
      const { id, src, cropImagePreview, link } = component;

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

      const imgElement = <Img key={id} src={imageSrc} />;

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
        backgroundColor,
        fontFamily,
        fontStyle,
        fontWeight,
        lineHeight,
        textAlign,
        textDecoration,
        padding,
        borderRadius,
        borderTopWidth,
        borderTopColor,
        borderTopStyle,
        borderRightWidth,
        borderRightColor,
        borderRightStyle,
        borderBottomWidth,
        borderBottomColor,
        borderBottomStyle,
        borderLeftWidth,
        borderLeftColor,
        borderLeftStyle,
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
            backgroundColor,
            fontFamily,
            fontStyle,
            fontWeight,
            lineHeight,
            textAlign,
            textDecoration,
            padding,
            borderRadius: borderRadius,
            borderTopWidth: borderTopWidth,
            borderTopColor: borderTopColor,
            borderTopStyle: borderTopStyle,
            borderRightWidth: borderRightWidth,
            borderRightColor: borderRightColor,
            borderRightStyle: borderRightStyle,
            borderBottomWidth: borderBottomWidth,
            borderBottomColor: borderBottomColor,
            borderBottomStyle: borderBottomStyle,
            borderLeftWidth: borderLeftWidth,
            borderLeftColor: borderLeftColor,
            borderLeftStyle: borderLeftStyle,
            wordBreak: 'break-all',
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
    const padding = components[0].padding;
    const backgroundColor = components[0].backgroundColor;
    const borderRadius = components[0].borderRadius;
    const borderTopWidth = components[0].borderTopWidth;
    const borderTopColor = components[0].borderTopColor;
    const borderTopStyle = components[0].borderTopStyle;
    const borderRightWidth = components[0].borderRightWidth;
    const borderRightColor = components[0].borderRightColor;
    const borderRightStyle = components[0].borderRightStyle;
    const borderBottomWidth = components[0].borderBottomWidth;
    const borderBottomColor = components[0].borderBottomColor;
    const borderBottomStyle = components[0].borderBottomStyle;
    const borderLeftWidth = components[0].borderLeftWidth;
    const borderLeftColor = components[0].borderLeftColor;
    const borderLeftStyle = components[0].borderLeftStyle;

    return (
      <span
        style={{
          width: '100%',
          display: 'inline-block',
          textAlign,
          padding,
          backgroundColor,
          borderRadius: borderRadius,
          borderTopWidth: borderTopWidth,
          borderTopColor: borderTopColor,
          borderTopStyle: borderTopStyle,
          borderRightWidth: borderRightWidth,
          borderRightColor: borderRightColor,
          borderRightStyle: borderRightStyle,
          borderBottomWidth: borderBottomWidth,
          borderBottomColor: borderBottomColor,
          borderBottomStyle: borderBottomStyle,
          borderLeftWidth: borderLeftWidth,
          borderLeftColor: borderLeftColor,
          borderLeftStyle: borderLeftStyle,
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
            textAlign,
            textDecoration,
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
            textAlign,
            textDecoration,
            padding,
            borderRadius: borderRadius,
            borderTopWidth: component.borderTopWidth,
            borderTopColor: component.borderTopColor,
            borderTopStyle: component.borderTopStyle,
            borderRightWidth: component.borderRightWidth,
            borderRightColor: component.borderRightColor,
            borderRightStyle: component.borderRightStyle,
            borderBottomWidth: component.borderBottomWidth,
            borderBottomColor: component.borderBottomColor,
            borderBottomStyle: component.borderBottomStyle,
            borderLeftWidth: component.borderLeftWidth,
            borderLeftColor: component.borderLeftColor,
            borderLeftStyle: component.borderLeftStyle,
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
    const padding = components[0].padding;
    const borderRadius = components[0].borderRadius;
    const backgroundColor = components[0].backgroundColor;
    const borderTopWidth = components[0].borderTopWidth;
    const borderTopColor = components[0].borderTopColor;
    const borderTopStyle = components[0].borderTopStyle;
    const borderRightWidth = components[0].borderRightWidth;
    const borderRightColor = components[0].borderRightColor;
    const borderRightStyle = components[0].borderRightStyle;
    const borderBottomWidth = components[0].borderBottomWidth;
    const borderBottomColor = components[0].borderBottomColor;
    const borderBottomStyle = components[0].borderBottomStyle;
    const borderLeftWidth = components[0].borderLeftWidth;
    const borderLeftColor = components[0].borderLeftColor;
    const borderLeftStyle = components[0].borderLeftStyle;

    return (
      <span
        style={{
          width: '100%',
          display: 'inline-block',
          textAlign,
          padding,
          borderRadius: borderRadius,
          backgroundColor,
          borderTopWidth: borderTopWidth,
          borderTopColor: borderTopColor,
          borderTopStyle: borderTopStyle,
          borderRightWidth: borderRightWidth,
          borderRightColor: borderRightColor,
          borderRightStyle: borderRightStyle,
          borderBottomWidth: borderBottomWidth,
          borderBottomColor: borderBottomColor,
          borderBottomStyle: borderBottomStyle,
          borderLeftWidth: borderLeftWidth,
          borderLeftColor: borderLeftColor,
          borderLeftStyle: borderLeftStyle,
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
            textAlign,
            textDecoration,
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
            textAlign,
            textDecoration,
            padding,
            borderRadius: borderRadius,
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
    const padding = components[0].padding;
    const borderRadius = components[0].borderRadius;
    const backgroundColor = components[0].backgroundColor;
    const borderTopWidth = components[0].borderTopWidth;
    const borderTopColor = components[0].borderTopColor;
    const borderTopStyle = components[0].borderTopStyle;
    const borderRightWidth = components[0].borderRightWidth;
    const borderRightColor = components[0].borderRightColor;
    const borderRightStyle = components[0].borderRightStyle;
    const borderBottomWidth = components[0].borderBottomWidth;
    const borderBottomColor = components[0].borderBottomColor;
    const borderBottomStyle = components[0].borderBottomStyle;
    const borderLeftWidth = components[0].borderLeftWidth;
    const borderLeftColor = components[0].borderLeftColor;
    const borderLeftStyle = components[0].borderLeftStyle;

    return (
      <span
        style={{
          width: '100%',
          display: 'inline-block',
          textAlign,
          padding,
          borderRadius: borderRadius,
          backgroundColor,
          borderTopWidth: borderTopWidth,
          borderTopColor: borderTopColor,
          borderTopStyle: borderTopStyle,
          borderRightWidth: borderRightWidth,
          borderRightColor: borderRightColor,
          borderRightStyle: borderRightStyle,
          borderBottomWidth: borderBottomWidth,
          borderBottomColor: borderBottomColor,
          borderBottomStyle: borderBottomStyle,
          borderLeftWidth: borderLeftWidth,
          borderLeftColor: borderLeftColor,
          borderLeftStyle: borderLeftStyle,
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
            textAlign,
            textDecoration,
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
            textAlign,
            textDecoration,
            padding,
            borderRadius: borderRadius,
          };

          if (!text) {
            return null;
          }

          if (component.type === ContentType.WEBSITE_LINK) {
            let href = text;

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
    const padding = components[0].padding;
    const borderRadius = components[0].borderRadius;
    const backgroundColor = components[0].backgroundColor;
    const borderTopWidth = components[0].borderTopWidth;
    const borderTopColor = components[0].borderTopColor;
    const borderTopStyle = components[0].borderTopStyle;
    const borderRightWidth = components[0].borderRightWidth;
    const borderRightColor = components[0].borderRightColor;
    const borderRightStyle = components[0].borderRightStyle;
    const borderBottomWidth = components[0].borderBottomWidth;
    const borderBottomColor = components[0].borderBottomColor;
    const borderBottomStyle = components[0].borderBottomStyle;
    const borderLeftWidth = components[0].borderLeftWidth;
    const borderLeftColor = components[0].borderLeftColor;
    const borderLeftStyle = components[0].borderLeftStyle;

    return (
      <span
        style={{
          width: '100%',
          display: 'inline-block',
          textAlign,
          padding,
          borderRadius: borderRadius,
          backgroundColor,
          borderTopWidth: borderTopWidth,
          borderTopColor: borderTopColor,
          borderTopStyle: borderTopStyle,
          borderRightWidth: borderRightWidth,
          borderRightColor: borderRightColor,
          borderRightStyle: borderRightStyle,
          borderBottomWidth: borderBottomWidth,
          borderBottomColor: borderBottomColor,
          borderBottomStyle: borderBottomStyle,
          borderLeftWidth: borderLeftWidth,
          borderLeftColor: borderLeftColor,
          borderLeftStyle: borderLeftStyle,
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
            textAlign,
            textDecoration,
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
            textAlign,
            textDecoration,
            padding,
            borderRadius: borderRadius,
            wordBreak: 'break-all' as React.CSSProperties['wordBreak'],
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
