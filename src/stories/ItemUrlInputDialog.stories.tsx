import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { Toaster } from "react-hot-toast";
import { showItemUrlInputComponentDialog } from "@components/ItemUrlInputDialog";
import { ModalProvider } from "@components/Modal";

const TargetComponent = () => {
  return (
    <div>
      <button
        onClick={async () => {
          const res = await showItemUrlInputComponentDialog();
          confirm(res?.toString());
        }}
      >
        表示
      </button>
      <ModalProvider />
      <Toaster />
    </div>
  );
};

export default {
  title: "Components/ItemUrlInputDialog",
  component: TargetComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
} as Meta<typeof TargetComponent>;

const Template: StoryFn<typeof TargetComponent> = args => <TargetComponent />;

export const SimpleItems = Template.bind({});
SimpleItems.args = {};
