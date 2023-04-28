import { ReplaceMap } from "@libs/textMapper";
import { TableInfoDict } from "./tables";

type LinkInfo = {
  type: "link";
  url: string;
};
type TableLinkInfo = {
  type: "tableLink";
  url: string;
  id: string;
  index: string;
  title: string;
};
type AbbrInfo = {
  type: "abbr";
  def: string;
};
type SubTagInfo = {
  type: "sub";
};
type SupTagInfo = {
  type: "sup";
};
type TextInfo = {
  type: "text";
};
type ItalicInfo = {
  type: "italic";
};
type AttrInfo = LinkInfo |
  AbbrInfo | TableLinkInfo | SubTagInfo | SupTagInfo | TextInfo | ItalicInfo;


const getReplaceMap = (
  infoDict?: TableInfoDict,
): ReplaceMap<AttrInfo> => {
  return [
    {
      reg: /\[\@tbl:(.+?)\]/,
      mapper: ([, id]: RegExpExecArray) => {
        if (!infoDict) return ({ text: id, attr: { type: "text" } });
        const target = infoDict[id];
        return {
          text: `表${target.number}`,
          attr: {
            type: "tableLink",
            url: target.link,
            index: target.number,
            title: `表${target.number}. ${target.item}`,
            id,
          },
        } as const;
      },
    },
    {
      reg: /<sub>(.+?)<\/sub>/i,
      mapper: ([, text]: RegExpExecArray) => {
        return {
          text: text,
          attr: {
            type: "sub",
          },
        } as const;
      },
    },
    {
      reg: /<sup>(.+?)<\/sup>/i,
      mapper: ([, text]: RegExpExecArray) => {
        return {
          text: text,
          attr: {
            type: "sup",
          },
        } as const;
      },
    },
    {
      reg: /\*(.+?)\*/,
      mapper: ([, text]: RegExpExecArray) => {
        return {
          text: text,
          attr: {
            type: "italic",
          },
        } as const;
      },
    },
  ];
};

export type { AttrInfo }
export { getReplaceMap }
