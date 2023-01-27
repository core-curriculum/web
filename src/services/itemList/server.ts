import { InputItemList, ServerItemList } from "@services/itemList/types";
import { Schema } from "@services/schema";

const shareItemListToServer = async (itemList: InputItemList): Promise<ServerItemList> => {
  const posted = await fetch("/api/v1/itemList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemList),
  });
  if (posted.ok) {
    const inserted = await posted.json();
    return inserted;
  }
  throw new Error("Fail to share itemList.");
};

const getItemListFromServer = async (id: string): Promise<ServerItemList> => {
  const params = new URLSearchParams({ id })
  const res = await fetch(`/api/v1/itemList?${params}`, {
    method: "GET",
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  throw new Error("Fail to get itemList.");
};

const getSchema = async (schemaId: string | undefined): Promise<Schema | null> => {
  return null;
}


export { shareItemListToServer, getItemListFromServer }