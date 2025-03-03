/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useSignatureStore } from '../store/content-edit-add-store';
import useValidate from '@/hooks/useValidate';
import { ContentType } from '@/const/content';
import { validateEmail } from '@/hooks/validations';
import {
  LayoutType,
  RichTextEditor,
} from '@/components/ui/rich-text-editor/rich-text-editor';

export const EmailEditContent = (props: any) => {
  const { components, contentPathToEdit, contentType } = props;
  const { setContent } = useSignatureStore();
  const { validate, errors } = useValidate();

  return components
    .slice()
    .reverse()
    .map((component: any, index: number) => {
      const originalIndex = components.length - 1 - index;
      const path = `${contentPathToEdit}.components[${originalIndex}]`;

      const onChange = (editContent: any) => {
        if (component.type === ContentType.EMAIL_LINK && editContent.text) {
          validate({
            text: editContent.text,
            componentId: component.id,
            validation: validateEmail,
          });
        }

        setContent(path, editContent);
      };

      const getLabelText = () => {
        if (component.type === ContentType.TEXT) {
          return 'Prefix';
        }

        if (component.type === ContentType.EMAIL_LINK) {
          return 'Email';
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
            errorMessage={errors[component.id]}
            layoutType={layoutType}
          />
        </div>
      );
    });
};
