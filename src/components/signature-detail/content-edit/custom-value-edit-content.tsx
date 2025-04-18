/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { ContentType } from '@/src/const/content';
import {
  LayoutType,
  RichTextEditor,
} from '@/src/components/ui/rich-text-editor/rich-text-editor';
import { CollapsibleSection } from '@/src/components/ui/collapsible-section';
import { Hr } from '@/src/components/ui/hr';

export const CustomValueEditContent = (props: any) => {
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
          return index === 1 ? 'Prefix' : 'Value';
        }
        return '';
      };

      const labelText = getLabelText();

      const getLayoutType = () => {
        if (component.type === ContentType.TEXT && index === 1) {
          return LayoutType.PREFIX;
        }
        return LayoutType.TEXT;
      };

      const layoutType = getLayoutType();

      const title = `Text and color ${labelText}`;

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
