import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ContextMenu } from "../components/ContextMenu";

const TargetComponent = ContextMenu;

export default {
  title: "Layout/ContextMenu",
  component: TargetComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
} as ComponentMeta<typeof TargetComponent>;

const Template: ComponentStory<typeof TargetComponent> = (args) => <TargetComponent {...args} />;

export const SimpleItems = Template.bind({});
SimpleItems.args = {
  items: [{ name: "item1" }, { name: "item2" }],
};

export const ClickItems = Template.bind({});
ClickItems.args = {
  onClick: (name) => alert(name),
  items: [
    { name: "item1", label: "label1" },
    { name: "item2", label: "label2" },
  ],
};

const copyToClip = async (text: string) => await navigator.clipboard.writeText(text);

export const CopyItems = Template.bind({});
CopyItems.args = {
  onClick: (name) => copyToClip(name),
  items: [
    { name: "item1", label: "label1" },
    { name: "item2", label: "label2" },
  ],
};
