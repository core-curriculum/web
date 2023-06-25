import * as React from "react";
import { useState } from "react";

let listItemId = 0;
function useAutoDeleteList<T>(milliSec: number) {
  const [ids, setIds] = useState<Record<string, T | null>>({});
  function add(value: T | null = null) {
    const id = listItemId++;
    setIds(prev => {
      const ids = { ...prev, [`${id}`]: value };
      setTimeout(
        () =>
          setIds(prev => {
            delete prev[`${id}`];
            return prev;
          }),
        milliSec,
      );
      return ids;
    });
  }
  const List = ({
    template,
  }: {
    template: React.ReactNode | ((prop: T | null) => React.ReactNode);
  }) => {
    return (
      <>
        {Object.entries(ids).map(([id, value]) => (
          <div key={id}>{typeof template === "function" ? template(value) : template}</div>
        ))}
      </>
    );
  };
  return { add, List };
}

const useTantarararaaan = (milliSec: number) => {
  const { add, List } = useAutoDeleteList<boolean>(1000);
  const sec = milliSec / 1000;
  const fire = (reverse = false) => add(reverse);
  const EffectComponent = () => (
    <>
      <style>
        {`
        @keyframes risingin{
          0%{
            opacity:0;
            transform:scale(1) translate(0,300%);
          }
          50%{
            opacity:0.5;
            transform:scale(1) translate(0,0);
          }
          100%{
            opacity:0;
            transform:scale(1.5);
          }
        }
      `}
      </style>
      <List
        template={reverse => (
          <span
            style={{
              animation: `risingin ${sec}s  forwards`,
              animationDirection: reverse ? "reverse" : "normal",
            }}
            className="absolute top-0 h-full w-full rounded-full 
            bg-info will-change-[opacity,transform]"
          ></span>
        )}
      />
    </>
  );
  return { fire, EffectComponent };
};

export { useTantarararaaan };
