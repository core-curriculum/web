import { Suspense } from "react";
import { ContextMenu } from "@components/ContextMenu";
import { toast } from "@components/toast";
import { fmt, copyToClip } from "@libs/utils";
import { useSavedItemList } from "@services/savedItemList";

const ItemContextMenu = ({ id, index }: { id: string; index: string }) => {
  const { addId, removeId, ids } = useSavedItemList();
  const menus = (
    [
      ids.includes(id)
        ? [{ name: "removeFromList", label: "リストから削除" }]
        : [{ name: "addToList", label: "リストに追加" }],
      [{ name: "id", label: fmt("idをコピー", { id }) }],
    ] as const
  ).flat();
  const menuClick = async (name: typeof menus[number]["name"]) => {
    switch (name) {
      case "addToList":
        addId(id);
        toast(fmt("項目をリストに追加しました", { id }));
        return;
      case "removeFromList":
        removeId(id);
        toast(fmt("項目をリストから削除しました", { id }));
        return;
      case "id":
        await copyToClip(id);
        toast(fmt('"id({id})"をクリップボードにコピーしました', { id }));

        return;
    }
  };
  return (
    <Suspense fallback={""}>
      <ContextMenu items={menus} onClick={menuClick} />
    </Suspense>
  );
};

export { ItemContextMenu };
