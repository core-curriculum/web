const ContextButton = () => (
  <label tabIndex={0} className=" btn-outline btn btn-xs border-gray-200 text-gray-300">
    ...
  </label>
);

type Props<T extends readonly { name: string; label?: string }[]> = {
  items: readonly [...T];
  onClick?: (name: T[number]["name"]) => void;
};
const ContextMenu = <T extends readonly { name: string; label?: string }[]>({
  items,
  onClick,
}: Props<T>) => {
  return (
    <div className="dropdown">
      <ContextButton />
      <ul tabIndex={0} className="dropdown-content menu rounded-box bg-base-100 p-2 text-sm shadow">
        {items.map(({ name, label }) => {
          label ??= name;
          return (
            <li key={name} className="whitespace-nowrap">
              <a onClick={() => onClick?.(name)}>{label}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export type { Props as ContextMenuProps };
export { ContextMenu };
