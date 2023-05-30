import { Ref, useCallback } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MdDragIndicator, MdDeleteForever } from "react-icons/md";
import { ServerItemList } from "@services/itemList/server";

const format = (date: Date) => {
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
    .getDate()
    .toString()
    .padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
};
type Props = {
  itemListList: ServerItemList[];
  onChange?: (itemListList: ServerItemList[]) => void;
};

const useCombinedRefs = <T extends Element>(...refs: Array<Ref<T>>): Ref<T> =>
  useCallback(
    (element: T) =>
      refs.forEach(ref => {
        if (!ref) {
          return;
        }

        if (typeof ref === "function") {
          return ref(element);
        }

        (ref as any).current = element;
      }),
    refs,
  );

function moveIndex<T>(array: T[], from: number, to: number) {
  const newArray = [...array];
  const target = newArray[from];
  newArray.splice(from, 1);
  if (to >= 0) newArray.splice(to, 0, target);
  return newArray;
}

type ItemListProps = {
  itemList: ServerItemList;
  index: number;
  onMoveItem?: (prevIndex: number, targetIndex: number) => void;
};

const ItemList = ({ itemList, index, onMoveItem }: ItemListProps) => {
  const id = itemList.id;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "Card",
      item: { id, index },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [],
  );
  const [{ toInsertTop, toInsertBottom }, drop] = useDrop(() => ({
    accept: "Card",
    drop: item => onMoveItem?.((item as { index: number }).index, index),
    collect: monitor => ({
      toInsertTop: !!monitor.isOver() && monitor.getItem<{ index: number }>().index > index,
      toInsertBottom: !!monitor.isOver() && monitor.getItem<{ index: number }>().index < index,
    }),
  }));
  const refs = useCombinedRefs(drag, drop);
  const marginClass = `${toInsertTop ? "pt-20" : ""} ${toInsertBottom ? "pb-20" : ""}`;
  return (
    <tr ref={onMoveItem ? (refs as any) : null} className={`${isDragging ? "scale-y-0" : ""}`}>
      <td className={marginClass}>
        <div className="flex flex-row  items-center">
          {onMoveItem ? <MdDragIndicator className="mr-1 cursor-move text-gray-400" /> : ""}
          {itemList.data["name"]}
        </div>
      </td>
      <td className={marginClass}>{itemList.data["place"]}</td>
      <td className={marginClass}>
        <div className="flex flex-row  items-center">
          {format(itemList.created_at)}
          {onMoveItem ? (
            <MdDeleteForever
              onClick={() => onMoveItem(index, -1)}
              className="ml-1 cursor-pointer text-gray-400"
            />
          ) : (
            ""
          )}
        </div>
      </td>
    </tr>
  );
};

const ItemListList = ({ itemListList, onChange }: Props) => {
  const onMoveItem = useCallback(
    (prevIndex: number, targetIndex: number) => {
      const newItemListList = moveIndex(itemListList, prevIndex, targetIndex);
      onChange?.(newItemListList);
    },
    [itemListList, onChange],
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <table className="table">
        <thead>
          <tr>
            <td>名前</td>
            <td>場所</td>
            <td>作成日</td>
          </tr>
        </thead>
        <tbody>
          {itemListList.map((item, i) => (
            <ItemList
              key={i.toString() + "_" + item.id}
              index={i}
              itemList={item}
              onMoveItem={onChange ? onMoveItem : undefined}
            />
          ))}
        </tbody>
      </table>
    </DndProvider>
  );
};

export { ItemListList };
export type { Props as ItemListListProps };
