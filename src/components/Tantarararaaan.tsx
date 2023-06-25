import * as React from "react";
import { useState } from "react";

let listItemId = 0;
const useAutoDeleteList = (milliSec: number) => {
  const [ids, setIds] = useState<number[]>([]);
  const add = () => {
    const id = listItemId++;
    setIds(prev => {
      const ids = [...prev, id];
      setTimeout(() => setIds(prev => prev.filter(i => i !== id)), milliSec);
      return ids;
    });
  };
  const List = ({ template }: { template: React.ReactNode }) => {
    return (
      <>
        {ids.map(id => (
          <div key={id}>{template}</div>
        ))}
      </>
    );
  };
  return { add, List };
};

const useTantarararaaan = (milliSec: number) => {
  const { add, List } = useAutoDeleteList(1000);
  const sec = milliSec / 1000;
  const fire = (reverse = false) => add();
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
        template={
          <span
            style={{ animation: `risingin ${sec}s  forwards` }}
            className="absolute top-0 h-full w-full rounded-full 
            bg-info will-change-[opacity,transform]"
          ></span>
        }
      />
    </>
  );
  return { fire, EffectComponent };
};

export { useTantarararaaan };
