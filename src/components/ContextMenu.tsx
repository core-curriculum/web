import Link from "next/link";
import { MdMoreHoriz } from "react-icons/md";

type Props<T extends readonly { name: string; label?: string }[]> = {
  items: readonly [...T];
  onClick?: (name: T[number]["name"]) => void;
  marked?: boolean;
  buttonSize?: "sm" | "lg" | "xl" | "2xl";
  counts?: Record<T[number]["name"], number>;
  links?: Record<T[number]["name"], string>;
};
const ContextMenu = <T extends readonly { name: string; label?: string }[]>({
  items,
  onClick,
  marked,
  buttonSize = "xl",
  counts = {} as Record<T[number]["name"], number>,
  links = {} as Record<T[number]["name"], string>,
}: Props<T>) => {
  const handleSelect = (name: T[number]["name"]) => {
    onClick?.(name);
    // @ts-ignore
    document.activeElement?.blur?.();
  };
  return (
    <div className="dropdown-end  dropdown">
      <label
        className={`border-0 outline-0 ring-0 ring-info/30 ring-offset-0
          ${marked ? "bg-info/20" : "btn-ghost btn-info"} btn-sm btn-circle btn ${
          buttonSize === "sm"
            ? "text-sm"
            : buttonSize === "lg"
            ? "text-lg"
            : buttonSize === "xl"
            ? "text-xl"
            : "text-2xl"
        } text-info`}
        tabIndex={0}
      >
        <MdMoreHoriz />
      </label>
      <ul
        tabIndex={0}
        className=" dropdown-content menu rounded-box 
        z-[1] bg-base-100 p-2 outline-0 drop-shadow-md"
      >
        {items.map(
          ({ name, label }: { name: T[number]["name"]; label?: T[number]["label"] }, index) => {
            const content = (
              <li
                key={name}
                className="flex w-full cursor-pointer flex-row flex-nowrap
                whitespace-nowrap rounded p-2 hover:bg-info/30"
                onClick={() => handleSelect(name)}
              >
                <span>{label ?? name}</span>
                {name in counts && counts[name] && (
                  <span className="badge badge-info h-3 w-3 text-xs">{counts[name]}</span>
                )}
              </li>
            );
            return name in links && links[name] ? (
              <Link href={links[name]}>{content}</Link>
            ) : (
              content
            );
          },
        )}
      </ul>
    </div>
  );
};

export { ContextMenu };
export type { Props as ContextMenuProps };
