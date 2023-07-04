import { useState } from "react";
import { useTranslation } from "@services/i18n/i18n";
import { useViewHistory } from "@services/itemList/hooks/viewHistory";
import { ServerItemList } from "@services/itemList/server";
import { ItemListCheckList } from "./ItemListCheckList";
import { showModal } from "./Modal";

type Props = {
  onConfirm?: (items: ReadonlyArray<ServerItemList>) => void;
  onCancel?: () => void;
  idsToExclude?: ReadonlyArray<string>;
};

const InputFromHistoryDialog: React.FC<Props> = ({ onConfirm, onCancel, idsToExclude }) => {
  const { t } = useTranslation("@components/InputFromHistoryDialog");
  const { viewHistory } = useViewHistory();
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const filteredHistory = viewHistory.filter(history => !(idsToExclude ?? []).includes(history.id));
  const onChange = (checked: number[]) => {
    setCheckedList(checked);
  };
  return (
    <>
      <ItemListCheckList
        itemListList={filteredHistory}
        checkedList={checkedList}
        onChange={onChange}
      />
      <div className="mt-4 flex justify-end space-x-4">
        <button className="btn" onClick={() => onCancel?.()}>
          {t("cancel")}
        </button>
        <button
          className="btn-primary btn"
          disabled={checkedList.length === 0}
          onClick={() => onConfirm?.(checkedList.map(i => filteredHistory[i]))}
        >
          {t("confirm")}
        </button>
      </div>
    </>
  );
};

const showInputFromHistoryDialog = async (idsToExclude?: readonly string[]) => {
  const response = await showModal<ReadonlyArray<ServerItemList>>((ok, cancel) => (
    <InputFromHistoryDialog onConfirm={ok} onCancel={() => cancel()} idsToExclude={idsToExclude} />
  ));
  return response.hasResponse ? response.response : null;
};

export { showInputFromHistoryDialog };
