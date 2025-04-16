/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { CollapsibleSection } from '@/src/components/ui/collapsible-section';
import { RichTextEditor } from '../../ui/rich-text-editor/rich-text-editor';
import { Hr } from '../../ui/hr';

export const TextEditContent = (props: any) => {
  const { components, contentPathToEdit, contentType, columnColor } = props;
  const { setContent } = useSignatureStore();

  return components.map((component: any, index: number) => {
    const path = `${contentPathToEdit}.components[${index}]`;

    const rowBackgroundColor = component.backgroundColor;

    const onChange = (editContent: any) => {
      setContent(path, editContent);
    };

    return (
      <Fragment key={component.id}>
        <CollapsibleSection>
          <div className="mb-4 mt-1">
            <RichTextEditor
              content={component}
              onChange={onChange}
              contentType={contentType}
              backgroundColor={rowBackgroundColor || columnColor}
            />
          </div>
        </CollapsibleSection>
      </Fragment>
    );
  });
};
