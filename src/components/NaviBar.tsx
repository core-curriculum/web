import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { MdSearch } from "react-icons/md";
import { useLocalItemList } from "@services/localItemList";
import { LinkToItemList } from "./LinkToItemList";

const ToggleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className="inline-block h-6 w-6 stroke-current"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    ></path>
  </svg>
);

const NaviBar = () => {
  const { items } = useLocalItemList();
  return (
    <div className="flex h-full items-center gap-2">
      <div className="flex-none lg:hidden">
        <label htmlFor="mobileDrawHiddenCheckBox" className="btn btn-ghost">
          <ToggleIcon />
        </label>
      </div>
      <Image className="ml-2 max-lg:hidden" src="/logo.svg" width="50" height="50" alt="" />
      <div className="flex-1 px-2 text-lg font-extrabold">モデルコアカリキュラム</div>
      <Suspense fallback="">
        <LinkToItemList href="./list" count={items.length} />
      </Suspense>
      <div className="mx-2 flex-none px-2">
        <Link href="/search" passHref>
          <MdSearch
            title="検索"
            className="rounded-md hover:bg-sky-100"
            size="2rem"
            color="rgb(125 211 252)"
          />
        </Link>
      </div>
    </div>
  );
};

export { NaviBar };
