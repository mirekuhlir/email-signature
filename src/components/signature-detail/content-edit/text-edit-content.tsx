/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment, ReactNode } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { ContentType } from '@/src/const/content';
import {
  LayoutType,
  RichTextEditor,
} from '@/src/components/ui/rich-text-editor/rich-text-editor';
import { CollapsibleSection } from '@/src/components/ui/collapsible-section';

interface GenericEditContentProps {
  components: any[];
  contentPathToEdit: string;
  contentType: ContentType;
  columnColor?: string;
  getLabel: (component: any, index: number, originalIndex: number) => string;
  getLayoutType: (
    component: any,
    index: number,
    originalIndex: number,
  ) => LayoutType;
  getTitle: (
    labelText: string,
    component: any,
    index: number,
    originalIndex: number,
  ) => string;
  linkComponent?: ReactNode;
  onValueChange?: (editContent: any, component: any, path: string) => void;
  reverseComponents?: boolean;
  useComponentBackgroundColor?: boolean;
  errors?: Record<string, string | null>;
}

export const GenericEditContent = (props: GenericEditContentProps) => {
  const {
    components,
    contentPathToEdit,
    contentType,
    columnColor,
    getLabel,
    getLayoutType,
    getTitle,
    onValueChange,
    reverseComponents = true,
    useComponentBackgroundColor = false,
    errors,
    linkComponent,
  } = props;
  const { setContent } = useSignatureStore();

  const processedComponents = reverseComponents
    ? components.slice().reverse()
    : components;

  return processedComponents.map((component: any, index: number) => {
    const originalIndex = reverseComponents
      ? components.length - 1 - index
      : index;
    const path = `${contentPathToEdit}.components[${originalIndex}]`;

    const handleOnChange = (editContent: any) => {
      if (onValueChange) {
        onValueChange(editContent, component, path);
      } else {
        // Default behavior
        setContent(path, editContent);
      }
    };

    const labelText = getLabel(component, index, originalIndex);
    const layoutType = getLayoutType(component, index, originalIndex);
    const title = getTitle(labelText, component, index, originalIndex);
    const rowBackgroundColor = useComponentBackgroundColor
      ? component.backgroundColor
      : undefined;
    const finalBackgroundColor = rowBackgroundColor || columnColor;

    return (
      <Fragment key={component.id}>
        <CollapsibleSection isInitOpen={true} title={title}>
          <div className={`mb-4 ${!reverseComponents ? 'mt-1' : ''}`}>
            <RichTextEditor
              label={labelText || undefined}
              content={component}
              onChange={handleOnChange}
              contentType={contentType}
              layoutType={layoutType}
              isAutoFocus={index === 0}
              backgroundColor={finalBackgroundColor}
              errorMessage={errors?.[component.id] || undefined}
              linkComponent={
                component.type === ContentType.WEBSITE_LINK
                  ? linkComponent
                  : undefined
              }
            />
          </div>
        </CollapsibleSection>
      </Fragment>
    );
  });
};
