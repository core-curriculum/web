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
} satisfies Text ;

type LocaleText = typeof text;


export { text };
export type { LocaleText };

