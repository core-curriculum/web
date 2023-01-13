import Link from "next/link";

type Prop = {
  count: number;
  href: string;
};
const LinkToItemList = ({ count, href }: Prop) => {
  return (
    <Link {...{ href }} className="flex items-center justify-center gap-x-1">
      <span className={`${count > 0 ? "text-sky-300" : "text-gray-400"}`}>リスト</span>
      <span
        className={
          "flex h-6 w-6 items-center justify-center rounded-full text-sm text-white " +
          `${count > 0 ? "bg-sky-300" : "bg-gray-400"}`
        }
      >
        {count}
      </span>
    </Link>
  );
};

export { LinkToItemList };
export type { Prop as LinkToItemListProp };
