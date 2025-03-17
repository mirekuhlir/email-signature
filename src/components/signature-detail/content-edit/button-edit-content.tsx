/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import {
  LayoutType,
  RichTextEditor,
} from '@/src/components/ui/rich-text-editor/rich-text-editor';
import { CollapsibleSection } from '@/src/components/ui/collapsible-section';
import { Typography } from '@/src/components/ui/typography';
import { EditColor } from '@/src/components/ui/edit-color';

export const ButtonEditContent = (props: any) => {
  const { components, contentPathToEdit, contentType } = props;
  const { setContent } = useSignatureStore();

  return components.map((component: any, index: number) => {
    const path = `${contentPathToEdit}.components[${index}]`;

    const onChange = (editContent: any) => {
      setContent(path, editContent);
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUrl = e.target.value;
      setContent(path, {
        ...component,
        url: newUrl,
      });
    };

    const handleColorChange = (color: string | undefined) => {
      if (color) {
        setContent(path, {
          ...component,
          color,
        });
      }
    };

    const handleBackgroundColorChange = (color: string | undefined) => {
      if (color) {
        setContent(path, {
          ...component,
          backgroundColor: color,
        });
      }
    };

    return (
      <Fragment key={component.id}>
        <CollapsibleSection>
          <div className="mb-4">
            <RichTextEditor
              label="Button Text"
              content={component}
              onChange={onChange}
              contentType={contentType}
              layoutType={LayoutType.TEXT}
            />

            <div className="mt-4">
              <Typography variant="labelBase">Button URL</Typography>
              <input
                type="text"
                value={component.url || ''}
                onChange={handleUrlChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="https://example.com"
              />
            </div>

            <div className="mt-4">
              <EditColor
                initColor={component.color || '#FFFFFF'}
                onChange={handleColorChange}
                label="Text Color"
              />
            </div>

            <div className="mt-4">
              <EditColor
                initColor={component.backgroundColor || '#007BFF'}
                onChange={handleBackgroundColorChange}
                label="Button Color"
              />
            </div>
          </div>
        </CollapsibleSection>
        <hr className="border-gray-300" />
      </Fragment>
    );
  });
};
