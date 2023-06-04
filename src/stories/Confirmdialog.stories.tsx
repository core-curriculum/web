import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { Toaster } from "react-hot-toast";
import { ConfirmDialog } from "@components/ConfirmDialog";
import type { ConfirmDialogProps } from "@components/ConfirmDialog";

const TargetComponent = (props: ConfirmDialogProps) => {
  return (
    <div>
      <ConfirmDialog {...props} />
      <Toaster />
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
  show: true,
  onClose: key => confirm(key),
};

export const DisableItem = Template.bind({});
DisableItem.args = {
  title: "test",
  content: <span>aaaa</span>,
  choises: ["閉じる", "キャンセル"],
  disables: ["閉じる"],
  primary: "キャンセル",
  show: true,
  onClose: key => confirm(key),
};
export const NoItems = Template.bind({});
NoItems.args = {
  title: "test",
  content: <span>aaaa</span>,
  show: true,
  onClose: key => confirm(key),
};
