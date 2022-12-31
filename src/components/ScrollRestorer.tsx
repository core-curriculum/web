import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useScrollRestoration } from "@libs/scrollRestore";

export const ScrollRestorer = ({ name }: { name: string }) => {
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  useScrollRestoration(router, name, ref);

  return <span ref={ref}></span>;
};
