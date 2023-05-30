import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";
import { useLocaleText } from "@services/i18n/i18n";
import { useItemsValue } from "@services/itemList/local";

type Prop = {
  count: number;
  href: string;
};
const LinkToItemList = ({ count, href }: Prop) => {
  const { t } = useLocaleText("@components/LinktoItemList");
  return (
    <>
      <Link
        {...{ href }}
        className="flex items-center justify-center gap-x-1 rounded-md p-2 hover:bg-sky-100"
      >
        <span className={`${count > 0 ? "text-sky-300" : "text-gray-400"} max-md:text-sm`}>
          {t("title")}
        </span>
        <span
          className={
            "flex h-6 w-6 items-center justify-center rounded-full text-sm text-white " +
            "max-md:h-5 max-md:w-5 max-md:text-xs " +
            `${count > 0 ? "bg-sky-300" : "bg-gray-400"}`
          }
        >
          {count}
        </span>
      </Link>
    </>
  );
};

const LinkToItemListWithContent = () => {
  const items = useItemsValue();
  const [count, setCount] = useState(0);
  useEffect(() => setCount(items.length), [items]);
  return <LinkToItemList href="/list" count={count} />;
};

export { LinkToItemList, LinkToItemListWithContent };
export type { Prop as LinkToItemListProp };
