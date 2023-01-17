import Link from "next/link";
import type { ReactNode } from "react";
import React from "react";
import { ItemContextMenu } from "@components/ItemContextMenu";
import { applyMappedInfo } from "@libs/textMapper";
import type { MappedInfo } from "@libs/textMapper";
import type { Tree } from "@libs/treeUtils";
import { reduceTree } from "@libs/treeUtils";
import type {
  OutcomeInfo,
  Outcomel1 as L1,
  Outcomel2 as L2,
  Outcomel3 as L3,
  Outcomel4 as L4,
  AttrInfo,
} from "@services/outcomes";

type PropType<T extends OutcomeInfo> = {
  item: T;
  childnodes: ReactNode;
  parents: OutcomeInfo[];
  idList: string;
};
type OutcomesTreeProps = { outcomesTree: Tree<OutcomeInfo> };

const OutcomesTree = ({ outcomesTree }: OutcomesTreeProps) => (
  <div className="max-w-none pb-96">
    {reduceTree<OutcomeInfo, ReactNode>(outcomesTree, (item, childnodes, parents) => {
      const idList = [...parents.map((u) => u.id), item.id].join(",");
      const props = { childnodes, parents, idList, key: item.id };
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

const MappedText = ({ text, map }: { text: string; map: MappedInfo<AttrInfo>[] }) => {
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
                className="cursor-pointer text-sky-500 hover:underline"
              >
                {text}
              </Link>
            );
        }
        return <>{"unknown:" + text + ":" + attr.type}</>;
      })}
    </>
  );
};

const Outcomel1 = ({ item: { index, id, text, desc }, childnodes, idList }: PropType<L1>) => (
  <section className="mb-64">
    <h1 className="mb-4 bg-white/30 py-6 px-4 text-3xl shadow-md" id={id} data-id-list={idList}>
      <span className="pr-2 font-thin">{index}</span>
      <span className="mr-4 font-bold">{text}</span>
      <ItemContextMenu {...{ index, id }} />
    </h1>
    <p className="mt-4 px-8 text-gray-500">{desc}</p>
    {childnodes}
  </section>
);

const Outcomel2 = ({ item: { index, id, text, desc }, childnodes, idList }: PropType<L2>) => (
  <section className="mt-24">
    <h2 className="bg-white/30 p-4 text-xl shadow" id={id} data-id-list={idList}>
      <span className="pr-2 font-thin">{index}</span>
      <span className="mr-2 font-bold">{text}</span>
      <ItemContextMenu {...{ id, index }} />
    </h2>
    <p className="mt-4 px-4 text-gray-500">{desc}</p>
    {childnodes}
  </section>
);

const Outcomel3 = ({ item: { index, id, text, attrInfo }, childnodes, idList }: PropType<L3>) => {
  return (
    <section className="mt-12">
      <h2 className="bg-white/30 p-4 text-lg shadow-sm" data-id-list={idList} id={id}>
        <span className="pr-2 font-thin">{index}</span>
        <span className="mr-2">{attrInfo ? <MappedText text={text} map={attrInfo} /> : text}</span>
        <ItemContextMenu {...{ id, index }} />
      </h2>
      <ul className="mt-2">{childnodes}</ul>
    </section>
  );
};

const Outcomel4 = ({ item: { id, text, attrInfo, index } }: PropType<L4>) => {
  return (
    <li className="mr-4 ml-10 list-disc py-1 marker:text-sky-200 " id={id}>
      <span className="mr-2 text-gray-500">
        {attrInfo ? <MappedText text={text} map={attrInfo} /> : text}
      </span>
      <ItemContextMenu {...{ id, index }} />
    </li>
  );
};

export { Outcomel1, Outcomel2, Outcomel3, Outcomel4, OutcomesTree };
