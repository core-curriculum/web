import { ReactNode, useCallback, useState } from "react";
import { useScrollObserver } from "@hooks/IntersecterObserver";
import type { Tree } from "@libs/treeUtils";
import { reduceTree } from "@libs/treeUtils";
import type {
  OutcomeInfo,
  Outcomel1 as L1,
  Outcomel2 as L2,
  Outcomel3 as L3,
} from "@services/outcomes";

type PropType<L extends OutcomeInfo> = {
  item: L;
  childnodes: ReactNode;
  idList: string;
  active: boolean;
  targeted: boolean;
};
type OutcomesTreeProps = { outcomesTree: Tree<OutcomeInfo> };

type ElementWithData = Element & { dataset?: { idList?: string } };
const getLast = <T extends readonly unknown[]>(arr: T) => arr[arr.length - 1];
const OutcomesTOC = ({ outcomesTree }: OutcomesTreeProps) => {
  const [idList, setIdList] = useState("");
  const onIntersect = useCallback((e: Element) => {
    const ids = (e as ElementWithData)?.dataset?.idList ?? "";
    setIdList(ids);
  }, []);
  useScrollObserver({
    onIntersect,
    selector: "[data-id-list]",
    rootMargin: "-10% 0px -90% 0px",
    single: true,
    rootSelector: "#MainContents",
  });

  return (
    <ul className="relative overflow-hidden transition-all ">
      {reduceTree<OutcomeInfo, ReactNode>(outcomesTree, (item, childnodes, parents) => {
        const active = idList.includes(item.id);
        const targeted = getLast(idList.split(",")) === item.id;
        const props = { childnodes, idList, active, targeted };
        switch (item.layer) {
          case "l1":
            return <ItemList key={item.id} item={item} {...props} />;
          case "l2":
            return <ItemList key={item.id} item={item} {...props} />;
          case "l3":
            return <ItemList key={item.id} item={item} {...props} />;
        }
        return <></>;
      })}
    </ul>
  );
};

const ChildList = ({ active, childnodes }: { active: boolean; childnodes: ReactNode }) => {
  return (
    <div className="overflow-y-hidden">
      <ul
        className={`overflow-y-hidden transition-all duration-500 ease-in-out${
          active ? "scale-y-100" : "invisible h-0"
        }`}
      >
        {childnodes}
      </ul>
    </div>
  );
};

const ItemText = ({ children }: { targeted: boolean; children: ReactNode }) => {
  return <span>{children}</span>;
};

const ItemList = <L extends OutcomeInfo>({ item, childnodes, active, targeted }: PropType<L>) => {
  if (item.layer === "l4") throw new Error("Invalid layer(l4)");
  const id = `#${item.id}`;
  const padding = {
    l1: "pl-2",
    l2: "pl-6",
    l3: "pl-12",
  }[item.layer];
  const size = {
    l1: "",
    l2: "text-sm",
    l3: "text-sm",
  }[item.layer];
  return (
    <li
      title={item.text}
      className={`${
        targeted ? "text-sky-500" : "text-gray-400"
      } transition-all duration-500 ease-in-out`}
    >
      <div className="z-10 bg-white hover:text-sky-600">
        <a
          className={`block w-full truncate border-l-4 py-3 ${padding} ${size}
          hover:bg-sky-100 hover:underline ${targeted ? " border-sky-400 " : "border-transparent"}`}
          href={id}
        >
          <ItemText targeted={targeted}>
            <span className={`pr-1 font-thin`}>{item.index.slice(-2)}</span>
            {item.text}
          </ItemText>
        </a>
      </div>
      {item.layer !== "l3" ? <ChildList active={active} childnodes={childnodes} /> : ""}
    </li>
  );
};

const L1List = ({ item, childnodes, active, targeted }: PropType<L1>) => {
  const id = `#${item.id}`;
  return (
    <li title={item.text} className="text-sky-500 transition-all duration-500 ease-in-out">
      <div className="z-10 bg-white hover:text-sky-600">
        <a
          className={`block w-full truncate rounded-md border-l-4 py-3
          pl-2 hover:bg-sky-100 hover:underline ${
            targeted ? " border-sky-400 bg-sky-100" : "border-transparent"
          }`}
          href={id}
        >
          <ItemText targeted={targeted}>
            <span className={`pr-1 font-thin`}>{item.index}</span>
            {item.text}
          </ItemText>
        </a>
      </div>
      <ChildList active={active} childnodes={childnodes} />
    </li>
  );
};

const L2List = ({ item, childnodes, active, targeted }: PropType<L2>) => {
  const text = `${item.index}: ${item.text}`;
  const id = `#${item.id}`;
  return (
    <li
      title={item.text}
      className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm
      text-sky-500 
      "
    >
      <span className="hover:text-sky-600">
        <a
          className={`w-82 block truncate rounded-md border-l-4 py-3 
          pl-6 pr-1 hover:text-clip  hover:bg-sky-100 hover:underline
          ${targeted ? " border-sky-400 bg-sky-100" : "border-transparent"} 
          `}
          href={id}
        >
          <ItemText targeted={targeted}>{item.text}</ItemText>
        </a>
      </span>
      <ChildList active={active} childnodes={childnodes} />
    </li>
  );
};

const L3List = ({ item, active, targeted }: PropType<L3>) => {
  const text = `${item.index}: ${item.text}`;
  const id = `#${item.id}`;
  return (
    <li className="overflow-hidden text-sky-500" title={item.text}>
      <span className="hover:text-sky-600">
        <a
          className={`block truncate rounded-md border-l-4 py-3 
          pl-12 pr-1 hover:text-clip  hover:bg-sky-100 hover:underline 
          ${targeted ? " border-sky-400 bg-sky-100" : "border-transparent"} 
          `}
          href={id}
        >
          <ItemText targeted={targeted}>{item.text}</ItemText>
        </a>
      </span>
    </li>
  );
};

export { OutcomesTOC };
