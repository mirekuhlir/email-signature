/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentType } from '@/src/const/content';
import React, { useEffect, useState, useRef, ReactNode } from 'react';
import SelectBase from '../select-base';
import { FONTS, FONT_SIZES, LINE_HEIGHTS, LETTER_SPACINGS } from './fonts';
import { EditColor } from '../edit-color';
import { Typography } from '../typography';
import { IconSelector } from './icon-selector';

export enum LayoutType {
  TEXT = 'text',
  PREFIX = 'prefix',
}

interface RichTextEditorProps {
  content: any;
  onChange: (content: any) => void;
  contentType: ContentType;
  errorMessage?: string;
  label?: string;
  layoutType?: LayoutType;
  backgroundColor?: string;
  isAutoFocus?: boolean;
  linkComponent?: ReactNode;
}

const ButtonSquare = ({
  onClick,
  children,
  isSelected,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  isSelected?: boolean;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded w-20 h-10 flex items-center justify-center rounded-md shadow-xs cursor-pointer ${isSelected ? 'bg-blue-200' : 'bg-white'} ${className}`}
    >
      {children}
    </button>
  );
};

export const RichTextEditor = (props: RichTextEditorProps) => {
  const {
    content,
    onChange,
    errorMessage,
    label,
    layoutType = LayoutType.TEXT,
    backgroundColor,
    isAutoFocus = false,
    linkComponent,
  } = props;

  const [editText, setEditText] = useState(content?.text ?? '');
  const [editFontSize, setEditFontSize] = useState(content?.fontSize ?? '16px');
  const [editLineHeight, setEditLineHeight] = useState(
    content?.lineHeight ?? '1',
  );
  const [editFontWeight, setEditFontWeight] = useState(
    content?.fontWeight ?? 'normal',
  );
  const [editFontStyle, setEditFontStyle] = useState(
    content?.fontStyle ?? 'normal',
  );
  const [editTextAlign, setEditTextAlign] = useState(
    content?.textAlign ?? 'left',
  );

  const [editTextColor, setEditTextColor] = useState(
    content?.color ?? 'rgb(0, 0, 0)',
  );
  const [editBackgroundColor, setEditBackgroundColor] = useState(
    content?.backgroundColor,
  );
  const [editTextDecoration, setEditTextDecoration] = useState(
    content?.textDecoration ?? 'none',
  );
  const [editFontFamily, setEditFontFamily] = useState(
    content?.fontFamily ?? 'Arial',
  );
  const [editLetterSpacing, setEditLetterSpacing] = useState(
    content?.letterSpacing ?? '0px',
  );
  const [showIconSelector, setShowIconSelector] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (content) {
      setEditText(content.text ?? '');
      setEditFontSize(content.fontSize ?? '16px');
      setEditLineHeight(content.lineHeight ?? '1');
      setEditFontWeight(content.fontWeight ?? 'normal');
      setEditFontStyle(content.fontStyle ?? 'normal');
      setEditTextAlign(content.textAlign ?? 'left');
      setEditTextColor(content.color ?? 'rgb(0, 0, 0)');
      setEditBackgroundColor(content.backgroundColor);
      setEditTextDecoration(content.textDecoration ?? 'none');
      setEditFontFamily(content.fontFamily ?? 'Arial');
      setEditLetterSpacing(content.letterSpacing ?? '0px');
    }
  }, [content]);

  useEffect(() => {
    if (textareaRef.current && isAutoFocus) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isAutoFocus]);

  const onChangeContent = (updated: any) => {
    const editContent = {
      text: editText,
      fontSize: editFontSize,
      lineHeight: editLineHeight,
      fontWeight: editFontWeight,
      fontStyle: editFontStyle,
      textAlign: editTextAlign,
      color: editTextColor,
      backgroundColor: editBackgroundColor,
      textDecoration: editTextDecoration,
      fontFamily: editFontFamily,
      letterSpacing: editLetterSpacing,
    };

    onChange({
      ...editContent,
      ...updated,
    });
  };

  const handleInsertIcon = (icon: string) => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart || 0;
      const textBeforeCursor = editText.substring(0, cursorPosition);
      const textAfterCursor = editText.substring(cursorPosition);

      const newText = textBeforeCursor + icon + textAfterCursor;
      setEditText(newText);
      onChangeContent({ text: newText });

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            cursorPosition + icon.length,
            cursorPosition + icon.length,
          );
        }
      }, 0);
    } else {
      // If no cursor position, just append to the end
      const newText = editText + icon;
      setEditText(newText);
      onChangeContent({ text: newText });
    }
  };

  const fontsOptions = React.useMemo(
    () =>
      FONTS.map((font) => ({
        value: font.value,
        label: <span style={{ fontFamily: font.value }}>{font.label}</span>,
      })),
    [],
  );

  const componentId = content?.id;

  return (
    <div className="w-full max-w-4xl space-y-4">
      <div>
        {label && <Typography variant="labelBase">{label}</Typography>}
        <textarea
          className="w-full p-3 border rounded focus:outline-hidden focus:border-blue-400 bg-white border-gray-300 rounded-md shadow-xs"
          style={{
            fontSize: editFontSize,
            lineHeight: editLineHeight,
            fontWeight: editFontWeight,
            fontStyle: editFontStyle,
            textAlign: editTextAlign as 'left' | 'center' | 'right' | 'justify',
            color: editTextColor,
            textDecoration: editTextDecoration,
            fontFamily: editFontFamily,
            letterSpacing: editLetterSpacing,
            resize: 'vertical',
            minHeight: '100px',
            backgroundColor,
          }}
          onChange={(e) => {
            setEditText(e.target.value);
            onChangeContent({
              text: e.target.value,
            });
          }}
          role="textbox"
          aria-label="Text editor"
          value={editText}
          ref={textareaRef}
        />
        {errorMessage && (
          <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
        )}
      </div>
      {linkComponent ? linkComponent : null}

      <div className="grid grid-cols-2 gap-4">
        <SelectBase
          options={fontsOptions}
          value={editFontFamily}
          label="Font"
          onChange={(value) => {
            setEditFontFamily(value);
            onChangeContent({ fontFamily: value });
          }}
        />
        <SelectBase
          options={FONT_SIZES}
          value={editFontSize}
          label="Font size"
          onChange={(value) => {
            setEditFontSize(value);
            onChangeContent({ fontSize: value });
          }}
        />
        <SelectBase
          options={LINE_HEIGHTS}
          label="Line height"
          value={editLineHeight}
          onChange={(value) => {
            setEditLineHeight(value);
            onChangeContent({ lineHeight: value });
          }}
        />
        <SelectBase
          options={LETTER_SPACINGS}
          value={editLetterSpacing}
          label="Letter spacing"
          onChange={(value) => {
            setEditLetterSpacing(value);
            onChangeContent({ letterSpacing: value });
          }}
        />
      </div>

      <div>
        <Typography variant="labelBase">Text style</Typography>
        <div className="flex gap-2">
          <ButtonSquare
            isSelected={editFontWeight === 'bold'}
            onClick={() => {
              const newWeight = editFontWeight === 'normal' ? 'bold' : 'normal';
              setEditFontWeight(newWeight);
              onChangeContent({ fontWeight: newWeight });
            }}
          >
            Bold
          </ButtonSquare>

          <ButtonSquare
            isSelected={editFontStyle === 'italic'}
            onClick={() => {
              const newStyle = editFontStyle === 'normal' ? 'italic' : 'normal';
              setEditFontStyle(newStyle);
              onChangeContent({ fontStyle: newStyle });
            }}
          >
            Italic
          </ButtonSquare>

          <ButtonSquare
            isSelected={editTextDecoration === 'underline'}
            onClick={() => {
              const newDecoration =
                editTextDecoration === 'underline' ? 'none' : 'underline';
              setEditTextDecoration(newDecoration);
              onChangeContent({ textDecoration: newDecoration });
            }}
          >
            Underline
          </ButtonSquare>

          <ButtonSquare
            onClick={() => setShowIconSelector(true)}
            className="bg-blue-50"
          >
            Icons
          </ButtonSquare>
        </div>
      </div>

      {layoutType !== LayoutType.PREFIX && (
        <div>
          <Typography variant="labelBase">Text align</Typography>

          <div className="flex gap-2">
            <ButtonSquare
              isSelected={editTextAlign === 'left'}
              onClick={() => {
                setEditTextAlign('left');
                onChangeContent({ textAlign: 'left' });
              }}
            >
              Left
            </ButtonSquare>

            <ButtonSquare
              isSelected={editTextAlign === 'center'}
              onClick={() => {
                setEditTextAlign('center');
                onChangeContent({ textAlign: 'center' });
              }}
            >
              Center
            </ButtonSquare>

            <ButtonSquare
              isSelected={editTextAlign === 'right'}
              onClick={() => {
                setEditTextAlign('right');
                onChangeContent({ textAlign: 'right' });
              }}
            >
              Right
            </ButtonSquare>
          </div>
        </div>
      )}

      <EditColor
        initColor={editTextColor}
        label="Text color"
        sectionId={componentId}
        onChange={(color) => {
          setEditTextColor(color);
          onChangeContent({ color });
        }}
      />

      <IconSelector
        isOpen={showIconSelector}
        onSelectIcon={handleInsertIcon}
        onClose={() => setShowIconSelector(false)}
      />

      {/*     <div className="flex flex-wrap gap-2 items-center p-2">
        <div className="flex items-center gap-2">
        <span className="text-sm">Barva pozadí:</span>
        <input
          type="color"
          value={editBackgroundColor || "rgba(0, 0, 0, 0)"}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newColor = e.target.value || "transparent";
          setEditBackgroundColor(newColor);
          onChangeContent({ backgroundColor: newColor });
          }}
          className="w-10 h-10 rounded cursor-pointer"
        />
        </div>
      </div> */}
    </div>
  );
};
