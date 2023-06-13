import { ContextMenu } from "@components/ContextMenu";
import { toast } from "@components/toast";
import { fmt, copyToClip } from "@libs/utils";
import { useLocaleText } from "@services/i18n/i18n";
import { useItems } from "@services/itemList/local";

const ItemContextMenu = ({ id, index }: { id: string; index: string }) => {
  const { add: addItem, remove: removeItem, items } = useItems();
  const { t } = useLocaleText("@components/ItemContextMenu");
  const menus = (
    [
      items.includes(id)
        ? [{ name: "removeFromList", label: t("removeItem") }]
        : [{ name: "addToList", label: t("addItem") }],
      [{ name: "id", label: fmt(t("copyId"), { id }) }],
    ] as const
  ).flat();
  const menuClick = async (name: (typeof menus)[number]["name"]) => {
    switch (name) {
      case "addToList":
        addItem(id);
        toast(fmt(t("addItemDone"), { id }));
        return;
      case "removeFromList":
        removeItem(id);
        toast(fmt(t("removeItemDone"), { id }));
        return;
      case "id":
        await copyToClip(id);
        toast(fmt(t("copyIdDone"), { id }));

        return;
    }
  };
  return <ContextMenu items={menus} onClick={menuClick} />;
};

export { ItemContextMenu };
