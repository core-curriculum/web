import { useEffect } from "react";

const defaultProps = {
  single: false,
  rootMargin: "0px 0px 0px 0px",
  rootSelector: "",
  threshold: 0,
};
type Flatten<T extends object> = { [P in keyof T]: T[P] };
type Props = Flatten<
  Partial<typeof defaultProps> & {
    onIntersect: <T extends Element>(e: T) => void;
    selector: string;
  }
>;
const useScrollObserver = (props: Props) => {
  const { onIntersect, selector, single, rootMargin, rootSelector } = { ...defaultProps, ...props };

  useEffect(() => {
    console.log(`register scrollObserver`);
    const root = rootSelector ? document.querySelector(rootSelector) : null;

    const observer = new IntersectionObserver(
      (entries, observer) => {
        const items = entries.filter((e) => e.isIntersecting);
        if (items.length <= 0) return;
        if (single) {
          const item = items.reduce((curr, c) => {
            return curr.intersectionRatio < c.intersectionRatio ? c : curr;
          });
          onIntersect(item.target);
        } else {
          items.forEach((e) => onIntersect(e.target));
        }
      },
      {
        rootMargin,
        root,
      },
    );
    const elms = document.querySelectorAll(selector);
    elms.forEach((e) => observer.observe(e));
    return () => {
      console.log(`unRegister scrollObserver ${elms.length}`);
      elms.forEach((e) => observer.unobserve(e));
    };
  }, [onIntersect, rootMargin, rootSelector, selector, single]);
};

export { useScrollObserver };
