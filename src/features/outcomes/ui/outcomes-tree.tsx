import Link from "next/link";
import type { ReactNode } from "react";
import React from "react";
import { applyMappedInfo } from "@libs/textMapper";
import type { MappedInfo } from "@libs/textMapper";
import type { Tree } from "@libs/treeUtils";
import { reduceTree } from "@libs/treeUtils";
import { AttrInfo } from "../attrInfo";
import type {
  OutcomeInfo,
  Outcomel1 as L1,
  Outcomel2 as L2,
  Outcomel3 as L3,
  Outcomel4 as L4,
} from "../outcomes";

type PropType<T extends OutcomeInfo> = {
  item: T;
  childnodes: ReactNode;
  parents: OutcomeInfo[];
  optionButton?: (id: string) => ReactNode;
  idList: string;
};
type OutcomesTreeProps = { outcomesTree: Tree<OutcomeInfo>,optionButton?: (id: string) => ReactNode; };

const OutcomesTree = ({ outcomesTree,optionButton }: OutcomesTreeProps) => (
  <div className="max-w-none pb-96">
    {reduceTree<OutcomeInfo, ReactNode>(outcomesTree, (item, childnodes, parents) => {
      const idList = [...parents.map(u => u.id), item.id].join(",");
      const props = { childnodes, parents, idList, key: item.id,optionButton };
      switch (item.layer) {
        case "l1":
          return <Outcomel1 item={item} {...props} />;
        case "l2":
          return <Outcomel2 item={item} {...props} />;
        case "l3":
          return <Outcomel3 item={item} {...props} />;
      }
      return <Outcomel4 item={item} {...props} />;
    })}
  </div>
);

const StyledText = ({ text, map }: { text: string; map: MappedInfo<AttrInfo>[] }) => {
  return (
    <>
      {applyMappedInfo(text, map, (text, attr, key) => {
        switch (attr.type) {
          case "tableLink":
            return (
              <Link
                href={attr.url}
                key={attr.id}
                title={attr.title}
                className="link-hover link-info link"
              >
                {text}
              </Link>
            );
          case "sub":
            return <span className="align-super text-[20%]">{text}</span>;
        }
        return <>{"unknown:" + text + ":" + attr.type}</>;
      })}
    </>
  );
};

const Outcomel1 = ({ item: { index, id, text, desc }, childnodes, idList,optionButton }: PropType<L1>) => (
  <section className="mb-64">
    <h1
      className="bg-base-100/20 text-base-content/60 mb-4 flex items-center 
      px-4 py-6 text-3xl shadow-md"
      id={id}
      data-id-list={idList}
    >
      <span className="pr-2 font-thin">{index}</span>
      <span className=" font-bold">{text}</span>
      {optionButton?.(id)}
    </h1>
    <p className="text-base-content/90 mt-4 px-8">{desc}</p>
    {childnodes}
  </section>
);

const Outcomel2 = ({ item: { index, id, text, desc }, childnodes, idList,optionButton }: PropType<L2>) => (
  <section className="mt-24">
    <h2
      className="bg-base-100/20 text-base-content/60 flex items-center p-4 text-xl shadow "
      id={id}
      data-id-list={idList}
    >
      <span className="pr-2 font-thin">{index}</span>
      <span className="font-bold">{text}</span>
      {optionButton?.(id)}
    </h2>
    <p className="text-base-content/90 mt-4 px-4">{desc}</p>
    {childnodes}
  </section>
);

const Outcomel3 = ({ item: { index, id, text, attrInfo }, childnodes, idList,optionButton }: PropType<L3>) => {
  return (
    <section className="mt-12">
      <h2
        className="bg-base-100/20 flex items-center p-4 text-lg shadow-sm "
        data-id-list={idList}
        id={id}
      >
        <span className="pr-2 font-thin">{index}</span>
        <span className="">{attrInfo ? <StyledText text={text} map={attrInfo} /> : text}</span>
        {optionButton?.(id)}
      </h2>
      <ul className="mt-2">{childnodes}</ul>
    </section>
  );
};

const Outcomel4 = ({ item: { id, text, attrInfo, index },optionButton }: PropType<L4>) => {
  return (
    <li className="ml-6 mr-4 flex list-disc items-center py-1" id={id}>
      <span className="whitespace-nowrap pr-2 text-xs font-thin">{index}</span>
      <span className="text-base-content/90">
        {attrInfo ? <StyledText text={text} map={attrInfo} /> : text}
      </span>
      {optionButton?.(id)}
    </li>
  );
};

export { Outcomel1, Outcomel2, Outcomel3, Outcomel4, OutcomesTree };
