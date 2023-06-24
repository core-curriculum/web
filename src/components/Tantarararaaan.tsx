import * as React from "react";
import { useState } from "react";

let listItemId = 0;
const useAutoDeleteList = (milliSec: number) => {
  const [ids, setIds] = useState<number[]>([]);
  const add = () => {
    const id = listItemId++;
    setIds(prev => {
      const ids = [...prev, id];
      console.log(ids);
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
  const { add: fire, List } = useAutoDeleteList(1000);
  const sec = milliSec / 1000;
  const EffectComponent = () => (
    <>
      <style>
        {`
        @keyframes risingin{
          0%{
            top:300%;
            opacity:0;
            transform:scale(1);
          }
          3%{
            top:300%;
            opacity:0.5;
            transform:scale(1);
          }
          
          50%{
            top: 0%;
            opacity:0;
            transform:scale(1);
          }
          60%{
            top: 0%;
            opacity:0;
            transform:scale(1);
          }
          90%{
            top: 0%;
            opacity:0.3;
            transform:scale(1.2);
          }
          100%{
            top: 0%;
            opacity:0;
            transform:scale(1.5);
          }
        }
      `}
      </style>
      <List
        template={
          <span
            style={{ animation: `risingin ${sec}s ease forwards` }}
            className="absolute h-full w-full rounded-full bg-info"
          ></span>
        }
      />
    </>
  );
  return { fire, EffectComponent };
};

export { useTantarararaaan };
