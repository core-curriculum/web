import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { Toaster } from "react-hot-toast";
import { LinkToItemList } from "../components/LinkToItemList";
import type { LinkToItemListProp } from "../components/LinkToItemList";

const TargetComponent = (props: LinkToItemListProp) => {
  return (
    <div>
      <LinkToItemList {...props} />
      <Toaster />
    </div>
  );
};

export default {
  title: "Layout/LinktoItemList",
  component: TargetComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
} as ComponentMeta<typeof TargetComponent>;

const Template: ComponentStory<typeof TargetComponent> = (args) => <TargetComponent {...args} />;

export const SimpleItems = Template.bind({});
SimpleItems.args = {
  count: 1,
  href: "#",
};