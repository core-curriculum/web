import { ContextMenu } from "@components/ContextMenu";
import { OutcomeInfo } from "@services/outcomes";

const copyToClip = async (text: string) => await navigator.clipboard.writeText(text);

const OutcomesContextMenu = ({ item }: { item: OutcomeInfo }) => {
  const menus = [
    { name: "id", label: `id (${item.id}) をコピー` },
    { name: "index", label: `インデックス (${item.index}) をコピー` },
  ] as const;
  const menuClick = (name: typeof menus[number]["name"]) => {
    switch (name) {
      case "id":
        return copyToClip(item.id);
      case "index":
        return copyToClip(item.index);
    }
  };
  return <ContextMenu items={menus} onClick={menuClick} />;
};

export { OutcomesContextMenu };
