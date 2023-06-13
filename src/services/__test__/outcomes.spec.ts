import * as path from "path";
import { Locale } from "@services/i18n/i18n";
import {
  loadFullOutcomesTable,
  makeMappedOutcomesTable,
  makeOutcomesTree,
} from "@services/outcomes";
import { loadTableInfoDict } from "@services/tables";

const testDataFile = path.resolve(__dirname, "testData.csv");
const locale: Locale = "ja";

describe("loadFullOutcomes", () => {
  test("loadFullOutcomes", () => {
    const data = loadFullOutcomesTable(locale);
    const sampeData = [
      "プロフェッショナリズム",
      "信頼",
      "誠実さ",
      "患者や社会に対して誠実である行動とはどのようなものかを考え、そのように行動する (利益相反等)。",
      "JnGV10M",
      "JnGUEbM",
      "JnIA6vg",
      "JkxiJUs",
      "PR",
      "PR-01",
      "PR-01-01",
      "PR-01-01-01",
      "人の命に深く関わり健康を守るという医師の職責を十分に自覚し、多様性・人間性を尊重し、利他的な態度で診療にあたりながら、医師としての道を究めていく。",
      "社会から信頼を得る上で必要なことを常に考え行動する。",
      "**Pr**ofessionalism",
    ];
    expect(data.length).toBe(596);
    expect(data[0].length).toBe(15);
    expect(data[1]).toEqual(sampeData);
  });
});

describe("makeMappedOutcomesTable", () => {
  test("makeMappedOutcomesTable", () => {
    const table = loadFullOutcomesTable(locale);
    const tableInfo = loadTableInfoDict(locale);
    const data = makeMappedOutcomesTable(table, tableInfo, locale);
    const sampleData = [
      {
        layer: "l1",
        text: "プロフェッショナリズム",
        id: "JnGV10M",
        desc: "人の命に深く関わり健康を守るという医師の職責を十分に自覚し、多様性・人間性を尊重し、利他的な態度で診療にあたりながら、医師としての道を究めていく。",
        index: "PR",
        spell: "**Pr**ofessionalism",
      },
      {
        layer: "l2",
        text: "信頼",
        id: "JnGUEbM",
        desc: "社会から信頼を得る上で必要なことを常に考え行動する。",
        index: "PR-01",
      },
      { layer: "l3", text: "誠実さ", id: "JnIA6vg", index: "PR-01-01" },
      {
        layer: "l4",
        text: "患者や社会に対して誠実である行動とはどのようなものかを考え、そのように行動する (利益相反等)。",
        id: "JkxiJUs",
        index: "PR-01-01-01",
      },
    ];
    expect(data.length).toBe(table.length);
    expect(data[1]).toEqual(sampleData);
  });
});

describe("makeOutcomesTree", () => {
  test("makeOutcomesTree", () => {
    const table = loadFullOutcomesTable(locale);
    const tableInfo = loadTableInfoDict(locale);
    const data = makeOutcomesTree(table, tableInfo, locale);
    expect(data.length).toBe(10);
  });
});
