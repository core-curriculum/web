import { matchID, matchOutcomesItem } from "@services/search";

describe("matchId", () => {
  test("matchId match id", () => {
    const res = matchID("JnIA6vg", "JnIA6vg,JkxiJU4,JnIA6vs");
    expect(res).toBe(true);
  });
  test("matchId fail to match unmatched id", () => {
    const res = matchID("JnIA6vg", "JnIA7vg,JkxiJU4,JnIA6vs");
    expect(res).toBe(false);
  });
  test("matchId fail to match text", () => {
    const res = matchID("JnIA6vg", "アウトカム");
    expect(res).toBe(false);
  });
});

describe("matchIndex", () => {
  test("matchIndex match Index", () => {
    const res = matchID("PR-01-01-01", "PR-01-01-02,PR-01-01-01,IT-01-01,IT");
    expect(res).toBe(true);
  });
  test("matchIndex failt to match unmatch Index", () => {
    const res = matchID("PR-01-01-01", "PR-01-01-02,PR-01-01-03,IT-01-01,IT");
    expect(res).toBe(false);
  });
  test("matchIndex failt to match text", () => {
    const res = matchID("PR-01-01-01", "情報・科学技術に向き合うための倫理観とルール");
    expect(res).toBe(false);
  });
});

describe("matchOutcomesItem", () => {
  const sample = {
    layer: "l1",
    text: "プロフェッショナリズム",
    id: "JnGV10M",
    desc: "人の命に深く関わり健康を守るという医師の職責を十分に自覚し、多様性・人間性を尊重し、利他的な態度で診療にあたりながら、医師としての道を究めていく。",
    index: "PR",
    spell: "**Pr**ofessionalism",
  } as const;
  test("matchOutcomesItem match id", () => {
    const res = matchOutcomesItem(sample, "JnIA6vg,JkxiJU4,JnGV10M");
    expect(res).toBe(true);
  });
  test("matchOutcomesItem match index", () => {
    const res = matchOutcomesItem(sample, "PR-01-01-02,PR-01-01-03,PR,IT-01-01,IT");
    expect(res).toBe(true);
  });
});
