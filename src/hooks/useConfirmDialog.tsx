import { atom, useAtom, createStore, Provider } from "jotai";
import { ConfirmDialog } from "@components/ConfirmDialog";
import type { ConfirmDialogProps as Props } from "@components/ConfirmDialog";

type ShowDialogProps = Omit<Props, "show" | "onClose">;

const showAtom = atom(false);
const propAtom = atom<Omit<Props, "show">>({ content: "", onClose: () => null });
const store = createStore();

const InnerDialog = () => {
  const [show] = useAtom(showAtom);
  const [props] = useAtom(propAtom);
  return <ConfirmDialog {...{ ...props, show }} />;
};

const Dialog = () => {
  return (
    <Provider store={store}>
      <InnerDialog />
    </Provider>
  );
};

const showDialog = (props: ShowDialogProps) => {
  const emptyProp = { content: "", title: "", choises: [], onClose: () => null };
  return new Promise<string>(resolve => {
    const onClose = (key: string) => {
      store.set(showAtom, false);
      store.set(propAtom, emptyProp);
      resolve(key);
    };
    store.set(showAtom, true);
    store.set(propAtom, { ...props, onClose });
  });
};

const useConfirmDialog = () => {
  return { showDialog };
};

export { useConfirmDialog, Dialog as ConfirmDialog, showDialog };
export type { ShowDialogProps };
