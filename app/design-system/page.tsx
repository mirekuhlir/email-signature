import AdvancedColorPicker from "@/components/advanced-color-picker";
import { Button } from "@/components/design-system/button/button";

export const ButtonExamples = () => {
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

export default async function DesignSystem() {
  return (
    <div className="w-full">
      <ButtonExamples />
      <AdvancedColorPicker />
    </div>
  );
}
