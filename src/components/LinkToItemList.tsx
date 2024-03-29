import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";
import { useLocaleText } from "@services/i18n/i18n";
import { useItemsValue } from "@services/itemList/local";

let listItemId = 0;
const useAutoDeleteList = (milliSec: number) => {
  const [ids, setIds] = useState<number[]>([]);
  const add = () => {
    const id = listItemId++;
    setIds([...ids, id]);
    setTimeout(() => setIds(ids.filter(i => i !== id)), milliSec);
  };
  const List = ({ template }: { template: React.ReactNode }) => {
    return (
      <>
        {ids.map(id => (
          <li key={id}>{template}</li>
        ))}
      </>
    );
  };
  return { add, List };
};

type Prop = {
  count: number;
  href: string;
};
const LinkToItemList = ({ count, href }: Prop) => {
  const { t } = useLocaleText("@components/LinktoItemList");
  return (
    <>
      <style>
        {`
          @keyframes risingin{
            0%{
              top:300%;
              opacity:0.5;
              transform:scale(1);
            }
            
            50%{
              top: 0%;
              opacity:0;
              transform:scale(1);
            }
            60%{
              top: 0%;
              opacity:0;
              transform:scale(1);
            }
            90%{
              top: 0%;
              opacity:0.3;
              transform:scale(2);
            }
            100%{
              top: 0%;
              opacity:0;
              transform:scale(3);
            }
          }
        `}
      </style>
      <Link
        {...{ href }}
        className="relative flex items-center justify-center gap-x-1 
        rounded-md p-2 hover:bg-info/30"
      >
        <span className={`${count > 0 ? "text-info" : "text-base-content/50"} max-md:text-sm`}>
          {t("title")}
        </span>
        <span
          className={
            "relative flex h-6 w-6 items-center justify-center rounded-full text-sm text-white" +
            "max-md:h-5 max-md:w-5 max-md:text-xs " +
            `${count > 0 ? "bg-sky-300" : "bg-gray-400"}`
          }
        >
          {count}
          <span
            style={{ animation: "risingin 1s ease infinite" }}
            className="absolute h-full w-full rounded-full bg-info"
          ></span>
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
