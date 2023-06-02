import { useCallback, useState } from "react";
import { formatDateTimeIntl } from "@libs/utils";
import { useLocale, useTranslation } from "@services/i18n/i18n";
import { ServerItemList } from "@services/itemList/server";

type CheckableRowProps = {
  items: ReadonlyArray<string>;
  checked: boolean;
  onChange?: (checked: boolean) => void;
};
const Checkbox = ({ checked }: { checked: boolean }) => (
  <input className="checkbox mr-2" type="checkbox" checked={checked} />
);

const CheckableRow = ({ items, checked, onChange }: CheckableRowProps) => {
  return (
    <tr onClick={() => onChange?.(!checked)} className="cursor-pointer hover:bg-primary-focus/20">
      {items.map((item, i) => {
        const needCheck = i === 0;
        return (
          <td key={i} className="bg-transparent">
            <div className="flex flex-row  items-center">
              {needCheck && <Checkbox checked={checked} />}
              {item}
            </div>
          </td>
        );
      })}
    </tr>
  );
};

type Props = {
  itemListList: ServerItemList[];
  checkedList: number[];
  onChange?: (checkedList: number[]) => void;
};

const ItemListCheckList = ({ itemListList, checkedList, onChange }: Props) => {
  const { t } = useTranslation("@components/ItemListCheckList");
  const { locale } = useLocale();
  const [allChecked, setAllChecked] = useState(false);
  const onCheckChange = useCallback(
    (index: number, newCheckState: boolean) => {
      if (newCheckState && checkedList.includes(index)) return;
      if (!newCheckState && !checkedList.includes(index)) return;
      const newCheckedList = newCheckState
        ? [...checkedList, index]
        : checkedList.filter(i => i !== index);
      onChange?.(newCheckedList);
    },
    [checkedList, onChange],
  );
  const onAllCheckChange = useCallback(() => {
    setAllChecked(prev => {
      const newCheckState = !prev;
      onChange?.(newCheckState ? itemListList.map((_, i) => i) : []);
      return newCheckState;
    });
  }, [itemListList, onChange]);

  return (
    <table className="table">
      <thead>
        <tr
          onClick={() => onAllCheckChange()}
          className="cursor-pointer bg-base-300 hover:bg-primary-focus/20"
        >
          <td className="bg-transparent">
            <div className="flex flex-row  items-center">
              <Checkbox checked={allChecked} />
              {t("name")}
            </div>
          </td>
          <td className="bg-transparent">{t("place")}</td>
          <td className="bg-transparent">{t("created_at")}</td>
        </tr>
      </thead>
      <tbody>
        {itemListList.map(({ id, name, place, created_at }, i) => (
          <CheckableRow
            key={id}
            checked={checkedList.includes(i)}
            items={[name, place, formatDateTimeIntl(created_at, locale)]}
            onChange={(checked: boolean) => onCheckChange(i, checked)}
          />
        ))}
      </tbody>
    </table>
  );
};

export { ItemListCheckList };
export type { Props as ItemListCheckListProps };
