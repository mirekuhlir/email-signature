"use client";
import { useState } from "react";
import AdvancedColorPicker from "@/components/advanced-color-picker";
import { Button } from "@/components/design-system/button";
import { Typography } from "@/components/design-system/typography";
import Modal from "@/components/design-system/modal";
import { useForm, SubmitHandler } from "react-hook-form";
import TextInput from "@/components/design-system/text-input";
import RichTextEditor from "@/components/design-system/rich-text-editor";
import Select from "@/components/design-system/select";

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
        Section 3 - Subheading (Underline)
      </Typography>
      <Typography variant="lead" textColor="text-blue-500" italic>
        This paragraph is styled using the lead variant. It is intended to be a
        highlighted section, offering important context or a call to action for
        readers. The color and style make it stand out with italic text and
        larger font size.
      </Typography>

      {/* Section 4 */}
      <Typography variant="h4" textColor="text-red-500" linethrough>
        Section 4 - Subheading (Line-through)
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

const ModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModalFullscreen, setIsOpenModalFullscreen] = useState(false);

  return (
    <div className="p-8 space-y-4">
      <div>
        {" "}
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
            required: "This field is required",
            minLength: {
              value: 2,
              message: "Minimum 2 characters",
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
            required: "This field is required",
            maxLength: {
              value: 4,
              message: "Maximum 4 characters",
            },
          }}
        />

        <TextInput
          label="Email"
          name="email"
          register={register}
          errors={errors}
          validation={{
            required: "This field is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email",
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
  return <RichTextEditor />;
};

const SelectExample = () => {
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
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
          alert(`Sended: ${JSON.stringify(data)}`)
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

export default function DesignSystem() {
  return (
    <div className="w-full">
      <TypographyExample />
      <ButtonExamples />
      <AdvancedColorPicker />
      <ModalExample />
      <TextInputExample />
      <RichTextEditorExample />
      <SelectExample />
    </div>
  );
}
