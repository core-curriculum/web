import { useState } from "react";
import { useTranslation } from "@services/i18n/i18n";
import { useViewHistory } from "@services/itemList/hooks/viewHistory";
import { ServerItemList } from "@services/itemList/server";
import { ItemListCheckList } from "./ItemListCheckList";
import { showModal } from "./Modal";

type Props = {
  onConfirm?: (items: ReadonlyArray<ServerItemList>) => void;
  onCancel?: () => void;
};

const InputFromHistoryDialog: React.FC<Props> = ({ onConfirm, onCancel }) => {
  const { t } = useTranslation("@components/InputFromHistoryDialog");
  const { viewHistory } = useViewHistory();
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const onChange = (checked: number[]) => {
    setCheckedList(checked);
  };
  return (
    <>
      <ItemListCheckList itemListList={viewHistory} checkedList={checkedList} onChange={onChange} />
      <div className="mt-4 flex flex-row justify-end">
        <button onClick={() => onCancel?.()}>{t("cancel")}</button>
        <button
          className="ml-2"
          disabled={checkedList.length === 0}
          onClick={() => onConfirm?.(checkedList.map(i => viewHistory[i]))}
        >
          {t("confirm")}
        </button>
      </div>
    </>
  );
};

const showInputFromHistoryDialog = async () => {
  const response = await showModal<ReadonlyArray<ServerItemList>>((ok, cancel) => (
    <InputFromHistoryDialog onConfirm={ok} onCancel={() => cancel()} />
  ));
  return response.hasResponse ? response.response : null;
};

export { showInputFromHistoryDialog };
