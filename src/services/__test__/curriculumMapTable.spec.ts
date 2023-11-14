import { readFileSync } from "fs";
import path from "path";
import { parseCSV } from "@libs/csv";
import { makeOutcomeTableData } from "@services/curriculumMapTable";
import { Locale } from "@services/i18n/i18n";
import { ServerItemList } from "@services/itemList/server";
import { loadFullOutcomesTable, makeOutcomesTree } from "@services/outcomes";
import { getAllTables, loadTableInfoDict } from "@services/tables";

const locale: Locale = "ja";
const table = loadFullOutcomesTable(locale as Locale);
const tableInfoDict = loadTableInfoDict(locale as Locale);
const outcomesTree = makeOutcomesTree(table, tableInfoDict, locale as Locale);
const allTables = getAllTables(locale as Locale);

const dummyItems: ServerItemList[] = [
  {
    id: "1",
    name: "name_1",
    place: "place_1",
    items: ["JnGV10M", "JnGV10g", "JnGUMD"],
    schema_id: "",
    from_id: "",
    created_at: new Date(2023, 1, 1),
    data: {},
  },
  {
    id: "2",
    name: "name_2",
    place: "place_2",
    items: ["JnGUZAw", "JnGTvDw", "JkxpssQ"],
    schema_id: "",
    from_id: "",
    created_at: new Date(2023, 1, 1),
    data: {},
  },
  {
    id: "3",
    name: "name_3",
    place: "place_3",
    items: ["JkxnuKg", "JkxnuKM", "JkzptyA"],
    schema_id: "",
    from_id: "",
    created_at: new Date(2023, 1, 1),
    data: {},
  },
];

describe("makeOutcomeTableData", () => {
  test("layer 1", () => {
    const data = makeOutcomeTableData(dummyItems, outcomesTree, 1);
    const sampleData: string[][] = [
      ["index", "id", "item", "name_1", "name_2", "name_3"],
      ["", "", "", "place_1", "place_2", "place_3"],
      ["PR", "JnGV10M", "プロフェッショナリズム", "○", "", ""],
      ["GE", "JnGV10U", "総合的に患者・生活者をみる姿勢", "", "○", ""],
      ["LL", "JnGV10Y", "生涯にわたって共に学ぶ姿勢", "", "", ""],
      ["RE", "JnGV10g", "科学的探究", "○", "", ""],
      ["PS", "JnGV10k", "専門知識に基づいた問題解決能力", "", "", "○"],
      ["IT", "JnGV10s", "情報・科学技術を活かす能力", "", "", "○"],
      ["CS", "JnGV10w", "患者ケアのための診療技能", "", "", ""],
      ["CM", "JnGV104", "コミュニケーション能力", "", "○", ""],
      ["IP", "JnGV11A", "多職種連携能力", "", "", ""],
      ["SO", "JnGV11E", "社会における医療の役割の理解", "", "○", ""],
    ];
    expect(data).toEqual(sampleData);
  });

  test("layer 4", () => {
    const sampleDataFile = path.join(__dirname, "makeOutcomeTableData_layer4.csv");
    const data = makeOutcomeTableData(dummyItems, outcomesTree, 4);
    const sampleData = parseCSV(readFileSync(sampleDataFile, "utf-8"));
    expect(data).toEqual(sampleData.ok && sampleData.value);
  });
});
