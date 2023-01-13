import { ReactNode } from "react";
import { ScrollRestorer } from "@components/ScrollRestorer";
import { NaviBar } from "./NaviBar";

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
