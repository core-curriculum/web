import Link from "next/link";
import type { ReactNode } from "react";
import React from "react";
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

const Outcomel1 = ({ item, childnodes, idList }: PropType<L1>) => (
  <section className="mb-64">
    <h1
      className="mb-4 bg-white/30 py-6 px-4 text-3xl shadow-md backdrop-blur-sm"
      id={item.id}
      data-id-list={idList}
    >
      <span className="pr-2 font-thin">{item.index}</span>
      <span className="font-bold">{item.text}</span>
      <span className="pl-2 text-sm font-normal text-gray-500">{item.id}</span>
    </h1>
    <p className="mt-4 px-8 text-gray-500">{item.desc}</p>
    {childnodes}
  </section>
);

const Outcomel2 = ({ item, childnodes, idList }: PropType<L2>) => (
  <section className="mt-24">
    <h2
      className="bg-white/30 p-4 text-xl shadow backdrop-blur-sm"
      id={item.id}
      data-id-list={idList}
    >
      <span className="pr-2 font-thin">{item.index}</span>
      <span className="font-bold">{item.text}</span>
      <span className="pl-2 text-sm font-normal text-gray-500">{item.id}</span>
    </h2>
    <p className="mt-4 px-4 text-gray-500">{item.desc}</p>
    {childnodes}
  </section>
);

const Outcomel3 = ({ item, childnodes, parents, idList }: PropType<L3>) => {
  const text = `${item.text}(${item.index})`;
  return (
    <section className="mt-12">
      <h2
        className="bg-white/30 p-4 text-lg  shadow-sm backdrop-blur-sm"
        data-id-list={idList}
        id={item.id}
      >
        <span className="pr-2 font-thin">{item.index}</span>
        <span>
          {item.attrInfo ? <MappedText text={item.text} map={item.attrInfo} /> : item.text}
        </span>
        <span className="pl-2 text-sm font-normal text-gray-500">{item.id}</span>
      </h2>
      <ul className="mt-2">{childnodes}</ul>
    </section>
  );
};

const MappedText = ({ text, map }: { text: string; map: MappedInfo<AttrInfo>[] }) => {
  return (
    <>
      {applyMappedInfo(text, map, (text, attr, key) => {
        switch (attr.type) {
          case "tableLink":
            return (
              <span className="tooltip" data-tip={attr.title} key={key}>
                <Link
                  href={attr.url}
                  key={attr.id}
                  className="cursor-pointer text-sky-500 hover:underline"
                >
                  {text}
                </Link>
              </span>
            );
        }
        return <>{"unknown:" + text + ":" + attr.type}</>;
      })}
    </>
  );
};

const Outcomel4 = ({ item, parents }: PropType<L4>) => {
  return (
    <li className="mr-4 ml-10 list-disc py-1 marker:text-sky-200 " id={item.id}>
      <span className="text-gray-500">
        {item.attrInfo ? <MappedText text={item.text} map={item.attrInfo} /> : item.text}
      </span>
      <span className="text-sm text-gray-400">{item.id}</span>
    </li>
  );
};

export { Outcomel1, Outcomel2, Outcomel3, Outcomel4, OutcomesTree };
