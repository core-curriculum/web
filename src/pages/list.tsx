import type { NextPage, GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, Suspense, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CopyButton } from "@components/CopyButton";
import { ItemContextMenu } from "@components/ItemContextMenu";
import { Table } from "@components/Table";
import { BackButton } from "@components/buttons/BackButton";
import { useConfirmDialog } from "@hooks/useConfirmDialog";
import { HeaderedTable } from "@libs/tableUtils";
import { Tree } from "@libs/treeUtils";
import {
  useListData,
  useItems,
  useSchema,
  useSchemaWithValue,
  useServerTemplate,
  useShare as useShareItemList,
} from "@services/itemList/local";
import { loadFullOutcomesTable, makeOutcomesTree } from "@services/outcomes";
import type { OutcomeInfo } from "@services/outcomes";
import { searchOutcomes, searchTables } from "@services/search";
import { getAllTables, loadTableInfoDict, TableInfoSet } from "@services/tables";
import { listUrl } from "@services/urls";

type PageProps = {
  outcomesTree: Tree<OutcomeInfo>;
  allTables: TableInfoSet[];
};

export const getStaticProps: GetStaticProps<PageProps> = async context => {
  const table = loadFullOutcomesTable();
  const tableInfoDict = loadTableInfoDict();
  const outcomesTree = makeOutcomesTree(table, tableInfoDict);
  const allTables = getAllTables();

  return {
    props: { outcomesTree, allTables },
  };
};

const Breadcrumb = ({ parents }: { parents: OutcomeInfo[] }) => {
  return (
    <>
      {parents.map((parent, i) => {
        return (
          <span className="text-xs text-gray-400" key={parent.id}>
            {i !== 0 ? ` / ` : ""}
            <span>
              {parent.index.slice(-2)}
              {parent.text}
            </span>
          </span>
        );
      })}
    </>
  );
};

const HeaderBar = () => {
  return (
    <div className="sticky top-0 flex w-full items-center bg-white/80 backdrop-blur-sm">
      <div className="ml-2">
        <BackButton />
      </div>
    </div>
  );
};

const useShare = () => {
  const { share: shareItemList } = useShareItemList();
  const { showDialog } = useConfirmDialog();
  const share = async () => {
    try {
      const goBack = "戻る";
      const res = await showDialog({
        content: (
          <>
            <div className="mb-4">
              共有した内容はurlを知っていれば誰でも閲覧可能になります。個人情報・機密情報が含まれていないことを確認した下さい。
            </div>
          </>
        ),
        choises: ["戻る", "問題ないので共有する"],
        primary: "問題ないので共有する",
      });
      if (res === goBack) return;
      const inserted = await shareItemList();
      const url = listUrl(inserted.id);
      await showDialog({
        content: (
          <>
            <div className="mb-4">このリストを共有するには以下のurlを共有してください。 </div>
            <div className="flex align-middle">
              {url}
              <CopyButton className="pl-2" content={url} />
            </div>
          </>
        ),
      });
    } catch (e) {
      toast((e as Error).message);
    }
  };
  return { share };
};

const ShareButton = () => {
  const { isValid } = useSchema();
  const { share } = useShare();
  const [sharing, setSharing] = useState(false);
  const _share = async () => {
    setSharing(true);
    await share();
    setSharing(false);
  };
  return (
    <>
      <button className="btn" disabled={!isValid || sharing} onClick={_share}>
        {sharing ? (
          <>
            共有中...
            <Image className="m-2" width="20" height="20" src="spinner.svg" alt="...shareing" />
          </>
        ) : (
          "共有する"
        )}
      </button>
    </>
  );
};

const ListData = () => {
  const { schemaWithValue } = useSchemaWithValue();
  const { set: setListDataValue } = useListData();
  const onChange = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setListDataValue(key, e.target.value);
  };
  return (
    <Suspense fallback="loading...">
      <div className="m-4">
        {schemaWithValue.map(({ type, key, label, value }) => {
          return (
            <section key={key}>
              <label>{label ?? key}</label>
              <input
                type={type}
                className="input-bordered input m-4 w-full max-w-xs"
                placeholder={label ?? key}
                value={value}
                onChange={e => onChange(key, e)}
              />
            </section>
          );
        })}
      </div>
    </Suspense>
  );
};

const useTemplate = () => {
  const { apply: doApply } = useServerTemplate();
  const router = useRouter();
  const [processed, setProcessed] = useState(false);
  const { showDialog } = useConfirmDialog();
  const { isDirty } = useShareItemList();
  const apply = async (templateId: string) => {
    const hasTemplate = templateId !== "";
    if (hasTemplate && !processed) {
      setProcessed(true);
      if (isDirty) {
        const choises = ["破棄して上書き", "キャンセル"];
        const res = await showDialog({
          content: "編集中のリストがあります。破棄して新しいリストで上書きしますか?",
          choises,
        });
        if (res === choises[0]) await doApply(templateId);
      } else {
        await doApply(templateId);
      }
    }
    router.push(router.basePath);
  };
  return { apply };
};

const ListPage: NextPage<PageProps> = ({ outcomesTree, allTables }: PageProps) => {
  const { apply } = useTemplate();
  const router = useRouter();
  useEffect(() => {
    const templateId = router.query?.from;
    if (typeof templateId === "string") {
      apply(templateId);
    }
  }, [apply, router]);
  const { items } = useItems();
  const text = items.join(",");
  return (
    <>
      <div className="ml-4">
        <HeaderBar />
        <ListData />
        <div>
          {searchOutcomes(outcomesTree, text).map(item => (
            <div className="m-4" key={item.id}>
              <div>
                <span className="mr-2 font-light text-sky-600">{item.index}</span>
                {item.text}
                <ItemContextMenu id={item.id} index={item.index} />
              </div>
              <Breadcrumb parents={item.parents} />
            </div>
          ))}
        </div>
        <div className="ml-4">
          {searchTables(text, allTables).map(({ table, tableInfo, attrInfo }) => {
            const title = `表${tableInfo.number}. ${tableInfo.item}`;

            return (
              <div key={tableInfo.id}>
                <div>
                  <div className="my-4">{title}</div>
                  <Table {...{ table: table as HeaderedTable<string>, tableInfo, attrInfo }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="m-8">
        <ShareButton />
      </div>
    </>
  );
};

export default ListPage;
