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
type AttrInfo =
  | LinkInfo
  | AbbrInfo
  | TableLinkInfo
  | SubTagInfo
  | SupTagInfo
  | TextInfo
  | ItalicInfo;

export type { AttrInfo };
