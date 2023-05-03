type Text = {
  [path:string]:{
    [key:string]:{
      ja:string,
      en:string;
    }
  }
}

const text = {
  "@components/NaviBar": {
    title: {ja:"モデルコアカリキュラム",en:"Model Core Curriculum"},
    search: {ja:"検索",en:"Search"},
  },
  "@components/LinktoItemList": {
    title: {ja:"リスト",en:"List"},
  },
  "@components/ItemContextMenu": {
    addItem: {ja:"リストに追加",en:"Add to List"},
    copyId: {ja:"idをコピー",en:"Copy id"},
    removeItem: {ja:"リストから削除",en:"Remove from List"},
    addItemDone: {ja:"リストに追加しました",en:"Added to List"},
    copyIdDone: {ja:"id({id})をクリップボードにコピーしました",en:"Copied id({id}) to clipboard"},
    removeItemDone: {ja:"リストから削除しました",en:"Removed from List"},
  },
  "@components/buttons/BackButton":{
    target: {ja:"学修目標一覧へ",en:"Back to Outcomes"},
  },
  "@pages/list": {
    table: {ja:"表",en:"Table"},
  },
  "@pages/list/table/[id]": {
    table: {ja:"表",en:"Table"},
  },
  "@pages/x/[id]": {
    table: {ja:"表",en:"Table"},
  },
  "@pages/search": {
    table: {ja:"表",en:"Table"},
    placeholder: {ja:"検索語もしくはカンマ区切りid",en:"Search term or comma separated ids"},
  },
  "@services/replaceMap": {
    table: {ja:"表",en:"Table"},
  },
  "@components/GeneralGuidance": {
    discription1: {
      // eslint-disable-next-line max-len
      ja:`モデル・コア・カリキュラムは、日本の大学の医学部で医師を養成する卒前医学教育に関して、各大学が策定する「カリキュラム」のうち、全大学で共通して取り組むべき「コア」の部分を抽出し、「モデル」として体系的に整理したものです。各大学における具体的な医学教育は、学修時間数の 3 分の 2 程度を目安にモデル・コア・カリキュラムを踏まえたものとし、残りの 3 分の 1 程度の内容は、大学が自主的・自律的に編成するものとされています。`,
      // eslint-disable-next-line max-len
      en:`The Model Core Curriculum for Medical Education is a systematically organized model that is formed by extracting the core parts of the curriculum that should be commonly addressed by all Japanese universities when formulating their own medical education curricula. The Model Core Curriculum forms the basis for two-thirds of a medical school's curriculum, with the remaining third set by the university. It was revised in the 2022 academic year as part of the standard six-year revision cycle, and the revisions reflect and respond to various changes to related systems, relevant new and amended laws, and changing social circumstances.`
    },
    discription2: {
      // eslint-disable-next-line max-len
      ja:`一般社団法人日本医学教育学会(医学教育学会)は、文部科学省「大学における医療人養成の在り方に関する調査研究委託事業」による委託に基づき「医学教育モデル・コア・カリキュラム（令和4年度改訂版）」を作成いたしました。このページは医学教育学会「モデル・コア・カリキュラム改訂等に関する調査研究チーム」が、「医学教育モデル・コア・カリキュラム（令和4年度改訂版）」に基づいて作成しています。`,
      // eslint-disable-next-line max-len
      en:`This page contains the official English translation of the original Japanese revision, produced by the Model Core Curriculum Expert Research Committee of the Japan Society for Medical Education, as part of a project commissioned by the Ministry of Education, Culture, Sports, Science and Technology (MEXT).`
    },
    linkMextText: {
      ja: "文部科学省モデル・コア・カリキュラム公表ページ",
      en: "MEXT Model Core Curriculum page (Japanese page)"
    },
    pdfLink: {
      ja: "https://www.mext.go.jp/content/20230207-mxt_igaku-000026049_00001.pdf",
      en: "https://www.mext.go.jp/content/20230315-mxt_igaku-000026049_00003.pdf",
    },
    pdfLinkText: {
      ja: "pdfダウンロード (8.2MB)",
      en: "Download pdf (9.7MB)",
    }

  },
  "@pages/index": {
    outcomesTitle: {ja:"資質・能力",en:"Outcomes"},
    discription: {
      // eslint-disable-next-line max-len
      ja: "モデル・コア・カリキュラムでは、医学生が卒業するまでに身に付けるべき能力を10の資質・能力(第1層)として提示し、詳細を第2層から4層までの項目と、関連づけられた別表で示しています。",
      // eslint-disable-next-line max-len
      en: "The Model Core Curriculum presents 10 outcomes (the first layer) that medical students should acquire by the time they graduate, and details are shown in items from the second to fourth layers and related tables."
    },
    title: {
      ja: "医学教育モデル・コア・カリキュラム",
      en: "Model Core Curriculum for Medical Education"
    }
  }

} satisfies Text ;

type LocaleText = typeof text;


export { text };
export type { LocaleText };

