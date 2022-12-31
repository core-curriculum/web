import type { ReactNode } from "react";
import type { Tree } from "@libs/treeUtils";
import { reduceTree } from "@libs/treeUtils";
import type {
  OutcomeInfo,
  Outcomel1 as L1,
  Outcomel2 as L2,
  Outcomel3 as L3,
  Outcomel4 as L4,
} from "@services/outcomes";

type PropType<T extends OutcomeInfo> = { item: T; childnodes: ReactNode };
type OutcomesTreeProps = { outcomesTree: Tree<OutcomeInfo> };

const OutcomesChecklists = ({ outcomesTree }: OutcomesTreeProps) => (
  <div className="max-w-none">
    {reduceTree<OutcomeInfo, ReactNode>(outcomesTree, (item, childnodes) => {
      const props = { childnodes };
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

type RatingCheckProp = { name: string };
const RatingCheck = ({ name }: RatingCheckProp) => (
  <fieldset className="whitespace-nowrap ">
    <input name={name} type="radio" value="1" className="radio" />
    <input name={name} type="radio" value="2" className="radio" />
    <input name={name} type="radio" value="3" className="radio" />
    <input name={name} type="radio" value="4" className="radio" />
    <input name={name} type="radio" value="5" className="radio" />
  </fieldset>
);

const Outcomel1 = ({ item, childnodes }: PropType<L1>) => (
  <section>
    <h3 className="bg-white py-6 px-4 text-3xl shadow-md" id={item.id} style={{ zIndex: 2 }}>
      <span className="pr-2 font-thin">{item.index}</span>
      <span className="font-bold">{item.text}</span>
    </h3>
    {childnodes}
  </section>
);

const Outcomel2 = ({ item, childnodes }: PropType<L2>) => {
  const index = item.index.match(/..$/)?.[0] ?? "??";
  return (
    <section>
      <div className="overflow-x-auto">
        <table className="m-3 table">
          <thead>
            <tr className="mr-4 ml-10 py-1" id={item.id}>
              <th className="pl-4 text-left">{index + " " + item.text}</th>
              <th className="p-2 text-center">
                <div>自己評価</div>
                <div className="text-sm">1-5</div>
              </th>
              <th className="p-2 text-center">
                <div>指導者評価</div> <div className="text-sm">1-5</div>
              </th>
            </tr>
          </thead>
          <tbody>{childnodes}</tbody>
        </table>
      </div>
      <label className="label ml-2">
        <span className="label-text">指導医のコメント</span>
      </label>
      <textarea className="textarea-bordered textarea mx-4 mb-4" rows={2} cols={80}></textarea>
    </section>
  );
};

const Outcomel3 = ({ item, childnodes }: PropType<L3>) => {
  const index = item.index.match(/..$/)?.[0] ?? "??";
  return (
    <tr className="mr-4 ml-10 py-1" id={item.id}>
      <td className="whitespace-normal p-2 ">{index + " " + item.text}</td>
      <td className="p-2 text-center">
        <RatingCheck name={item.id + "-self"} />
      </td>
      <td className="p-2 text-center">
        <RatingCheck name={item.id + "-inst"} />
      </td>
    </tr>
  );
};

const Outcomel4 = ({ item }: PropType<L4>) => {
  const index = item.index.match(/..$/)?.[0] ?? "??";
  return (
    <tr className="mr-4 ml-10 py-1" id={item.id}>
      <td className="whitespace-normal p-2 ">{index + " " + item.text}</td>
      <td className="p-2 text-center">
        <RatingCheck name={item.id + "-self"} />
      </td>
      <td className="p-2 text-center">
        <RatingCheck name={item.id + "-inst"} />
      </td>
    </tr>
  );
};

export { Outcomel1, Outcomel2, Outcomel3, Outcomel4, OutcomesChecklists };
