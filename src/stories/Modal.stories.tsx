import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { ModalContentFunction, ModalProvider, showModal } from "@components/Modal";
import type { ModalProps } from "@components/Modal";
import { ToastProvider, toast } from "@components/toast";

const dialogContent: ModalContentFunction<string> = (ok, cancel) => {
  return (
    <div>
      <button className="btn" onClick={() => ok("aaa")}>
        aaa
      </button>
      <button className="btn" onClick={() => ok("bbb")}>
        bbb
      </button>
      <button className="btn" onClick={() => cancel()}>
        cancel
      </button>
    </div>
  );
};

const TargetComponent = (props: ModalProps) => {
  return (
    <div>
      <button
        onClick={async () => {
          const response = await showModal(dialogContent);
          toast(JSON.stringify(response, null, 2));
        }}
      >
        open
      </button>
      <ModalProvider />
      <ToastProvider />
    </div>
  );
};

export default {
  title: "Components/Modal",
  component: TargetComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
} as Meta<typeof TargetComponent>;

const Template: StoryFn<typeof TargetComponent> = args => <TargetComponent {...args} />;

export const SimpleItems = Template.bind({});
SimpleItems.args = {
  children: <span>aaaa</span>,
};
