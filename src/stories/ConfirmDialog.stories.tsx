import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import type { ConfirmDialogProps } from "@components/ConfirmDialog";
import { showConfirmDialog } from "@components/ConfirmDialog";
import { ModalProvider } from "@components/Modal";

const TargetComponent = (props: ConfirmDialogProps) => {
  return (
    <div>
      <button
        onClick={async () => {
          const res = await showConfirmDialog(props);
          confirm(res);
        }}
      >
        表示
      </button>
      <ModalProvider />
    </div>
  );
};

export default {
  title: "Components/ConfirmDialog",
  component: TargetComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
} as Meta<typeof TargetComponent>;

const Template: StoryFn<typeof TargetComponent> = args => <TargetComponent {...args} />;

export const SimpleItems = Template.bind({});
SimpleItems.args = {
  title: "test",
  content: <span>aaaa</span>,
  choises: ["閉じる", "キャンセル"],
  primary: "キャンセル",
};

export const NoItems = Template.bind({});
NoItems.args = {
  title: "test",
  content: <span>aaaa</span>,
};
