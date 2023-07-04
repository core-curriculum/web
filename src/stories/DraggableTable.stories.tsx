import { Meta, StoryFn } from "@storybook/react";
import { useState } from "react";
import { DraggableTable, DraggableTableProps, TableRow } from "@components/DraggableTable";

const dummyProps = {
  header: ["name", "place", "createdAt"],
  data: [
    {
      id: "1",
      name: "1_apple",
      place: "Nagoya",
      createdAt: "2021-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "2_orange",
      place: "Tokyo",
      createdAt: "2023-10-06T00:00:00Z",
    },
    {
      id: "3",
      name: "3_banana",
      place: "Aomori",
      createdAt: "2015-06-11T00:00:00Z",
    },
  ],
};

const TargetComponent = (props: DraggableTableProps) => {
  const [data, setData] = useState(props.data);
  const onChange = (newData: readonly TableRow[]) => {
    setData(newData);
  };
  return (
    <div>
      <DraggableTable header={props.header} data={data} onChange={onChange} />
    </div>
  );
};

export default {
  title: "Components/DraggableTable",
  component: TargetComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
} as Meta<typeof DraggableTable>;
const Template: StoryFn<typeof TargetComponent> = args => <TargetComponent {...args} />;

export const SimpleItems = Template.bind({});
SimpleItems.args = { ...dummyProps };
