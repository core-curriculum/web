import toast from "react-hot-toast";
import { ContextMenu } from "@components/ContextMenu";
import { fmt } from "@libs/utils";

const copyToClip = async (text: string) => {
  await navigator.clipboard.writeText(text);
  toast(fmt('"{text}"をクリップボードにコピーしました', { text }));
};

const ItemContextMenu = ({ id, index }: { id: string; index: string }) => {
  const menus = [
    { name: "id", label: fmt("id ({id}) をコピー", { id }) },
    { name: "index", label: fmt("インデックス ({index}) をコピー", { index }) },
  ] as const;
  const menuClick = (name: typeof menus[number]["name"]) => {
    switch (name) {
      case "id":
        return copyToClip(id);
      case "index":
        return copyToClip(index);
    }
  };
  return <ContextMenu items={menus} onClick={menuClick} />;
};

export { ItemContextMenu };
