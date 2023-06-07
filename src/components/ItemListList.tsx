import { Ref, forwardRef, useCallback } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MdDragIndicator, MdClose } from "react-icons/md";
import { formatDateTimeIntl } from "@libs/utils";
import { useTranslation } from "@services/i18n/i18n";
import { ServerItemList } from "@services/itemList/server";

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
    [refs],
  );

function moveIndex<T>(array: ReadonlyArray<T>, from: number, to: number) {
  const newArray = [...array];
  const target = newArray[from];
  newArray.splice(from, 1);
  if (to >= 0) newArray.splice(to, 0, target);
  return newArray;
}

// eslint-disable-next-line react/display-name
const DragHandle = forwardRef<HTMLDivElement>((_props, ref) => (
  <div ref={ref}>
    <MdDragIndicator className="mr-1 cursor-move text-gray-400" />
  </div>
));

const DeleteIcon = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="btn-ghost btn ml-1">
    <MdClose onClick={onClick} className="" />
  </button>
);

type DraggableRowProps = {
  items: ReadonlyArray<string>;
  index: number;
  onMoveItem?: (prevIndex: number, targetIndex: number) => void;
};
const DraggableRowDndType = Symbol("DraggableRowDndType");
const DraggableRow = ({ items, index, onMoveItem }: DraggableRowProps) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: DraggableRowDndType,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const [{ toInsertTop, toInsertBottom }, drop] = useDrop<
    { index: number },
    void,
    {
      toInsertTop: boolean;
      toInsertBottom: boolean;
    }
  >(() => ({
    accept: DraggableRowDndType,
    drop: item => onMoveItem?.(item.index, index),
    collect: monitor => ({
      toInsertTop: !!monitor.isOver() && monitor.getItem().index > index,
      toInsertBottom: !!monitor.isOver() && monitor.getItem().index < index,
    }),
  }));
  const refs = useCombinedRefs<HTMLTableRowElement>(preview, drop);
  return (
    <tr
      ref={onMoveItem ? refs : null}
      className={`${isDragging ? "scale-y-0" : ""} ${toInsertTop ? "border-t-8" : ""} ${
        toInsertBottom ? "border-b-8" : ""
      }`}
    >
      {items.map((item, i, { length }) => {
        const needHandle = onMoveItem && i === 0;
        const needDeleteIcon = onMoveItem && i === length - 1;
        return (
          <td key={i}>
            <div className="flex flex-row  items-center">
              {needHandle && <DragHandle ref={drag} />}
              {item}
              {needDeleteIcon && <DeleteIcon onClick={() => onMoveItem(index, -1)} />}
            </div>
          </td>
        );
      })}
    </tr>
  );
};

type Props = {
  itemListList: ReadonlyArray<ServerItemList>;
  onChange?: (itemListList: ServerItemList[]) => void;
};

const ItemListList = ({ itemListList, onChange }: Props) => {
  const { t } = useTranslation("@components/ItemListList");
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
            <td>{t("name")}</td>
            <td>{t("place")}</td>
            <td>{t("created_at")}</td>
          </tr>
        </thead>
        <tbody>
          {itemListList.map(({ id, name, place, created_at }, i) => (
            <DraggableRow
              key={i + "_" + id}
              index={i}
              items={[name, place, formatDateTimeIntl(created_at)]}
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
