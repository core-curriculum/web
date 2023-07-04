import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { ToastProps, ToastProvider, toast } from "@components/toast";

const TargetComponent = (props: ToastProps) => {
  return (
    <div className="pt-[20rem]">
      <button onClick={() => toast(props)}>表示</button>
      <ToastProvider />
    </div>
  );
};

export default {
  title: "Components/Toast",
  component: TargetComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
} as Meta<typeof TargetComponent>;

const Template: StoryFn<typeof TargetComponent> = args => <TargetComponent {...args} />;

export const SimpleItems = Template.bind({});
SimpleItems.args = {
  message: "test",
};

export const NoItems = Template.bind({});
NoItems.args = {
  message: "test",
};
