import { ReactNode } from "react";
import { ScrollRestorer } from "@components/ScrollRestorer";
import { MobileDrawer } from "./MobileDrawer";
import { NaviBar } from "./NaviBar";

const Body = ({ content }: { content: ReactNode }) => {
  return (
    <>
      <ScrollRestorer name={"body"} />
      <div className="overflow-x-hidden">{content}</div>
    </>
  );
};

const Menu = ({ content }: { content: ReactNode }) => {
  return <>{content}</>;
};

type Props = { content: ReactNode; menu: ReactNode };
export const MainLayout = ({ content, menu }: Props) => {
  return (
    <div className="m-0 grid h-full grid-rows-[4rem,calc(100%-4rem)]">
      <div className="z-30 w-full bg-base-100 shadow-md backdrop-blur-sm">
        <NaviBar />
      </div>
      <div className="h-full p-0">
        <MobileDrawer content={<Body content={content} />} menu={<Menu content={menu} />} />
      </div>
    </div>
  );
};
