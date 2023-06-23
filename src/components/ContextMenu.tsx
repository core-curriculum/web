import {
  useFloating,
  flip,
  shift,
  useClick,
  offset,
  useInteractions,
  useDismiss,
  autoUpdate,
  FloatingFocusManager,
  useListNavigation,
} from "@floating-ui/react";
import { useRef, useState } from "react";
import { MdMoreVert } from "react-icons/md";

const usePopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const listRef = useRef<(HTMLLIElement | null)[]>([]);
  const { refs, floatingStyles, context } = useFloating({
    middleware: [flip(), shift(), offset(3)],
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
  });
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });

  const dismiss = useDismiss(context);
  const click = useClick(context);
  const close = () => setIsOpen(false);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    listNavigation,
  ]);
  return {
    listRef,
    activeIndex,
    isOpen,
    refs,
    floatingStyles,
    context,
    getReferenceProps,
    getFloatingProps,
    close,
    getItemProps,
  };
};

type Props<T extends readonly { name: string; label?: string }[]> = {
  items: readonly [...T];
  onClick?: (name: T[number]["name"]) => void;
  marked?: boolean;
  buttonSize?: "sm" | "lg" | "xl" | "2xl";
};
const ContextMenu = <T extends readonly { name: string; label?: string }[]>({
  items,
  onClick,
  marked,
  buttonSize = "xl",
}: Props<T>) => {
  const {
    listRef,
    activeIndex,
    isOpen,
    refs,
    context,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    close,
    getItemProps,
  } = usePopover();
  const handleSelect = (name: T[number]["name"]) => {
    onClick?.(name);
    close();
  };
  return (
    <span>
      <button
        ref={refs.setReference}
        className={`border-0 outline-0 ring-0 ring-info/30 ring-offset-0
          ${marked ? "bg-info/20" : "btn-ghost btn-info"} btn-circle btn-sm btn ${
          buttonSize === "sm"
            ? "text-sm"
            : buttonSize === "lg"
            ? "text-lg"
            : buttonSize === "xl"
            ? "text-xl"
            : "text-2xl"
        } text-info`}
        {...getReferenceProps()}
      >
        <MdMoreVert />
      </button>
      {isOpen && (
        <FloatingFocusManager context={context}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="outline-0"
          >
            <ul className="menu rounded-box bg-base-100 outline-0 drop-shadow-md">
              {items.map(({ name, label }, index) => {
                return (
                  <li
                    key={name}
                    tabIndex={activeIndex === index ? 0 : -1}
                    {...getItemProps({
                      onClick: () => handleSelect(name),
                      onKeyDown(event) {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleSelect(name);
                        }

                        if (event.key === " ") {
                          event.preventDefault();
                          handleSelect(name);
                        }
                      },
                    })}
                    ref={node => {
                      listRef.current[index] = node;
                    }}
                    className="rounded-box w-full border-0 p-2 text-left outline-transparent ring-0
                    ring-info/30 ring-offset-0 hover:bg-info/70 hover:text-base-100
                    focus:ring-4"
                  >
                    {label ?? name}
                  </li>
                );
              })}
            </ul>
          </div>
        </FloatingFocusManager>
      )}
    </span>
  );
};

export { ContextMenu };
export type { Props as ContextMenuProps };
