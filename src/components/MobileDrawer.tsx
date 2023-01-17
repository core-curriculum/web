import React, { ReactNode } from "react";

const Menu = ({ content }: { content: ReactNode }) => {
  return (
    <div
      className={`invisible z-10 col-start-1
      row-start-1 w-[clamp(10rem,20rem,calc(100vw-5rem))] translate-x-[-100%]
      overflow-y-auto 
      overflow-x-hidden duration-[200ms]
      peer-checked:visible peer-checked:translate-x-0 
      lg:visible lg:translate-x-0 
      `}
    >
      {content}
    </div>
  );
};

const Tint = ({ htmlFor }: { htmlFor: string }) => {
  return (
    <label
      className={`invisible col-start-1 
      row-start-1 h-full overflow-y-auto bg-black/30 opacity-0 duration-[200ms] 
      peer-checked:max-lg:visible peer-checked:max-lg:opacity-100`}
      htmlFor={htmlFor}
    ></label>
  );
};

const Content = ({ content }: { content: ReactNode }) => {
  return (
    <div className="col-start-1 row-start-1 h-full w-full overflow-auto lg:col-start-2">
      {content}
    </div>
  );
};

type Props = { content: ReactNode; menu: ReactNode; labelId?: string };
const MobileDrawer = ({ content, menu, labelId }: Props) => {
  const _labelId = labelId ?? "mobileDrawHiddenCheckBox";
  return (
    <div className="grid h-full lg:grid-cols-[20rem,1fr]">
      <input type="checkbox" id={_labelId} className="peer hidden" />
      <Content content={content} />
      <Tint htmlFor={_labelId} />
      <Menu content={menu} />
    </div>
  );
};

export { MobileDrawer };
