'use client';
import { useState } from 'react';
import AdvancedColorPicker from '@/src/components/ui/advanced-color-picker';
import { Button } from '@/src/components/ui/button';
import { Typography } from '@/src/components/ui/typography';
import Modal from '@/src/components/ui/modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import TextInput from '@/src/components/ui/text-input';
import { RichTextEditor } from '@/src/components/ui/rich-text-editor/rich-text-editor';
import Select from '@/src/components/ui/select';
import { TextEditor } from '@/src/components/ui/text-editor-full/text-editor';
import StyledLink from '@/src/components/ui/styled-link';
import SelectBase from '@/src/components/ui/select-base';
import { ContentType } from '@/src/const/content';
import Slider from '@/src/components/ui/slider';
import { ContextMenu } from '@/src/components/ui/context-menu';
import { useToast } from '@/src/components/ui/toast';

const TypographyExample = () => {
  return (
    <div className="p-8">
      <Typography variant="h2">Color System Examples</Typography>

      {/* Heading Variants with Different Colors */}
      <Typography variant="h1" textColor="text-red-800">
        Heading 1 - Red 800
      </Typography>
      <Typography variant="h1" textColor="text-blue-800" italic>
        Heading 1 - Blue 800 (Italic)
      </Typography>
      <Typography variant="h1" textColor="text-green-800" underline>
        Heading 1 - Green 800 (Underline)
      </Typography>
      <Typography variant="h1" textColor="text-purple-800" linethrough>
        Heading 1 - Purple 800 (Line-through)
      </Typography>
      <Typography variant="h1" textColor="text-orange-600" uppercase>
        Heading 1 - Orange 600 (Uppercase)
      </Typography>

      <Typography variant="h2" textColor="text-indigo-800" lowercase>
        Heading 2 - Indigo 800 (Lowercase)
      </Typography>
      <Typography variant="h2" textColor="text-pink-800" italic underline>
        Heading 2 - Pink 800 (Italic & Underline)
      </Typography>
      <Typography variant="h2" textColor="text-gray-800" linethrough capitalize>
        Heading 2 - Gray 800 (Line-through & Capitalize)
      </Typography>

      <Typography variant="h3" textColor="text-yellow-500">
        Heading 3 - Yellow 500
      </Typography>
      <Typography variant="h3" textColor="text-teal-500" italic>
        Heading 3 - Teal 500 (Italic)
      </Typography>
      <Typography variant="h3" textColor="text-red-500" underline>
        Heading 3 - Red 500 (Underline)
      </Typography>

      {/* Lead and Large Text Variants */}
      <Typography variant="lead" textColor="text-blue-500">
        Lead Text - Blue 500
      </Typography>
      <Typography variant="lead" textColor="text-green-500" linethrough>
        Lead Text - Green 500 (Line-through)
      </Typography>
      <Typography variant="lead" textColor="text-purple-500" underline italic>
        Lead Text - Purple 500 (Underline & Italic)
      </Typography>

      <Typography variant="large" textColor="text-pink-500">
        Large Text - Pink 500
      </Typography>
      <Typography variant="large" textColor="text-orange-500" uppercase>
        Large Text - Orange 500 (Uppercase)
      </Typography>

      {/* Body Text with Different Colors and Styles */}
      <Typography variant="body" textColor="text-gray-500">
        Body Text - Gray 500
      </Typography>
      <Typography variant="body" textColor="text-yellow-500" italic>
        Body Text - Yellow 500 (Italic)
      </Typography>
      <Typography variant="body" textColor="text-teal-500" underline>
        Body Text - Teal 500 (Underline)
      </Typography>
      <Typography variant="body" textColor="text-red-800" lowercase>
        Body Text - Red 800 (Lowercase)
      </Typography>

      {/* Small and Tiny Text Variants */}
      <Typography variant="small" textColor="text-blue-500" italic>
        Small Text - Blue 500 (Italic)
      </Typography>
      <Typography variant="small" textColor="text-green-500" underline>
        Small Text - Green 500 (Underline)
      </Typography>

      <Typography variant="tiny" textColor="text-purple-500" capitalize>
        Tiny Text - Purple 500 (Capitalize)
      </Typography>
      <Typography variant="tiny" textColor="text-pink-500" italic>
        Tiny Text - Pink 500 (Italic)
      </Typography>

      {/* Section 1 */}
      <Typography variant="h1" textColor="text-blue-800">
        Section 1 - Main Heading
      </Typography>
      <Typography variant="body" textColor="text-gray-800">
        This is the main paragraph for Section 1. The content here explains the
        details of this section and provides useful information. It uses the
        default "body" variant with gray color.
      </Typography>

      {/* Section 2 */}
      <Typography variant="h2" textColor="text-green-800" italic>
        Section 2 - Subheading (Italic)
      </Typography>
      <Typography variant="body" textColor="text-gray-700">
        This paragraph supports the subheading above. It goes into more depth
        and offers additional insight. The text uses a body variant with a
        slightly lighter gray color.
      </Typography>

      {/* Section 3 */}
      <Typography variant="h3" textColor="text-purple-800" underline>
        Section h3 - Subheading (Underline)
      </Typography>
      <Typography variant="lead" textColor="text-blue-500" italic>
        This paragraph is styled using the lead variant. It is intended to be a
        highlighted section, offering important context or a call to action for
        readers. The color and style make it stand out with italic text and
        larger font size.
      </Typography>

      {/* Section 4 */}
      <Typography variant="h4" textColor="text-red-500" linethrough>
        Section h4 - Subheading (Line-through)
      </Typography>
      <Typography variant="large" textColor="text-teal-500">
        This is another paragraph using the "large" variant. It is slightly
        larger than the body text, making it a good choice for more prominent
        information. The teal color brings a calm and modern touch.
      </Typography>

      {/* Section 5 */}
      <Typography variant="h5" textColor="text-pink-600" uppercase>
        Section 5 - Subheading (Uppercase)
      </Typography>
      <Typography variant="body" textColor="text-gray-500">
        The paragraph for Section 5 provides content related to the heading
        above. It uses the body variant and a light gray color, keeping the text
        subtle while maintaining readability.
      </Typography>

      {/* Section 6 */}
      <Typography variant="h6" textColor="text-yellow-600" capitalize>
        Section 6 - Subheading (Capitalize)
      </Typography>
      <Typography variant="small" textColor="text-gray-600">
        This small text is intended to be less prominent but still important.
        It’s a perfect fit for additional notes or fine print, especially when
        you want to convey extra information without overwhelming the reader.
      </Typography>

      {/* Additional section examples */}
      <Typography variant="h2" textColor="text-indigo-800">
        Additional Section - Custom Styles
      </Typography>
      <Typography variant="body" textColor="text-red-800" italic underline>
        This paragraph uses a combination of italic and underline styles with a
        strong red color. It's great for emphasizing important information in a
        section.
      </Typography>
      <Typography variant="h3" textColor="text-orange-700" uppercase>
        Final Section - Uppercase Heading
      </Typography>
      <Typography variant="tiny" textColor="text-purple-500">
        This paragraph is tiny text, suitable for disclaimers or minor notes.
        Even though it is small, the purple color makes it noticeable and easy
        to read.
      </Typography>
    </div>
  );
};

const ButtonExamples = () => {
  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-wrap gap-4">
        <Button>Default Blue Button</Button>
        <Button variant="orange">Orange Button</Button>
        <Button variant="red">Red Button</Button>
        <Button variant="black">Black Button</Button>
        <Button variant="gray">Gray Button</Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button variant="outline">Outline Button</Button>
        <Button variant="ghost">Ghost Button</Button>
        <Button variant="link">Link Button</Button>
      </div>

      {/* States */}
      <div className="flex flex-wrap gap-4">
        <Button loading>Loading Button</Button>
        <Button disabled>Disabled Button</Button>
        <Button variant="outline" loading>
          Loading Outline
        </Button>
        <Button variant="ghost" disabled>
          Disabled Ghost
        </Button>
      </div>

      {/* Combined Examples */}
      <div className="flex flex-wrap gap-4">
        <Button variant="orange" size="lg" loading>
          Large Orange Loading
        </Button>
        <Button variant="red" size="xl" disabled>
          XL Red Disabled
        </Button>
        <Button variant="outline" size="sm">
          Small Outline
        </Button>
      </div>
    </div>
  );
};

const AdvancedColorPickerExample = () => {
  return <AdvancedColorPicker initColor="rgb(255,0,0)" onChange={() => {}} />;
};

const ModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModalFullscreen, setIsOpenModalFullscreen] = useState(false);

  return (
    <div className="p-8 space-y-4">
      <div>
        {' '}
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Example Modal"
        >
          <Typography variant="h1">
            This is an example modal component. You can use it to display
            additional information or actions in a separate window.
          </Typography>
          <Typography variant="h1">
            This is an example modal component. You can use it to display
            additional information or actions in a separate window.
          </Typography>
          <Typography variant="h1">
            This is an example modal component. You can use it to display
            additional information or actions in a separate window.
          </Typography>
          <Typography variant="h1">
            This is an example modal component. You can use it to display
            additional information or actions in a separate window.
          </Typography>
          <Typography variant="h1">
            This is an example modal component. You can use it to display
            additional information or actions in a separate window.
          </Typography>
          <Typography variant="body">
            This is an example modal component. You can use it to display
            additional information or actions in a separate window.
          </Typography>
        </Modal>
      </div>
      <div>
        <Button onClick={() => setIsOpenModalFullscreen(true)}>
          Open Fullscreen Modal
        </Button>
        <Modal
          isOpen={isOpenModalFullscreen}
          onClose={() => setIsOpenModalFullscreen(false)}
          title="Fullscreen Modal"
          size="fullscreen"
        >
          <Typography variant="body">
            This is a fullscreen modal. It covers the entire screen and is
            useful for displaying content that requires more space or focus.
          </Typography>
        </Modal>
      </div>
    </div>
  );
};

const TextInputExample: React.FC = () => {
  type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    alert(`Sended: ${JSON.stringify(data)}`);
  };

  return (
    <div className="bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <TextInput
          label="Name"
          name="firstName"
          register={register}
          validation={{
            required: 'This field is required',
            minLength: {
              value: 2,
              message: 'Minimum 2 characters',
            },
          }}
          errors={errors}
          placeholder="Name"
        />

        <TextInput
          label="Surname"
          name="lastName"
          register={register}
          errors={errors}
          placeholder="Surname"
          validation={{
            required: 'This field is required',
            maxLength: {
              value: 4,
              message: 'Maximum 4 characters',
            },
          }}
        />

        <TextInput
          label="Email"
          name="email"
          register={register}
          errors={errors}
          validation={{
            required: 'This field is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email',
            },
          }}
          placeholder="email@example.com"
        />

        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

const RichTextEditorExample = () => {
  return (
    <RichTextEditor
      content={{}}
      onChange={() => {}}
      contentType={ContentType.TEXT}
    />
  );
};

const SelectExample = () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  interface FormValues {
    value: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <div className="bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit((data) =>
          alert(`Sended: ${JSON.stringify(data)}`),
        )}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <Select
          name="selectValue"
          label="Select Country"
          options={options}
          register={register}
          errors={errors}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

const StyledLinkExample = () => {
  return (
    <div className="bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <StyledLink href="/" variant="default">
          Default Link
        </StyledLink>

        <StyledLink href="/" variant="primary">
          Primary Link
        </StyledLink>

        <StyledLink href="/" variant="secondary">
          Secondary Link
        </StyledLink>

        <StyledLink href="/" variant="underline">
          Underline Link
        </StyledLink>

        <StyledLink href="/" variant="button-blue">
          Blue Button Link
        </StyledLink>

        <StyledLink href="/" variant="button-orange">
          Orange Button Link
        </StyledLink>

        <StyledLink href="/" variant="button-red">
          Red Button Link
        </StyledLink>

        <StyledLink href="/" variant="button-black">
          Black Button Link
        </StyledLink>

        <StyledLink href="/" variant="button-gray">
          Gray Button Link
        </StyledLink>

        <StyledLink href="/" variant="button-outline">
          Outline Button Link
        </StyledLink>

        <StyledLink href="/" variant="button-ghost">
          Ghost Button Link
        </StyledLink>

        <StyledLink href="/" variant="button-link">
          Button Link Style
        </StyledLink>
      </div>
    </div>
  );
};

const SelectBaseExample = () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <>
      <div className="bg-gray-100 p-4">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
          <SelectBase options={options} onChange={() => {}} />
        </div>
      </div>
      <div className="bg-gray-100 p-4">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
          <SelectBase options={options} onChange={() => {}} value="option3" />
        </div>
      </div>
    </>
  );
};

const SliderExample = () => {
  const steps = [
    { label: 'Min', value: 0 },
    { label: 'Low', value: 25 },
    { label: 'Med', value: 50 },
    { label: 'High', value: 75 },
    { label: 'Max', value: 100 },
  ];

  const [sliderWithStepsValue, setSliderWithStepsValue] = useState(0);
  const [sliderWithRangeValue, setSliderWithRangeValue] = useState(0);

  return (
    <div className="w-full max-w-md pl-6">
      <div className="w-full max-w-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Slider with steps</h2>
        <Slider
          steps={steps}
          defaultValue={50}
          onChange={setSliderWithStepsValue}
        />
        <p className="mt-4 text-center">Value: {sliderWithStepsValue}</p>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Slider with range</h2>
        <Slider
          min={0}
          max={100}
          step={1}
          defaultValue={50}
          onChange={setSliderWithRangeValue}
        />
        <p className="mt-4 text-center">Value: {sliderWithRangeValue}</p>
      </div>
    </div>
  );
};

const ButtonSelectedExamples = () => {
  return (
    <div className="space-y-4 p-8">
      <Typography variant="h2">Selected Button Variants</Typography>

      <div className="flex flex-wrap gap-4">
        <Button variant="blue" selected>
          Selected Blue
        </Button>
        <Button variant="orange" selected>
          Selected Orange
        </Button>
        <Button variant="red" selected>
          Selected Red
        </Button>
        <Button variant="black" selected>
          Selected Black
        </Button>
        <Button variant="gray" selected>
          Selected Gray
        </Button>
        <Button variant="outline" selected>
          Selected Outline
        </Button>
        <Button variant="ghost" selected>
          Selected Ghost
        </Button>
        <Button variant="link" selected>
          Selected Link
        </Button>
      </div>
    </div>
  );
};

const ContentMenuExample = () => {
  const menuItems = [
    {
      label: 'Edit',
      onClick: () => console.log('Edit'),
    },
    {
      label: 'Delete',
      onClick: () => console.log('Delete'),
    },
  ];

  return (
    <div className="p-4 space-x-4">
      <ContextMenu items={menuItems} />
      <ContextMenu label="Actions" items={menuItems} />
    </div>
  );
};

const ToastExample = () => {
  const { toast, success, error, warning, info } = useToast();

  return (
    <div className="p-8 space-y-8 border-b border-gray-200">
      <Typography variant="h2">Toast Notifications</Typography>
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={() =>
            toast({
              title: 'Default Toast',
              description: 'This is a default toast notification',
              duration: 3000,
            })
          }
        >
          Show Default Toast
        </Button>

        <Button
          onClick={() =>
            success({
              title: 'Success',
              description: 'Operation completed successfully!',
              duration: 3000,
            })
          }
          variant="blue"
        >
          Show Success Toast
        </Button>

        <Button
          onClick={() =>
            error({
              title: 'Error',
              description: 'Something went wrong!',
              duration: 3000,
            })
          }
          variant="red"
        >
          Show Error Toast
        </Button>

        <Button
          onClick={() =>
            warning({
              title: 'Warning',
              description: 'This action might have consequences',
              duration: 3000,
            })
          }
          variant="orange"
        >
          Show Warning Toast
        </Button>

        <Button
          onClick={() =>
            info({
              title: 'Information',
              description: 'Here is some useful information',
              duration: 3000,
            })
          }
          variant="gray"
        >
          Show Info Toast
        </Button>
      </div>
    </div>
  );
};

export default function DesignSystem() {
  return (
    <div className="w-full pb-10">
      <Typography variant="h1" className="p-8">
        Design System
      </Typography>
      <TypographyExample />
      <ButtonExamples />
      <ButtonSelectedExamples />
      <AdvancedColorPickerExample />
      <ModalExample />
      <TextInputExample />
      <RichTextEditorExample />
      <SelectExample />
      <TextEditor />
      <StyledLinkExample />
      <SelectBaseExample />
      <SliderExample />
      <ContentMenuExample />
      <ToastExample />
    </div>
  );
}
