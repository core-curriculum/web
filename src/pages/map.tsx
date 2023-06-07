import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, Suspense, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { showConfirmDialog } from "@components/ConfirmDialog";
import { CopyButton } from "@components/CopyButton";
import { showInputFromHistoryDialog } from "@components/InputFromHistoryDialog";
import { ItemListList } from "@components/ItemListList";
import { showItemUrlInputComponentDialog } from "@components/ItemUrlInputDialog";
import { BackButton } from "@components/buttons/BackButton";
import { useLocaleText, useTranslation } from "@services/i18n/i18n";
import {
  useCurriculumMapData,
  useCurriculumMapItems,
} from "@services/itemList/hooks/curriculumMap";
import { useCurriculumMapSchema } from "@services/itemList/hooks/schema";
import { useAddViewHistory } from "@services/itemList/hooks/viewHistory";
import {
  schemaItemsWithValue,
  useServerTemplate,
  useShare as useShareItemList,
} from "@services/itemList/local";
import { listUrl } from "@services/urls";

const HeaderBar = () => {
  return (
    <div className="sticky top-0 flex w-full items-center bg-base-100/80 backdrop-blur-sm">
      <div className="ml-2">
        <BackButton />
      </div>
    </div>
  );
};
const Spinner = () => <Image className="m-2" width="20" height="20" src="spinner.svg" alt="" />;
const Loading = () => {
  const { t } = useTranslation("@pages/map");
  return (
    <>
      <Spinner />
      {t("loading")}
    </>
  );
};
const Sharing = () => {
  const { t } = useTranslation("@pages/map");
  return (
    <>
      <Spinner />
      {t("sharing")}
    </>
  );
};

const useShare = () => {
  const { share: shareItemList } = useShareItemList();
  const { t } = useTranslation("@pages/map");
  const addHistory = useAddViewHistory();
  const share = async () => {
    try {
      const goBack = t("back");
      const res = await showConfirmDialog({
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
      await showConfirmDialog({
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
  const { isValid } = useCurriculumMapSchema();
  const { share } = useShare();
  const [sharing, setSharing] = useState(false);
  const _share = async () => {
    setSharing(true);
    await share();
    setSharing(false);
  };
  return (
    <button className="btn-primary btn" disabled={!isValid || sharing} onClick={_share}>
      {sharing ? <Sharing /> : t("share")}
    </button>
  );
};

const AddFromUrlButton = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("@pages/map");
  const { addItems } = useCurriculumMapItems();
  const onClick = async () => {
    setLoading(true);
    const res = await showItemUrlInputComponentDialog();
    if (res) {
      addItems(res);
    }
    setLoading(false);
  };
  return (
    <button className="btn" disabled={loading} onClick={onClick}>
      {loading ? <Loading /> : t("addFromUrl")}
    </button>
  );
};

const AddFromHistoryButton = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("@pages/map");
  const { addItems } = useCurriculumMapItems();
  const onClick = async () => {
    setLoading(true);
    const res = await showInputFromHistoryDialog();
    if (res) {
      addItems(res);
    }
    setLoading(false);
  };
  return (
    <button className="btn" disabled={loading} onClick={onClick}>
      {loading ? <Loading /> : t("addFromHistory")}
    </button>
  );
};

const CurriculumMapData = () => {
  const { set: setDataValue, listData } = useCurriculumMapData();
  const { schema } = useCurriculumMapSchema();
  const { t } = useTranslation("@services/itemList/libs/schema_map");

  const schemaWithValue = schemaItemsWithValue(listData, schema, t as (key: string) => string);

  const onChange = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setDataValue(key, e.target.value);
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
  const { isDirty } = useShareItemList();
  const { t } = useTranslation("@pages/list");
  const apply = async (templateId: string) => {
    const hasTemplate = templateId !== "";
    if (hasTemplate && !processed) {
      setProcessed(true);
      if (isDirty) {
        const choises = [t("doOverwrite"), t("cancel")];
        const res = await showConfirmDialog({
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

const CurriculumMapPage: NextPage<{}> = () => {
  const { t } = useLocaleText("@pages/map");
  const { apply } = useTemplate();
  const router = useRouter();
  useEffect(() => {
    const templateId = router.query?.from;
    if (typeof templateId === "string") {
      apply(templateId);
    }
  }, [apply, router]);
  const { items, setItems } = useCurriculumMapItems();
  return (
    <>
      <div className="ml-4">
        <HeaderBar />
        <CurriculumMapData />
        <div className="m-4 flex">
          <AddFromUrlButton />
          <AddFromHistoryButton />
        </div>
        <ItemListList itemListList={items} onChange={items => setItems(items)} />
      </div>
      <div className="m-8">
        <ShareButton />
      </div>
    </>
  );
};

export default CurriculumMapPage;
