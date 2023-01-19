import { atom, useAtom } from "jotai";
import { ConfirmDialog } from "@components/ConfirmDialog";
import type { ConfirmDialogProps as Props } from "@components/ConfirmDialog";

const showAtom = atom(false);
const propAtom = atom<Omit<Props, "show">>({ content: "", onClose: () => null });

const Dialog = () => {
  const [show] = useAtom(showAtom);
  const [props] = useAtom(propAtom);
  return <ConfirmDialog {...{ ...props, show }} />;
};

const useConfirmDialog = () => {
  type PartialProps = Omit<Props, "show" | "onClose">;
  const [, setShow] = useAtom(showAtom);
  const [, setProps] = useAtom(propAtom);
  const showDialog = (props: PartialProps) => {
    return new Promise<string>((resolve) => {
      const onClose = (key: string) => {
        setShow(false);
        console.log("close");
        resolve(key);
      };
      setProps({ ...props, onClose });
      setShow(true);
    });
  };
  return { showDialog };
};

export { useConfirmDialog, Dialog as ConfirmDialog };
