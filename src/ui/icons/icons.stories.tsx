import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { DownloadIcon, PdfIcon } from ".";

const IconList = () => {
  return (
    <div className="flex flex-col gap-2">
      <DownloadIcon />
      <PdfIcon />
    </div>
  );
};

const TargetComponent = IconList;

export default {
  title: "ui/icons",
  component: TargetComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
} as Meta<typeof TargetComponent>;

const Template: StoryFn<typeof TargetComponent> = args => <TargetComponent />;

export const SimpleItems = Template.bind({});
