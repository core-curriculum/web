type Text = {
  [path: string]: {
    [key: string]: {
      ja: string;
      en: string;
    };
  };
};

const text = {
  $common: {
    siteTitle: { ja: "コアカリナビ", en: "Core Curriculum Navigator" },
  },
  "@components/NaviBar": {
    title: { ja: "コアカリナビ", en: "コアカリナビ" },
    search: { ja: "検索", en: "Search" },
    associateItems: { ja: "授業との関連付け", en: "Associate with classes" },
    curriculumMap: { ja: "カリキュラムマップの作成", en: "Create a curriculum map" },
    qAndA: { ja: "Q&A", en: "Q&A" },
    citeas: { ja: "引用方法", en: "How to cite" },
    movies: { ja: "解説動画", en: "Movies" },
  },
  "@components/LinktoItemList": {
    title: { ja: "リスト", en: "List" },
  },
  "@components/ItemListList": {
    name: { ja: "名前", en: "name" },
    place: { ja: "場所", en: "place" },
    created_at: { ja: "作成日時", en: "Created at" },
  },
  "@components/ItemListCheckList": {
    name: { ja: "名前", en: "name" },
    place: { ja: "場所", en: "place" },
    created_at: { ja: "作成日時", en: "Created at" },
  },
  "@components/InputFromHistoryDialog": {
    cancel: { ja: "キャンセル", en: "Cancel" },
    confirm: { ja: "追加する", en: "Add Items" },
  },
  "@components/ItemContextMenu": {
    addItem: { ja: "授業に関連づける", en: "Associate with class" },
    copyId: { ja: "idをコピー", en: "Copy id" },
    removeItem: { ja: "授業の関連付けから削除", en: "Remove from association with class" },
    addItemDone: { ja: "授業に関連づけました", en: "Associated with class" },
    copyIdDone: {
      ja: "id({id})をクリップボードにコピーしました",
      en: "Copied id({id}) to clipboard",
    },
    removeItemDone: {
      ja: "授業の関連付けから削除しました",
      en: "Removed from association with class",
    },
  },
  "@components/ItemUrlInputDialog": {
    description: {
      ja: "授業担当者から送られたurlを入力してください(1行につき1つのurlを入力)",
      en: "Enter the url sent by the class instructor (one url per line)",
    },
  },
  "@components/buttons/BackButton": {
    target: { ja: "学修目標一覧へ", en: "Back to Outcomes" },
  },
  "@pages/list": {
    title: {
      ja: "授業との関連付けリスト | モデルコアカリキュラム",
      en: "List of associations with classes | Model Core Curriculum",
    },
    confirmToClear: {
      ja: "入力した内容を破棄してよろしいですか?",
      en: "Are you sure you want to clear the input?",
    },
    clear: {
      ja: "クリア",
      en: "Clear",
    },
    doClear: {
      ja: "入力した内容を破棄する",
      en: "Clear",
    },
    doCancel: {
      ja: "キャンセル",
      en: "Cancel",
    },
    table: { ja: "表", en: "Table" },
    share: { ja: "共有する", en: "Share" },
    sharing: { ja: "共有中...", en: "Sharing..." },
    noItems: {
      ja: "関連付けを追加するためには、各学習項目右の「･･･」ボタンから「授業に関連づける」を選んでください",
      // eslint-disable-next-line max-len
      en: 'To add an association, select "Associate with class" from the "..." button on the right of each learning item.',
    },
    discription: {
      // eslint-disable-next-line max-len
      ja: "授業・科目に関連するモデル・コア・カリキュラムの学修目標リストを作成します。関連する学修目標とは、該当科目において、点数や成績をつける、もしくはフィードバックを行う(レポートにコメントする・口頭でコメント・学生同士でコメントし合うなど)学習目標を指します。",
      // eslint-disable-next-line max-len
      en: "Create a list of learning objectives of the Model Core Curriculum related to classes and subjects. The related learning objectives are those that are scored or graded, or that provide feedback (e.g., commenting on a report or orally) in the subject in question.",
    },
    back: { ja: "戻る", en: "Back" },
    proceedToShare: { ja: "問題ないので共有する", en: "Proceed to share" },
    alertToShare: {
      ja: "共有した内容はurlを知っていれば誰でも閲覧可能になります。個人情報・機密情報が含まれていないことを確認した下さい。",
      // eslint-disable-next-line max-len
      en: "The shared content will be viewable by anyone who knows the url. Please make sure that it does not contain personal or confidential information.",
    },
    wayToShare: {
      ja: "このリストを共有するには以下のurlを共有してください。",
      en: "Share this list by sharing the following url.",
    },
    cancel: { ja: "キャンセル", en: "Cancel" },
    doOverwrite: { ja: "破棄して上書き", en: "Overwrite" },
    waringToOverwrite: {
      ja: "編集中のリストがあります。破棄して新しいリストで上書きしますか?",
      // eslint-disable-next-line max-len
      en: "There is a list being edited. Do you want to discard it and overwrite it with a new list?",
    },
  },
  "@pages/movies": {
    title: { ja: "解説動画 | コアカリナビ", en: "Movies | Core Curriculum Navigator" },
    h1: { ja: "解説動画", en: "Movies" },
    linkToListPage: { ja: "動画一覧ページへ", en: "Go to movies list" },
    discription: {
      // eslint-disable-next-line max-len
      ja: "モデル・コア・カリキュラムの各資質・能力について、またモデル・コア・カリキュラムをどのようにカリキュラムに活かしていくかに関して解説した動画集です。",
      // eslint-disable-next-line max-len
      en: "A collection of videos explaining each of the Model Core Curriculum's qualities and abilities (competencies), as well as how to use the Model Core Curriculum in the curriculum.",
    },
  },
  "@pages/citeas": {
    title: {
      ja: "引用方法 | モデルコアカリキュラム",
      en: "How to cite | Model Core Curriculum",
    },
    h1: { ja: "引用方法", en: "How to cite" },
    example_title: { ja: "引用例", en: "Example" },
    download: {
      ja: "文献管理ソフトウェア用ファイルダウンロード",
      en: "Download for reference management software",
    },
  },
  "@pages/map": {
    title: {
      ja: "カリキュラムマップ | モデルコアカリキュラム",
      en: "Curriculum Map | Model Core Curriculum",
    },
    confirmToClear: {
      ja: "入力した内容を破棄してよろしいですか?",
      en: "Are you sure you want to clear the input?",
    },
    clear: {
      ja: "クリア",
      en: "Clear",
    },
    doClear: {
      ja: "入力した内容を破棄する",
      en: "Clear",
    },
    doCancel: {
      ja: "キャンセル",
      en: "Cancel",
    },
    table: { ja: "表", en: "Table" },
    share: { ja: "共有する", en: "Share" },
    sharing: { ja: "共有中...", en: "Sharing..." },
    loading: { ja: "ロード中...", en: "Loading..." },
    addFromUrl: { ja: "...urlから追加", en: "...Add from url" },
    addFromHistory: { ja: "...履歴から追加", en: "...Add from history" },
    back: { ja: "戻る", en: "Back" },
    proceedToShare: { ja: "問題ないので共有する", en: "Proceed to share" },
    alertToShare: {
      ja: "共有した内容はurlを知っていれば誰でも閲覧可能になります。個人情報・機密情報が含まれていないことを確認した下さい。",
      // eslint-disable-next-line max-len
      en: "The shared content will be viewable by anyone who knows the url. Please make sure that it does not contain personal or confidential information.",
    },
    wayToShare: {
      ja: "このカリキュラムマップを共有するには以下のurlを共有してください。",
      en: "Share this curriculum map by sharing the following url.",
    },
    cancel: { ja: "キャンセル", en: "Cancel" },
    doOverwrite: { ja: "破棄して上書き", en: "Overwrite" },
    waringToOverwrite: {
      ja: "編集中のリストがあります。破棄して新しいリストで上書きしますか?",
      // eslint-disable-next-line max-len
      en: "There is a list being edited. Do you want to discard it and overwrite it with a new list?",
    },
  },
  "@pages/list/table/[id]": {
    title: { ja: "{name} | モデルコアカリキュラム", en: "{name} | Model Core Curriculum" },
    table: { ja: "表", en: "Table" },
  },
  "@pages/list/tables": {
    title: { ja: "別表一覧 | モデルコアカリキュラム", en: "Tables | Model Core Curriculum" },
    h1: { ja: "別表一覧", en: "Tables" },
    table: { ja: "表", en: "Table" },
  },
  "@pages/x/[id]": {
    title: { ja: "{name} | モデルコアカリキュラム", en: "{name} | Model Core Curriculum" },
    table: { ja: "表", en: "Table" },
    downloadL1: {
      ja: "第1層と授業の関連付けデータをダウンロード(csv)",
      en: "Download the association data between the first layer and the class (csv)",
    },
    downloadL2: {
      ja: "第2層と授業の関連付けデータをダウンロード(csv)",
      en: "Download the association data between the second layer and the class (csv)",
    },
    downloadL3: {
      ja: "第3層と授業の関連付けデータをダウンロード(csv)",
      en: "Download the association data between the third layer and the class (csv)",
    },
    downloadL4: {
      ja: "第4層と授業の関連付けデータをダウンロード(csv)",
      en: "Download the association data between the forth layer and the class (csv)",
    },
    downloadL1to4: {
      ja: "第1層から第4層と授業の関連付けデータをダウンロード(csv)",
      en: "Download the association data between the first to fourth layers and the class (csv)",
    },
    downloadTable: {
      ja: "表データと授業の関連付けデータをダウンロード(csv)",
      en: "Download table data and association data with classes (csv)",
    },
    downloadClassess: {
      ja: "授業一覧とurlをダウンロード(csv)",
      en: "Download list of classes and urls (csv)",
    },
    "item-name": { ja: "名前", en: "name" },
    "item-place": { ja: "場所", en: "place" },
    "item-url": { ja: "url", en: "url" },
    "item-url-to-edit": {
      ja: "この内容を元に新しい項目を作成",
      en: "Start a new edit based on this content",
    },
    notFound: {
      ja: "該当する項目が見つかりません。",
      en: "No matching items were found.",
    },
    accessQRToThisPage: {
      ja: "このページには以下のコードでアクセスできます",
      en: "Access this page with the following code",
    },
    descriptionToEdit: {
      ja: "このページの内容は編集できません。内容を変更したページを作るには以下から",
      // eslint-disable-next-line max-len
      en: "The contents of this page cannot be edited. To create a page with modified content, click here",
    },
    startEdit: {
      ja: "このページの内容を元に新しい編集を開始する",
      en: "Start a new edit based on the contents of this page",
    },
    makeCurriculumMap: {
      ja: "(管理者用) カリキュラムマップを作成・編集する",
      en: "(Admin) Create and edit a curriculum map",
    },
    downLoadQrCode: {
      ja: "QRコードをダウンロードする",
      en: "Download QR code",
    },
    descriptionOfItemList: {
      // eslint-disable-next-line max-len
      ja: "このページは、授業・科目に関連するモデル・コア・カリキュラムの学修目標を示しています。以下に示された学修目標について点数や成績がつけられたり、フィードバックが行われたりします。",
      // eslint-disable-next-line max-len
      en: "This page shows the learning objectives of the Model Core Curriculum related to classes and subjects. The learning outcomes shown below are scored, graded, and given feedback.",
    },
  },
  "@pages/search": {
    title: { ja: "検索 | モデルコアカリキュラム", en: "Search | Model Core Curriculum" },
    table: { ja: "表", en: "Table" },
    placeholder: { ja: "検索語もしくはカンマ区切りid", en: "Search term or comma separated ids" },
  },
  "@services/replaceMap": {
    table: { ja: "表", en: "Table" },
  },
  "@components/GeneralGuidance": {
    discription1: {
      // eslint-disable-next-line max-len
      ja: `モデル・コア・カリキュラムは、日本の大学の医学部で医師を養成する卒前医学教育に関して、各大学が策定する「カリキュラム」のうち、全大学で共通して取り組むべき「コア」の部分を抽出し、「モデル」として体系的に整理したものです。各大学における具体的な医学教育は、学修時間数の 3 分の 2 程度を目安にモデル・コア・カリキュラムを踏まえたものとし、残りの 3 分の 1 程度の内容は、大学が自主的・自律的に編成するものとされています。`,
      // eslint-disable-next-line max-len
      en: `The Model Core Curriculum for Medical Education is a systematically organized model that is formed by extracting the core parts of the curriculum that should be commonly addressed by all Japanese universities when formulating their own medical education curricula. The Model Core Curriculum forms the basis for two-thirds of a medical school's curriculum, with the remaining third set by the university. It was revised in the 2022 academic year as part of the standard six-year revision cycle, and the revisions reflect and respond to various changes to related systems, relevant new and amended laws, and changing social circumstances.`,
    },
    discription2: {
      // eslint-disable-next-line max-len
      ja: `一般社団法人日本医学教育学会(医学教育学会)は、文部科学省「大学における医療人養成の在り方に関する調査研究委託事業」による委託に基づき「医学教育モデル・コア・カリキュラム（令和4年度改訂版）」を作成いたしました。このページは医学教育学会「モデル・コア・カリキュラム改訂等に関する調査研究チーム」が、「医学教育モデル・コア・カリキュラム（令和4年度改訂版）」に基づいて作成しています。`,
      // eslint-disable-next-line max-len
      en: `This page contains the official English translation of the original Japanese revision, produced by the Model Core Curriculum Expert Research Committee of the Japan Society for Medical Education, as part of a project commissioned by the Ministry of Education, Culture, Sports, Science and Technology (MEXT).`,
    },
    linkMextText: {
      ja: "文部科学省モデル・コア・カリキュラム公表ページ",
      en: "MEXT Model Core Curriculum page (Japanese page)",
    },
    pdfLink: {
      ja: "https://www.mext.go.jp/content/20230207-mxt_igaku-000026049_00001.pdf",
      en: "https://www.mext.go.jp/content/20230315-mxt_igaku-000026049_00003.pdf",
    },
    pdfLinkText: {
      ja: "pdfダウンロード (8.2MB)",
      en: "Download pdf (9.7MB)",
    },
    qAndA: {
      ja: "モデル・コア・カリキュラムに関するQ&A",
      en: "Q&A about the Model Core Curriculum",
    },
    movies: {
      ja: "解説動画",
      en: "Movies",
    },
  },
  "@pages/index": {
    outcomesTitle: { ja: "資質・能力", en: "Outcomes" },
    tables: { ja: "別表一覧", en: "Tables" },
    discription: {
      // eslint-disable-next-line max-len
      ja: "モデル・コア・カリキュラムでは、医学生が卒業するまでに身に付けるべき能力を10の資質・能力(第1層)として提示し、詳細を第2層から4層までの項目と、関連づけられた別表で示しています。",
      // eslint-disable-next-line max-len
      en: "The Model Core Curriculum presents 10 outcomes (the first layer) that medical students should acquire by the time they graduate, and details are shown in items from the second to fourth layers and related tables.",
    },
    title: {
      ja: "医学教育モデル・コア・カリキュラム",
      en: "Model Core Curriculum for Medical Education",
    },
  },
  "@services/itemList/libs/schema_list": {
    $name: { ja: "授業・科目名", en: "name" },
    $place: { ja: "分類(学年・区分など)", en: "place" },
  },
  "@services/itemList/libs/schema_map": {
    $name: { ja: "カリキュラム名", en: "name" },
    $place: { ja: "分類(施設・大学名など)", en: "place" },
  },
} as const satisfies Text;

type LocaleText = typeof text;

export { text };
export type { LocaleText };
