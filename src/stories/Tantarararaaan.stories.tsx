import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { useTantarararaaan } from "../components/Tantarararaaan";

const TargetComponent = ({ duration = 1000 }: { duration: number }) => {
  const { EffectComponent, fire } = useTantarararaaan(duration);
  const handleClick = () => {
    fire();
  };
  return (
    <div>
      <button onClick={handleClick}>click</button>
      <div className="relative h-4 w-4 rounded-full bg-black">
        <EffectComponent />
      </div>
    </div>
  );
};

export default {
  title: "Components/Tantarararaaan",
  component: TargetComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
} as Meta<typeof TargetComponent>;

const Template: StoryFn<typeof TargetComponent> = args => <TargetComponent {...args} />;

export const SimpleItems = Template.bind({});
SimpleItems.args = {
  duration: 1000,
};
