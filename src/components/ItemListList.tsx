import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { forwardRef, useMemo, useState } from "react";
import { MdDragIndicator, MdClose } from "react-icons/md";
import { formatDateTimeIntl } from "@libs/utils";
import { useTranslation } from "@services/i18n/i18n";
import { ServerItemList } from "@services/itemList/server";

function moveIndex<T>(array: ReadonlyArray<T>, from: number, to: number) {
  const newArray = [...array];
  const target = newArray[from];
  newArray.splice(from, 1);
  if (to >= 0) newArray.splice(to, 0, target);
  return newArray;
}

// eslint-disable-next-line react/display-name
const DragHandle = forwardRef<HTMLDivElement>((_props, ref) => (
  <div ref={ref} {..._props}>
    <MdDragIndicator className="mr-1 cursor-move text-gray-400" />
  </div>
));

const DeleteIcon = ({ onClick }: { onClick?: () => void }) => (
  <button onClick={onClick} className="btn-ghost btn ml-1">
    <MdClose onClick={onClick} className="" />
  </button>
);

const StaticRow = ({ row: { items } }: { row: { items: ReadonlyArray<string> } }) => {
  console.log("StaticRow", items);
  return (
    <tr className="">
      {items.map((item, i, { length }) => {
        const needHandle = i === 0;
        const needDeleteIcon = i === length - 1;
        return (
          <td key={i}>
            <div className={`flex flex-row  items-center`}>
              {needHandle && <DragHandle />}
              {item}
              {needDeleteIcon && <DeleteIcon />}
            </div>
          </td>
        );
      })}
    </tr>
  );
};

type DraggableRowProps = {
  row: {
    id: UniqueIdentifier;
    items: ReadonlyArray<string>;
    index: number;
  };
  onMoveItem?: (prevIndex: number, targetIndex: number) => void;
};
const DraggableRow = ({ row: { items, index, id }, onMoveItem }: DraggableRowProps) => {
  const { attributes, listeners, transform, transition, setNodeRef, isDragging } = useSortable({
    id: id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };
  return (
    <tr ref={setNodeRef} style={style} key={id}>
      {isDragging ? (
        <td colSpan={items.length} className="bg-primary/5">
          &nbsp;
        </td>
      ) : (
        items.map((item, i, { length }) => {
          const needHandle = i === 0;
          const needDeleteIcon = i === length - 1;
          return (
            <td key={i}>
              <div className={`flex flex-row  items-center`}>
                {needHandle && <DragHandle {...attributes} {...listeners} />}
                {item}
                {needDeleteIcon && <DeleteIcon onClick={() => onMoveItem?.(index, -1)} />}
              </div>
            </td>
          );
        })
      )}
    </tr>
  );
};

type Props = {
  itemListList: ReadonlyArray<ServerItemList>;
  onChange?: (itemListList: ServerItemList[]) => void;
};

const ItemListList = ({ itemListList, onChange }: Props) => {
  const { t } = useTranslation("@components/ItemListList");
  const [activeName, setActiveName] = useState("");
  const onMoveItem = (prevIndex: number, targetIndex: number) => {
    const newItemListList = moveIndex(itemListList, prevIndex, targetIndex);
    onChange?.(newItemListList);
  };
  const items = [...itemListList.map((itemList, i) => `${itemList.id}_${i}`)];
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  function handleDragStart(event: any) {
    setActiveName(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      onChange?.(arrayMove([...itemListList], oldIndex, newIndex));
    }

    setActiveName("");
  }

  function handleDragCancel() {
    setActiveName("");
  }

  const selectedItem = useMemo(() => {
    if (!activeName) {
      return null;
    }
    const index = items.indexOf(activeName);
    if (index === -1) return null;
    const { name, place, created_at } = itemListList[index];
    const id = activeName;
    const _items = [name, place, formatDateTimeIntl(created_at)];
    return { ...itemListList[index], index, id, items: _items };
  }, [activeName, itemListList]);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
    >
      <table className="table transition">
        <thead>
          <tr>
            <td>{t("name")}</td>
            <td>{t("place")}</td>
            <td>{t("created_at")}</td>
          </tr>
        </thead>
        <tbody>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {itemListList
              .map(({ id, name, place, created_at }, i) => ({
                id: `${id}_${i}`,
                items: [name, place, formatDateTimeIntl(created_at)],
                index: i,
              }))
              .map(row => (
                <DraggableRow
                  key={row.id}
                  row={row}
                  onMoveItem={onChange ? onMoveItem : undefined}
                />
              ))}
          </SortableContext>
        </tbody>
      </table>
      <DragOverlay>
        {activeName && (
          <table style={{ width: "100%" }} className="bg-base-100 drop-shadow-lg transition">
            <tbody>{selectedItem && <StaticRow key={selectedItem.id} row={selectedItem} />}</tbody>
          </table>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export { ItemListList };
export type { Props as ItemListListProps };
