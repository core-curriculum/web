import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";
import { ItemListList, ItemListListProps } from "@components/ItemListList";
import { ServerItemList } from "@services/itemList/server";

const dummyItemListList = [
  {
    id: "1",
    data: {
      name: "name1",
      place: "place1",
    },
    created_at: new Date("2021-01-01T00:00:00Z"),
    items: [],
    schema_id: "",
    from_id: "",
  },
  {
    id: "2",
    data: {
      name: "name2",
      place: "place2",
    },
    created_at: new Date("2021-01-02T00:00:00Z"),
    items: [],
    schema_id: "",
    from_id: "",
  },
  {
    id: "3",
    data: {
      name: "name3",
      place: "place3",
    },
    created_at: new Date("2021-01-03T00:00:00Z"),
    items: [],
    schema_id: "",
    from_id: "",
  },
];

const TargetComponent = (props: ItemListListProps) => {
  const [list, setList] = useState(props.itemListList as ServerItemList[]);
  const onChange = (newList: ServerItemList[]) => {
    setList(newList);
  };
  return (
    <div>
      <ItemListList itemListList={list} onChange={onChange} />
    </div>
  );
};

export default {
  title: "Components/ItemListList",
  component: TargetComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
} as ComponentMeta<typeof ItemListList>;
const Template: ComponentStory<typeof TargetComponent> = args => <TargetComponent {...args} />;

export const SimpleItems = Template.bind({});
SimpleItems.args = { itemListList: dummyItemListList };
