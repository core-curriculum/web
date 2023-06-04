import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { Toaster } from "react-hot-toast";
import type { ConfirmDialogProps } from "@components/ConfirmDialog";
import { ConfirmDialog, showDialog } from "@hooks/useConfirmDialog";

const TargetComponent = (props: ConfirmDialogProps) => {
  return (
    <div>
      <ConfirmDialog />
      <button
        onClick={async () => {
          const res = await showDialog(props);
          confirm(res);
        }}
      >
        表示
      </button>
      <Toaster />
    </div>
  );
};

export default {
  title: "Components/ConfirmDialogFn",
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

export const NoItems = Template.bind({});
NoItems.args = {
  title: "test",
  content: <span>aaaa</span>,
  show: true,
  onClose: key => confirm(key),
};
