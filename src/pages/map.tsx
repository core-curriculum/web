import type { NextPage, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
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
import { Locale, useLocaleText, useTranslation } from "@services/i18n/i18n";
import { useCurriculumMapData } from "@services/itemList/hooks/curriculumMap";
import { useAddViewHistory } from "@services/itemList/hooks/viewHistory";
import { useServerTemplate, useShare as useShareItemList } from "@services/itemList/local";
import { loadFullOutcomesTable, makeOutcomesTree } from "@services/outcomes";
import type { OutcomeInfo } from "@services/outcomes";
import { searchOutcomes, searchTables } from "@services/search";
import { getAllTables, loadTableInfoDict, TableInfoSet } from "@services/tables";
import { listUrl } from "@services/urls";

type PageProps = {
  outcomesTree: Tree<OutcomeInfo>;
  allTables: TableInfoSet[];
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale }) => {
  const table = loadFullOutcomesTable(locale as Locale);
  const tableInfoDict = loadTableInfoDict(locale as Locale);
  const outcomesTree = makeOutcomesTree(table, tableInfoDict, locale as Locale);
  const allTables = getAllTables(locale as Locale);

  return {
    props: { outcomesTree, allTables },
  };
};

const Breadcrumb = ({ parents }: { parents: OutcomeInfo[] }) => {
  return (
    <>
      {parents.map((parent, i) => {
        return (
          <span className="text-xs text-base-content/40" key={parent.id}>
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
    <div className="sticky top-0 flex w-full items-center bg-base-100/80 backdrop-blur-sm">
      <div className="ml-2">
        <BackButton />
      </div>
    </div>
  );
};

const useShare = () => {
  const { share: shareItemList } = useShareItemList();
  const { showDialog } = useConfirmDialog();
  const { t } = useTranslation("@pages/map");
  const addHistory = useAddViewHistory();
  const share = async () => {
    try {
      const goBack = t("back");
      const res = await showDialog({
        content: (
          <>
            <div className="mb-4">{t("alertToShare")}</div>
          </>
        ),
        choises: [t("back"), t("proceedToShare")],
        primary: t("proceedToShare"),
      });
      if (res === goBack) return;
      const inserted = await shareItemList();
      addHistory(inserted);
      const url = listUrl(inserted.id);
      await showDialog({
        content: (
          <>
            <div className="mb-4">{t("wayToShare")}</div>
            <div className="flex align-middle">
              <Link href={url} className="hover:underline">
                {url}
              </Link>
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
  const { t } = useTranslation("@pages/map");
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
            {t("sharing")}
            <Image className="m-2" width="20" height="20" src="spinner.svg" alt="...shareing" />
          </>
        ) : (
          t("share")
        )}
      </button>
    </>
  );
};

const ListData = () => {
  const { schemaWithValue } = useSchemaWithValue();
  const { set: setListDataValue } = useCurriculumMapData();
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
  const { t } = useTranslation("@pages/list");
  const apply = async (templateId: string) => {
    const hasTemplate = templateId !== "";
    if (hasTemplate && !processed) {
      setProcessed(true);
      if (isDirty) {
        const choises = [t("doOverwrite"), t("cancel")];
        const res = await showDialog({
          content: t("waringToOverwrite"),
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
  const { t } = useLocaleText("@pages/map");
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
            const title = `${t("table") + tableInfo.number}. ${tableInfo.item}`;

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
