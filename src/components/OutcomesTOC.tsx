import Link from "next/link";
import { ReactNode, useCallback, useState } from "react";
import { useScrollObserver } from "@hooks/IntersecterObserver";
import type { Tree } from "@libs/treeUtils";
import { reduceTree } from "@libs/treeUtils";
import type { OutcomeInfo } from "@services/outcomes";

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
        return <span key={item.id}></span>;
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

type MenuItemProps = {
  children: ReactNode;
  padding?: string;
  size?: string;
  href: string;
  targeted?: boolean;
};
const MenuItem = ({ children, padding, size, href, targeted }: MenuItemProps) => {
  padding ??= "pl-2";
  size ??= "";
  const linkProps = {
    className: `block w-full truncate border-l-4 py-3 ${padding} ${size}
    hover:bg-info/20 hover:underline ${targeted ? " border-info " : "border-transparent"}`,
    href,
  };
  return (
    <div className="z-10 bg-base-100 hover:text-info">
      {href.startsWith("#") ? (
        <a {...linkProps}>{children}</a>
      ) : (
        <Link {...linkProps}>{children}</Link>
      )}
    </div>
  );
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
  const menuItemProps = {
    padding,
    size,
    href: id,
    targeted,
  };
  return (
    <li
      title={item.text}
      className={`${
        targeted ? "text-info" : "text-base-content"
      } transition-all duration-500 ease-in-out`}
    >
      <MenuItem {...menuItemProps}>
        <span className={`pr-1 font-thin`}>{item.index.slice(-2)}</span>
        {item.text}
      </MenuItem>
      {item.layer !== "l3" ? <ChildList active={active} childnodes={childnodes} /> : ""}
    </li>
  );
};

export { OutcomesTOC, MenuItem };
