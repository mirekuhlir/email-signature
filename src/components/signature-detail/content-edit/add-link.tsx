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
}

export const LinkComponent = (props: LinkComponentProps) => {
  const {
    component,
    contentPathToEdit,
    setContent,
    setContentEdit,
    addEditingSectionId,
    removeEditingSectionId,
  } = props;
  const [showLinkInput, setShowLinkInput] = useState(false);

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
      setContent(`${contentPathToEdit}.components[0].link`, '');
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
    setContent(`${contentPathToEdit}.components[0].link`, href);
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
                  label="Link URL"
                  name="link"
                  register={register}
                  errors={errors}
                  placeholder="Enter URL (e.g. https://example.com)"
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
                      Add link to image
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
