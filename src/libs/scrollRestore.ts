/**
 * Based on https://gist.github.com/claus/992a5596d6532ac91b24abe24e10ae81
 * - see https://github.com/vercel/next.js/issues/3303#issuecomment-628400930
 * - see https://github.com/vercel/next.js/issues/12530#issuecomment-628864374
 */
import Router, { NextRouter } from "next/router";
import { useEffect } from "react";

function saveScrollPos(asPath: string, ref?: HTMLElement | null) {
  console.log(`ref:${ref}`);
  sessionStorage.setItem(
    `scrollPos:${asPath}`,
    JSON.stringify({
      x: ref?.scrollLeft ?? window.scrollX,
      y: ref?.scrollTop ?? window.scrollY,
    }),
  );
}

function restoreScrollPos(asPath: string, ref?: HTMLElement | null) {
  const json = sessionStorage.getItem(`scrollPos:${asPath}`);
  const scrollPos = json ? JSON.parse(json) : undefined;
  console.log(`scrollPos:x:${scrollPos?.x},y:${scrollPos?.y}`);
  if (scrollPos) {
    if (ref) {
      ref.scrollTo(scrollPos.x, scrollPos.y);
    } else {
      window.scrollTo(scrollPos.x, scrollPos.y);
    }
  }
}

function useScrollRestoration(router: NextRouter): void;
function useScrollRestoration(
  router: NextRouter,
  key: string,
  ref: React.RefObject<HTMLElement>,
): void;
function useScrollRestoration(
  router: NextRouter,
  key?: string,
  ref?: React.RefObject<HTMLElement>,
) {
  useEffect(() => {
    console.log("setScroll restoration");
    const getPath = (url?: string) => {
      const path = (url ?? router.asPath).split("#")[0];
      return key ? [path, key].join(":") : path;
    };
    const getRefElm = () => ref?.current?.parentElement;
    if (!("scrollRestoration" in window.history)) return;
    let shouldScrollRestore = false;
    window.history.scrollRestoration = "manual";
    restoreScrollPos(getPath(), getRefElm());

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      saveScrollPos(getPath(), getRefElm());
      delete event["returnValue"];
    };

    const onRouteChangeStart = () => {
      saveScrollPos(getPath(), getRefElm());
    };

    const onRouteChangeComplete = (url: string) => {
      if (shouldScrollRestore) {
        shouldScrollRestore = false;
        /**
         * Calling with relative url, not expected asPath, so this
         * will break if there is a basePath or locale path prefix.
         */
        restoreScrollPos(getPath(url), getRefElm());
      }
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    Router.events.on("routeChangeStart", onRouteChangeStart);
    Router.events.on("routeChangeComplete", onRouteChangeComplete);
    Router.beforePopState(() => {
      shouldScrollRestore = true;
      return true;
    });

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      Router.events.off("routeChangeStart", onRouteChangeStart);
      Router.events.off("routeChangeComplete", onRouteChangeComplete);
      Router.beforePopState(() => true);
    };
  }, [router]);
}

export { useScrollRestoration };
