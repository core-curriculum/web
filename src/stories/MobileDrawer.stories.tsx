import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ReactNode } from "react-markdown/lib/react-markdown";
import { MobileDrawer } from "../components/MobileDrawer";

function* range(start: number, end: number) {
  let num = start;
  while (num < end) {
    yield num;
    num += 1;
  }
}

const DummyMenu = () => {
  return (
    <div className=" bg-yellow-400">
      <div>{[...range(1, 101)].map(() => "LongItem")}</div>
      {[...range(1, 101)].map((i) => (
        <div key={i}>Menu item{i}</div>
      ))}
    </div>
  );
};

const DummyContent = () => {
  return (
    <div className="bg-blue-500">
      <div>{[...range(1, 101)].map(() => "LongItem ")}</div>
      {[...range(1, 101)].map((i) => (
        <div key={i}>Content item{i}</div>
      ))}
    </div>
  );
};

type Prop = {
  menu: ReactNode;
  content: ReactNode;
  showMenu: boolean;
};
const TargetComponent = ({ menu, content }: { menu: ReactNode; content: ReactNode }) => {
  const id = "mobileDrawHiddenCheckBox";
  return (
    <>
      <label htmlFor={id}>Click to toggle(Can toggle only in small screen)</label>
      <MobileDrawer menu={menu} content={content} labelId={id} />
    </>
  );
};

export default {
  title: "Layout/MobileDrawer",
  component: TargetComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof TargetComponent>;

const Template: ComponentStory<typeof TargetComponent> = (args) => <TargetComponent {...args} />;

export const ShowMenu = Template.bind({});
ShowMenu.args = {
  menu: <DummyMenu />,
  content: <DummyContent />,
};
