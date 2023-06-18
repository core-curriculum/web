import { useState } from "react";
import { useTranslation } from "@services/i18n/i18n";
import { getItemListFromServer } from "@services/itemList/local";
import { itemUrlToId, isValidItemUrlOrId } from "@services/urls";
import { showModal } from "./Modal";

const urlsToIds = (urls: string[]) => {
  return urls.flatMap(url => {
    const id = itemUrlToId(url);
    if (isValidItemUrlOrId(id)) return id;
    return [];
  });
};

const validateUrls = (urls: string[]) => {
  const ids = urlsToIds(urls);
  console.log(urls, ids);
  return ids.length === urls.length;
};

const splitText = (text: string) => {
  return text
    .split(/\n|,/)
    .map(url => url.trim())
    .filter(url => url !== "");
};

const textToIds = (text: string) => {
  return urlsToIds(splitText(text));
};

const validateText = (text: string) => {
  return validateUrls(splitText(text));
};

type ItemUrlInputComponentProps = {
  onValidateChange?: (valid: boolean) => void;
  onConfirm?: (ids: string[]) => void;
  onCancel?: () => void;
};
const ItemUrlInputComponent = ({
  onConfirm,
  onCancel,
  onValidateChange,
}: ItemUrlInputComponentProps) => {
  const [inputText, setInputText] = useState("");
  const { t } = useTranslation("@components/ItemUrlInputDialog");
  const isValid = validateText(inputText);
  const errorText = !isValid ? "Invalid URL" : "";
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(prev => {
      if (validateText(prev) !== validateText(text)) onValidateChange?.(validateText(text));
      return text;
    });
  };
  return (
    <>
      <div>{t("description")}</div>
      <span className="text-xs text-error">{errorText}</span>
      <textarea
        className="textarea-bordered textarea w-full"
        value={inputText}
        onChange={onChange}
      />
      <div className="mt-4 flex justify-end gap-1">
        <button className="btn-ghost btn" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="btn-primary btn"
          disabled={inputText === "" || !isValid}
          onClick={() => onConfirm?.(textToIds(inputText))}
        >
          Add
        </button>
      </div>
    </>
  );
};

const idsToServerItemList = async (ids: string[]) => {
  try {
    const response = await getItemListFromServer(ids);
    const items = response.flatMap(item => (item.ok ? item.data : []));
    return items;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const showItemUrlInputComponentDialog = async () => {
  const response = await showModal<string[]>((ok, cancel) => (
    <ItemUrlInputComponent onConfirm={ok} onCancel={() => cancel()} />
  ));
  const ids = response.hasResponse ? response.response : [];
  return ids.length > 0 ? await idsToServerItemList(ids) : null;
};

export { showItemUrlInputComponentDialog };
