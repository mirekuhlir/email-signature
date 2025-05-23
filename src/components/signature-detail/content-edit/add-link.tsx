/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageComponent, WebsiteComponent } from '@/src/types/signature';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextInput from '../../ui/text-input';
import { Button } from '../../ui/button';
import { Typography } from '../../ui/typography';

interface LinkComponentProps {
  component: ImageComponent | WebsiteComponent;
  contentPathToEdit: string;
  setContent: (path: string, value: any) => void;
  // Define the expected shape for the 'edit' parameter manually
  setContentEdit: (edit: { subEdit?: string | null }) => void;
  addEditingSectionId: (id: string) => void;
  removeEditingSectionId: (id: string) => void;
  title?: string;
}

export const LinkComponent = (props: LinkComponentProps) => {
  const {
    component,
    contentPathToEdit,
    setContent,
    setContentEdit,
    addEditingSectionId,
    removeEditingSectionId,
    title,
  } = props;
  const [showLinkInput, setShowLinkInput] = useState(false);
  console.warn('LinkComponent', contentPathToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
  });

  const onSubmitLink = (data: any) => {
    const trimmedLink = data.link.trim();
    if (!trimmedLink) {
      setContent(`${contentPathToEdit}`, '');
      setContentEdit({
        subEdit: null,
      });
      setShowLinkInput(false);
      removeEditingSectionId(component.id);
      return;
    }

    let href = trimmedLink;
    if (!/^https?:\/\//i.test(href)) {
      href = `https://${href}`;
    }
    setContent(`${contentPathToEdit}`, href);
    setContentEdit({
      subEdit: null,
    });
    setShowLinkInput(false);
    removeEditingSectionId(component.id);
  };

  useEffect(() => {
    if (showLinkInput && component.link) {
      reset({ link: component.link });
    }
  }, [reset, showLinkInput, component.link]);

  return (
    <>
      <div className="pb-2">
        <div
          className={
            showLinkInput ? 'bg-white p-4 shadow-md rounded-md mb-8' : ''
          }
        >
          {showLinkInput && (
            <div className="mt-2 p-3">
              <form onSubmit={handleSubmit(onSubmitLink)} className="space-y-4">
                <TextInput
                  label="Link"
                  name="link"
                  register={register}
                  errors={errors}
                  placeholder="Enter link e.g. www.example.com"
                  validation={{
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                      message: 'Please enter a valid URL',
                    },
                  }}
                />
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setShowLinkInput(false);
                      setContentEdit({
                        subEdit: null,
                      });
                      removeEditingSectionId(component.id);
                    }}
                  >
                    Close
                  </Button>
                  <Button type="submit" variant="blue">
                    Save
                  </Button>
                </div>
              </form>
            </div>
          )}

          {!showLinkInput && (
            <>
              {component?.link && (
                <>
                  <div className="py-2">
                    <Typography
                      variant="large"
                      className="text-gray-900 break-all"
                    >
                      {component.link}
                    </Typography>
                  </div>
                  <Button
                    variant="blue"
                    onClick={() => {
                      setContentEdit({
                        subEdit: 'edit-link',
                      });
                      addEditingSectionId(component.id);
                      setShowLinkInput(true);
                    }}
                  >
                    {'Edit Link'}
                  </Button>
                </>
              )}

              {!component?.link && (
                <>
                  <div className="pb-1">
                    <Typography variant="labelBase">
                      {title ? title : 'Add link'}
                    </Typography>
                  </div>
                  <Button
                    variant="blue"
                    onClick={() => {
                      setShowLinkInput(true);
                      setContentEdit({
                        subEdit: 'edit-link',
                      });
                      addEditingSectionId(component.id);
                    }}
                  >
                    Add Link
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
