import {
  useFloating,
  flip,
  shift,
  useClick,
  offset,
  useInteractions,
  useDismiss,
} from "@floating-ui/react";
import { useState } from "react";
import { MdMoreVert } from "react-icons/md";

type Props<T extends readonly { name: string; label?: string }[]> = {
  items: readonly [...T];
  onClick?: (name: T[number]["name"]) => void;
  marked?: boolean;
};
const ContextMenu = <T extends readonly { name: string; label?: string }[]>({
  items,
  onClick,
  marked,
}: Props<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    middleware: [flip(), shift(), offset(3)],
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const dismiss = useDismiss(context);
  const click = useClick(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);
  return (
    <span>
      <div
        ref={refs.setReference}
        className={` 
          ${marked ? "bg-info/20" : "btn-info btn-outline"} btn-sm btn-circle btn text-info`}
        {...getReferenceProps()}
      >
        <MdMoreVert />
      </div>
      {isOpen && (
        <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          <ul className="menu rounded-box menu-md bg-base-100 drop-shadow-md">
            {items.map(({ name, label }) => {
              return (
                <li key={name}>
                  <button
                    className="flex w-full items-center whitespace-nowrap rounded-full p-2 text-left
                        hover:bg-info hover:text-base-100"
                    onClick={() => {
                      setIsOpen(false);
                      onClick?.(name);
                    }}
                  >
                    {label ?? name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </span>
  );
};

export { ContextMenu };
export type { Props as ContextMenuProps };
