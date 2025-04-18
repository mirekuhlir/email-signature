/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { ContentType } from '@/src/const/content';
import {
  LayoutType,
  RichTextEditor,
} from '@/src/components/ui/rich-text-editor/rich-text-editor';
import { CollapsibleSection } from '@/src/components/ui/collapsible-section';
export const WebsiteEditContent = (props: any) => {
  const { components, contentPathToEdit, contentType, columnColor } = props;
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

        if (component.type === ContentType.WEBSITE_LINK) {
          return 'Website';
        }

        return '';
      };

      const labelText = getLabelText();

      const getLayoutType = () => {
        if (component.type === ContentType.TEXT) {
          return LayoutType.PREFIX;
        }

        return LayoutType.TEXT;
      };

      const layoutType = getLayoutType();

      const title = `${labelText} text and color`;

      return (
        <Fragment key={component.id}>
          <CollapsibleSection isInitOpen={true} title={title}>
            <div className="mb-4">
              <RichTextEditor
                label={labelText}
                content={component}
                onChange={onChange}
                contentType={contentType}
                layoutType={layoutType}
                isAutoFocus={index === 0}
                backgroundColor={columnColor}
              />
            </div>
          </CollapsibleSection>
        </Fragment>
      );
    });
};
