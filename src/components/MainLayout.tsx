import Link from "next/link";
import { ReactNode } from "react";
import { MdSearch } from "react-icons/md";
import { ScrollRestorer } from "@components/ScrollRestorer";

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
  return (
    <div className="flex h-full items-center">
      <div className="flex-none lg:hidden">
        <label htmlFor="my-drawer-3" className="btn-ghost btn">
          <ToggleIcon />
        </label>
      </div>
      <div className="mx-2 flex-1 px-2 text-lg font-extrabold">モデルコアカリキュラム</div>
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

type Props = { content: ReactNode; menu: ReactNode };
export const MainLayout = ({ content, menu }: Props) => {
  return (
    <div className="m-0 h-full p-0">
      <div
        className="z-30 h-16 w-full 
    bg-base-100 shadow-md backdrop-blur-sm"
      >
        <NaviBar />
      </div>
      <div
        className="drawer-mobile drawer grid scroll-mt-32 auto-cols-auto overflow-hidden"
        style={{ height: "calc( 100% - 4rem )" }}
      >
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div
          className="col-start-1 row-start-1 flex h-full 
            flex-col overflow-auto lg:col-start-2"
          id="MainContents"
        >
          <ScrollRestorer name={"body"} />
          <div className="">{content}</div>
        </div>
        <div
          className="drawer-side col-start-1 row-start-1 max-h-full 
        overflow-x-hidden lg:block lg:pt-1"
        >
          <label
            htmlFor="my-drawer-3"
            className="drawer-overlay col-start-1 row-start-1 h-full w-full"
          ></label>
          <div className="col-start-1 row-start-1 h-full w-80 overflow-y-auto bg-base-100  p-2">
            {menu}
          </div>
        </div>
      </div>
    </div>
  );
};
