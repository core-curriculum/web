import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";
import { ItemListCheckList, ItemListCheckListProps } from "@components/ItemListCheckList";

const dummyItemListList = [
  {
    id: "1",
    data: {},
    name: "name1",
    place: "place1",

    created_at: new Date("2021-01-01T00:00:00Z"),
    items: [],
    schema_id: "",
    from_id: "",
  },
  {
    id: "2",
    data: {},
    name: "name2",
    place: "place2",
    created_at: new Date("2021-01-02T00:00:00Z"),
    items: [],
    schema_id: "",
    from_id: "",
  },
  {
    id: "3",
    data: {},
    name: "name3",
    place: "place3",
    created_at: new Date("2021-01-03T00:00:00Z"),
    items: [],
    schema_id: "",
    from_id: "",
  },
];

const TargetComponent = (props: ItemListCheckListProps) => {
  const [list, setList] = useState([] as number[]);
  const onChange = (newList: number[]) => {
    setList(newList);
  };
  return (
    <div>
      <ItemListCheckList itemListList={props.itemListList} checkedList={list} onChange={onChange} />
    </div>
  );
};

export default {
  title: "Components/ItemListCheckList",
  component: TargetComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
} as ComponentMeta<typeof ItemListCheckList>;
const Template: ComponentStory<typeof TargetComponent> = args => <TargetComponent {...args} />;

export const SimpleItems = Template.bind({});
SimpleItems.args = { itemListList: dummyItemListList };
