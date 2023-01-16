import { insertNewList, getItemListFromId } from "../serverItemList";

if (false) {
  test("insert new List", async () => {
    const data = await insertNewList({
      items: ["id1", "id2", "id3", "id4"],
      ex_data: { place: "school", "name": "tkondo" }
    })
    console.log(data);
  })

  test("get itemList", async () => {
    const data = await getItemListFromId("wi9hPJadTyCgvvTbDAa5VQ")
    console.log(data);
  })
}