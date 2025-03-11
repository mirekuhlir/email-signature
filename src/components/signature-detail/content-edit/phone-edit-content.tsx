/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { ContentType } from '@/src/const/content';
import {
  LayoutType,
  RichTextEditor,
} from '@/src/components/ui/rich-text-editor/rich-text-editor';

export const PhoneEditContent = (props: any) => {
  const { components, contentPathToEdit, contentType } = props;
  const { setContent } = useSignatureStore();

  return components
    .slice()
    .reverse()
    .map((component: any, index: number) => {
      const originalIndex = components.length - 1 - index;
      const path = `${contentPathToEdit}.components[${originalIndex}]`;

      const onChange = (editContent: any) => {
        setContent(path, editContent);
      };

      const getLabelText = () => {
        if (component.type === ContentType.TEXT) {
          return 'Prefix';
        }

        if (component.type === ContentType.PHONE_LINK) {
          return 'Phone';
        }

        return '';
      };

      const labeText = getLabelText();

      const getLayoutType = () => {
        if (component.type === ContentType.TEXT) {
          return LayoutType.PREFIX;
        }

        return LayoutType.TEXT;
      };

      const layoutType = getLayoutType();

      return (
        <div key={component.id} className="pt-6 border-b border-gray-300 pb-4">
          <RichTextEditor
            label={labeText}
            content={component}
            onChange={onChange}
            contentType={contentType}
            layoutType={layoutType}
          />
        </div>
      );
    });
};
