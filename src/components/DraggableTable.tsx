import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
  defaultAnimateLayoutChanges,
  AnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { forwardRef, useMemo, useState } from "react";
import { MdDragIndicator, MdClose } from "react-icons/md";

type TableRow = {
  id: string;
} & Record<string, string>;
type TableBody = ReadonlyArray<TableRow>;
type TableData = {
  header: ReadonlyArray<string>;
  body: ReadonlyArray<TableRow>;
};
type Props = {
  header?: ReadonlyArray<string>;
  headerTranslator?: (key: string) => string;
  data: ReadonlyArray<TableRow>;
  onChange?: (data: ReadonlyArray<TableRow>) => void;
};

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

type StaticRowProps = {
  header: ReadonlyArray<string>;
  row: TableRow;
};
const StaticRow = ({ header, row }: StaticRowProps) => {
  return (
    <tr className="">
      {header.map((key, i, { length }) => {
        const needHandle = i === 0;
        const needDeleteIcon = i === length - 1;
        return (
          <td key={i}>
            <div className={`flex flex-row  items-center`}>
              {needHandle && <DragHandle />}
              {row[key]}
              {needDeleteIcon && <DeleteIcon />}
            </div>
          </td>
        );
      })}
    </tr>
  );
};

const animateLayoutChanges: AnimateLayoutChanges = args => {
  const { isSorting, wasDragging } = args;

  if (isSorting || wasDragging) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
};

type DraggableRowProps = {
  header: ReadonlyArray<string>;
  row: TableRow;
  index: number;
  onRemove?: (index: number) => void;
};
const DraggableRow = ({ row, header, onRemove, index }: DraggableRowProps) => {
  const { id } = row;
  const { attributes, listeners, transform, transition, setNodeRef, isDragging } = useSortable({
    animateLayoutChanges,
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };
  return (
    <tr ref={setNodeRef} style={style} key={id} className={`${isDragging && "bg-primary/5"}`}>
      {header.map((key, i, { length }) => {
        const needHandle = i === 0;
        const needDeleteIcon = i === length - 1;
        return (
          <td key={i}>
            <div className={`flex flex-row  items-center`}>
              {needHandle && <DragHandle {...attributes} {...listeners} />}
              {row[key]}
              {needDeleteIcon && <DeleteIcon onClick={() => onRemove?.(index)} />}
            </div>
          </td>
        );
      })}
    </tr>
  );
};

const DraggableTable = ({ data, onChange, ...props }: Props) => {
  const header = props.header ?? Object.keys(data);
  const headerTranslator = props.headerTranslator ?? (key => key);
  const [activeName, setActiveName] = useState("");
  const handleRemove = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange?.(newData);
  };
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
      const oldIndex = data.findIndex(row => row.id === active.id);
      const newIndex = data.findIndex(row => row.id === over.id);
      onChange?.(arrayMove([...data], oldIndex, newIndex));
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
    return activeName && data.find(row => row.id === activeName);
  }, [activeName, data]);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
    >
      <table className="table">
        <thead>
          <tr>
            {header.map((name, i) => (
              <th key={i}>{headerTranslator(name)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <SortableContext items={[...data]} strategy={verticalListSortingStrategy}>
            {data.map((row, i) => (
              <DraggableRow
                header={header}
                key={row.id}
                row={row}
                index={i}
                onRemove={handleRemove}
              />
            ))}
          </SortableContext>
        </tbody>
      </table>
      <DragOverlay>
        {activeName && (
          <table
            style={{ width: "100%" }}
            className="table -translate-x-2 -translate-y-2 bg-base-100 drop-shadow-lg"
          >
            <tbody>
              {selectedItem && (
                <StaticRow header={header} key={selectedItem.id} row={selectedItem} />
              )}
            </tbody>
          </table>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export { DraggableTable };
export type { Props as DraggableTableProps, TableBody, TableData, TableRow };
