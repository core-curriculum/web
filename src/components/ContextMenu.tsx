import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

type Props<T extends readonly { name: string; label?: string }[]> = {
  items: readonly [...T];
  onClick?: (name: T[number]["name"]) => void;
};
const ContextMenu = <T extends readonly { name: string; label?: string }[]>({
  items,
  onClick,
}: Props<T>) => {
  return (
    <Menu as="span" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="inline-flex w-full justify-center rounded-md border-gray-500 bg-gray-300/10
          px-2 py-1 text-sm font-medium text-gray-300 hover:bg-black/30 focus:outline-none 
          focus-visible:ring-2 focus-visible:ring-white/75"
        >
          ...
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute z-10 divide-y
          divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
        >
          <div className="p-1 ">
            {items.map(({ name, label }) => {
              return (
                <Menu.Item key={name}>
                  {({ active }) => (
                    <button
                      className={`${active ? "bg-sky-400 text-white" : "text-gray-900"} 
                group flex w-full items-center whitespace-nowrap rounded-md px-2 py-2 text-sm`}
                      onClick={() => onClick?.(name)}
                    >
                      {label ?? name}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export { ContextMenu };
export type { Props as ContextMenuProps };
